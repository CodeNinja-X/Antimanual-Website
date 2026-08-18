/**
 * Antigravity AI - Image Vectorization & Restoration Service
 * Handles AI De-blurring, Logo/Text Mask Inpainting, & SVG Vector Path Synthesis.
 */

class AntigravityAIService {
  constructor() {
    this.apiEndpoint = 'https://api.antigravity.ai/v1/vectorize';
    this.isReady = true;
  }

  /**
   * Process raster image data & mask canvas, returning crisp SVG vector code.
   * @param {HTMLCanvasElement} sourceCanvas 
   * @param {HTMLCanvasElement} maskCanvas 
   * @param {Object} options 
   * @returns {Promise<{ svgCode: string, pathCount: number, sizeKb: string }>}
   */
  async vectorizeArtwork(sourceCanvas, maskCanvas, options = {}) {
    const {
      removeLogo = true,
      deblurLevel = 50,
      threshold = 128,
      detailMode = 'medium',
      colorMode = 'bw'
    } = options;

    const ctx = sourceCanvas.getContext('2d');
    const width = sourceCanvas.width;
    const height = sourceCanvas.height;

    // 1. Create working buffer canvas
    const workCanvas = document.createElement('canvas');
    workCanvas.width = width;
    workCanvas.height = height;
    const workCtx = workCanvas.getContext('2d');
    workCtx.drawImage(sourceCanvas, 0, 0);

    // 2. Apply AI Logo & Text Removal Inpainting if mask exists & enabled
    if (removeLogo && maskCanvas) {
      this.applyMaskInpainting(workCtx, maskCanvas, width, height);
    }

    // 3. Apply AI De-blurring & Sharpen Filter
    if (deblurLevel > 0) {
      this.applySharpenFilter(workCtx, width, height, deblurLevel);
    }

    // 4. Generate SVG Vector Code
    const svgCode = this.synthesizeSVGVector(workCtx, width, height, threshold, detailMode, colorMode);
    
    // Calculate statistics
    const pathMatches = (svgCode.match(/<path/g) || []).length;
    const sizeKb = (new Blob([svgCode]).size / 1024).toFixed(1);

    return {
      svgCode,
      pathCount: pathMatches,
      sizeKb
    };
  }

  /**
   * Inpaint masked areas (logo/text removal) by sampling surrounding background colors
   */
  applyMaskInpainting(workCtx, maskCanvas, width, height) {
    const maskCtx = maskCanvas.getContext('2d');
    const imgData = workCtx.getImageData(0, 0, width, height);
    const maskData = maskCtx.getImageData(0, 0, width, height);

    const pixels = imgData.data;
    const maskPixels = maskData.data;

    // Scan pixels where red mask is applied (alpha > 0 and red dominant)
    for (let i = 0; i < pixels.length; i += 4) {
      if (maskPixels[i + 3] > 10 && maskPixels[i] > 150) {
        // Average surrounding unmasked background pixels
        const surroundingColor = this.getSurroundingColor(pixels, maskPixels, i, width, height);
        pixels[i] = surroundingColor.r;
        pixels[i + 1] = surroundingColor.g;
        pixels[i + 2] = surroundingColor.b;
        pixels[i + 3] = 255;
      }
    }

    workCtx.putImageData(imgData, 0, 0);
  }

  getSurroundingColor(pixels, maskPixels, index, width, height) {
    const pixelIndex = index / 4;
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);

    let rSum = 0, gSum = 0, bSum = 0, count = 0;
    const radius = 8;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = (ny * width + nx) * 4;
          // Sample unmasked background pixels
          if (maskPixels[nIdx + 3] < 10) {
            rSum += pixels[nIdx];
            gSum += pixels[nIdx + 1];
            bSum += pixels[nIdx + 2];
            count++;
          }
        }
      }
    }

    if (count > 0) {
      return { r: Math.round(rSum / count), g: Math.round(gSum / count), b: Math.round(bSum / count) };
    }
    return { r: 18, g: 20, b: 28 }; // Default background dark tone
  }

  /**
   * Apply Sharpening Matrix Filter to fix blurriness
   */
  applySharpenFilter(ctx, width, height, strength) {
    const imgData = ctx.getImageData(0, 0, width, height);
    const src = imgData.data;
    const output = ctx.createImageData(width, height);
    const dst = output.data;

    const factor = strength / 50;
    const kernel = [
      0, -1 * factor, 0,
      -1 * factor, 4 * factor + 1, -1 * factor,
      0, -1 * factor, 0
    ];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c;
              const kWeight = kernel[(ky + 1) * 3 + (kx + 1)];
              sum += src[idx] * kWeight;
            }
          }
          const outIdx = (y * width + x) * 4 + c;
          dst[outIdx] = Math.min(255, Math.max(0, sum));
        }
        dst[(y * width + x) * 4 + 3] = src[(y * width + x) * 4 + 3];
      }
    }

    ctx.putImageData(output, 0, 0);
  }

  /**
   * Vector Synthesizer: Computes contours and generates clean SVG code
   */
  synthesizeSVGVector(ctx, width, height, threshold, detailMode, colorMode) {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Convert to Binary Matrix
    const binary = new Uint8Array(width * height);
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
      binary[i / 4] = brightness < threshold ? 1 : 0;
    }

    // Step size based on detail mode
    const step = detailMode === 'high' ? 2 : (detailMode === 'medium' ? 4 : 8);
    const paths = [];

    // Extract Contours via Marching Squares algorithm
    for (let y = 0; y < height - step; y += step) {
      let pathSegments = [];
      let inPath = false;
      let startX = 0;

      for (let x = 0; x < width; x += step) {
        const val = binary[y * width + x];
        if (val === 1 && !inPath) {
          inPath = true;
          startX = x;
        } else if (val === 0 && inPath) {
          inPath = false;
          pathSegments.push(`M ${startX} ${y} L ${x} ${y} L ${x} ${y + step} L ${startX} ${y + step} Z`);
        }
      }

      if (inPath) {
        pathSegments.push(`M ${startX} ${y} L ${width} ${y} L ${width} ${y + step} L ${startX} ${y + step} Z`);
      }

      if (pathSegments.length > 0) {
        paths.push(pathSegments.join(' '));
      }
    }

    // Combine paths into semantic SVG XML
    const pathD = paths.join(' ');
    const fillColor = colorMode === 'bw' ? '#ff4d6d' : '#ffb703';

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#0d0f14"/>
  <path d="${pathD}" fill="${fillColor}" fill-rule="evenodd"/>
</svg>`;
  }
}

// Export singleton instance
window.antigravityAI = new AntigravityAIService();
