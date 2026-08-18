/**
 * Antigravity AI Image Vectorizer - Main Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const sourceCanvas = document.getElementById('source-canvas');
  const maskCanvas = document.getElementById('mask-canvas');
  const emptyState = document.getElementById('empty-state');
  const splitViewer = document.getElementById('split-viewer');
  const processingOverlay = document.getElementById('processing-overlay');
  const processingMsg = document.getElementById('processing-msg');
  const svgRenderWrap = document.getElementById('svg-render-wrap');
  const svgCodeOutput = document.getElementById('svg-code-output');
  const vectorStats = document.getElementById('vector-stats');
  const processBtn = document.getElementById('process-btn');
  const downloadSvgBtn = document.getElementById('download-svg-btn');
  const copySvgBtn = document.getElementById('copy-svg-btn');

  // Controls
  const removeLogoToggle = document.getElementById('remove-logo-toggle');
  const brushControls = document.getElementById('brush-controls');
  const toolBrush = document.getElementById('tool-brush');
  const toolEraser = document.getElementById('tool-eraser');
  const toolResetMask = document.getElementById('tool-reset-mask');
  const brushSizeInput = document.getElementById('brush-size');
  const brushSizeVal = document.getElementById('brush-size-val');
  const deblurSlider = document.getElementById('deblur-slider');
  const deblurVal = document.getElementById('deblur-val');
  const thresholdSlider = document.getElementById('threshold-slider');
  const thresholdVal = document.getElementById('threshold-val');
  const detailModeSelect = document.getElementById('detail-mode');
  const colorModeSelect = document.getElementById('color-mode');

  // Application State
  let loadedImage = null;
  let isDrawing = false;
  let currentTool = 'brush'; // 'brush' or 'eraser'
  let currentSvgCode = '';

  // 1. Drag & Drop File Loader
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadImageFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      loadImageFile(e.target.files[0]);
    }
  });

  function loadImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        loadedImage = img;
        initCanvases(img);
        emptyState.classList.add('hidden');
        splitViewer.classList.remove('hidden');
        runAIProcessing();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // 2. Initialize Canvas & Mask Setup
  function initCanvases(img) {
    const maxDim = 1200;
    let width = img.width;
    let height = img.height;

    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    sourceCanvas.width = width;
    sourceCanvas.height = height;
    maskCanvas.width = width;
    maskCanvas.height = height;

    const sCtx = sourceCanvas.getContext('2d');
    sCtx.drawImage(img, 0, 0, width, height);

    clearMask();
  }

  function clearMask() {
    const mCtx = maskCanvas.getContext('2d');
    mCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
  }

  // 3. Interactive Mask Brush Drawing
  maskCanvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    drawMaskPoint(e);
  });

  maskCanvas.addEventListener('mousemove', (e) => {
    if (isDrawing) drawMaskPoint(e);
  });

  window.addEventListener('mouseup', () => {
    isDrawing = false;
  });

  function drawMaskPoint(e) {
    const rect = maskCanvas.getBoundingClientRect();
    const scaleX = maskCanvas.width / rect.width;
    const scaleY = maskCanvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const radius = parseInt(brushSizeInput.value, 10);

    const mCtx = maskCanvas.getContext('2d');
    mCtx.beginPath();
    mCtx.arc(x, y, radius, 0, Math.PI * 2);

    if (currentTool === 'brush') {
      mCtx.fillStyle = 'rgba(255, 77, 109, 0.7)';
      mCtx.fill();
    } else {
      mCtx.globalCompositeOperation = 'destination-out';
      mCtx.fill();
      mCtx.globalCompositeOperation = 'source-over';
    }
  }

  // Brush Controls
  toolBrush.addEventListener('click', () => {
    currentTool = 'brush';
    toolBrush.classList.add('active');
    toolEraser.classList.remove('active');
  });

  toolEraser.addEventListener('click', () => {
    currentTool = 'eraser';
    toolEraser.classList.add('active');
    toolBrush.classList.remove('active');
  });

  toolResetMask.addEventListener('click', () => {
    clearMask();
  });

  brushSizeInput.addEventListener('input', (e) => {
    brushSizeVal.textContent = `${e.target.value}px`;
  });

  // Slider Updates
  deblurSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    deblurVal.textContent = val < 30 ? 'Low' : (val < 70 ? 'Medium' : 'High');
  });

  thresholdSlider.addEventListener('input', (e) => {
    thresholdVal.textContent = e.target.value;
  });

  removeLogoToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      brushControls.classList.remove('hidden');
    } else {
      brushControls.classList.add('hidden');
    }
  });

  // 4. Trigger Vectorization Process
  processBtn.addEventListener('click', () => {
    if (!loadedImage) return;
    runAIProcessing();
  });

  async function runAIProcessing() {
    if (!loadedImage || !window.antigravityAI) return;

    processingOverlay.classList.remove('hidden');
    processingMsg.textContent = 'Antigravity AI is vectorizing artwork...';

    try {
      const result = await window.antigravityAI.vectorizeArtwork(sourceCanvas, maskCanvas, {
        removeLogo: removeLogoToggle.checked,
        deblurLevel: parseInt(deblurSlider.value, 10),
        threshold: parseInt(thresholdSlider.value, 10),
        detailMode: detailModeSelect.value,
        colorMode: colorModeSelect.value
      });

      currentSvgCode = result.svgCode;
      svgRenderWrap.innerHTML = result.svgCode;
      svgCodeOutput.value = result.svgCode;
      vectorStats.textContent = `${result.pathCount} paths • ${result.sizeKb} KB`;

    } catch (err) {
      console.error('Vectorization error:', err);
      alert('Failed to process artwork.');
    } finally {
      processingOverlay.classList.add('hidden');
    }
  }

  // 5. Export Actions
  downloadSvgBtn.addEventListener('click', () => {
    if (!currentSvgCode) return;
    const blob = new Blob([currentSvgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'antigravity_vectorized_artwork.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  copySvgBtn.addEventListener('click', () => {
    if (!currentSvgCode) return;
    navigator.clipboard.writeText(currentSvgCode).then(() => {
      alert('SVG Code copied to clipboard!');
    });
  });
});
