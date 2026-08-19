import React, { useEffect, useRef, useState } from 'react';

export const SOUND_PRESETS = [
  { id: 'zeeek', label: 'Katana Zeeek', src: '/sounds/katana_zeeek.wav' },
  { id: 'zeng', label: 'Katana Zeng', src: '/sounds/katana_sheng.wav' },
  { id: 'flurry', label: 'Zeng Flurry', src: '/sounds/katana_sheng_echo.wav' },
];

const audioCache = {};

function getCachedAudio(src) {
  if (!audioCache[src]) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    audioCache[src] = audio;
  }
  return audioCache[src];
}

// Preload audio files on user's first interaction
if (typeof window !== 'undefined') {
  const preloadAll = () => {
    SOUND_PRESETS.forEach((p) => getCachedAudio(p.src));
    window.removeEventListener('pointerdown', preloadAll);
    window.removeEventListener('keydown', preloadAll);
  };
  window.addEventListener('pointerdown', preloadAll, { passive: true });
  window.addEventListener('keydown', preloadAll, { passive: true });
}

export function playRealisticSwordSound(presetId) {
  try {
    const preset = SOUND_PRESETS.find((p) => p.id === presetId) || SOUND_PRESETS[0];
    const baseAudio = getCachedAudio(preset.src);
    const audioClone = baseAudio.cloneNode();
    audioClone.volume = 0.98;
    audioClone.play().catch(() => {});
  } catch (e) {}
}

/**
 * Ultra-Smooth Interactive Samurai WebGL Morph Component
 * - Mouse Reveal Effect: Seamless, borderless feathered reveal smoothly following cursor
 * - Click Toggle Effect: Centered full-figure soft ripple wipe reveal on click (and vice versa)
 * - Razor-Sharp Realistic Katana ZENG Sound Effect
 */
export default function SamuraiMorph({
  baseSrc,
  revealSrc,
  className = '',
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const stateRef = useRef({
    isRevealed: false,
    clickProgress: 0.0,
    targetClickProgress: 0.0,
    clickCenterX: 0.5,
    clickCenterY: 0.52,
    targetClickCenterX: 0.5,
    targetClickCenterY: 0.52,

    // Smooth mouse tracking
    mouseX: 0.5,
    mouseY: 0.5,
    targetMouseX: 0.5,
    targetMouseY: 0.5,
    mouseActive: 0.0,
    targetMouseActive: 0.0,
  });

  // Sync click state with ref
  useEffect(() => {
    stateRef.current.isRevealed = isRevealed;
    stateRef.current.targetClickProgress = isRevealed ? 1.0 : 0.0;
  }, [isRevealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas) return;

    let gl;
    try {
      gl = canvas.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: false,
        antialias: true,
        powerPreference: 'high-performance',
      }) || canvas.getContext('experimental-webgl');
    } catch (e) {
      gl = null;
    }

    if (!gl) return;

    // Vertex shader
    const vsSource = `
      attribute vec2 a_position;
      attribute vec2 a_uv;
      varying vec2 v_uv;
      void main() {
        v_uv = a_uv;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader: Ultra-smooth feathered reveal + ripple morph
    const fsSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_texBase;
      uniform sampler2D u_texReveal;
      uniform float u_time;
      uniform float u_clickProgress;
      uniform vec2 u_clickCenter;
      uniform float u_mouseActive;
      uniform vec2 u_mouseCenter;
      uniform vec2 u_resolution;

      void main() {
        float aspect = u_resolution.x / max(u_resolution.y, 1.0);
        vec2 p = vec2(v_uv.x * aspect, v_uv.y);

        // 1. Click-based centered wipe reveal
        vec2 cClick = vec2(u_clickCenter.x * aspect, u_clickCenter.y);
        float distClick = length(p - cClick);
        float wipeClick = 0.0;
        float ripClick = 0.0;
        float envClick = 0.0;

        if (u_clickProgress > 0.001) {
          if (u_clickProgress >= 0.999) {
            wipeClick = 1.0;
          } else {
            float radius = u_clickProgress * 1.35;
            float feather = 0.07;
            wipeClick = smoothstep(radius + feather, radius - feather, distClick);

            float waveDiff = distClick - radius;
            envClick = exp(-pow(waveDiff / 0.06, 2.0));
            ripClick = sin(waveDiff * 54.0 - u_time * 4.5) * envClick;
          }
        }

        // 2. Seamless feathered mouse reveal (smooth continuous falloff without hard circle borders)
        vec2 cMouse = vec2(u_mouseCenter.x * aspect, u_mouseCenter.y);
        float distMouse = length(p - cMouse);
        float wipeMouse = smoothstep(0.35, 0.02, distMouse) * u_mouseActive * (1.0 - wipeClick);

        // Gentle fluid ripple on hover
        float ripMouse = sin(distMouse * 48.0 - u_time * 3.8) * exp(-pow(distMouse / 0.24, 2.0)) * u_mouseActive * (1.0 - wipeClick);

        // Combined smooth reveal mask
        float wipe = clamp(max(wipeClick, wipeMouse), 0.0, 1.0);

        // Directional UV displacement for subtle morphing
        vec2 dirClick = (distClick > 0.0001) ? normalize(p - cClick) : vec2(0.0, 1.0);
        vec2 dirMouse = (distMouse > 0.0001) ? normalize(p - cMouse) : vec2(0.0, 1.0);
        vec2 uvDisplace = (dirClick * ripClick + dirMouse * ripMouse * 0.4) * 0.0085;

        // Morph texture UVs
        vec2 uvBase = clamp(v_uv + uvDisplace * (1.0 - wipe), 0.0, 1.0);
        vec2 uvReveal = clamp(v_uv - uvDisplace * wipe, 0.0, 1.0);

        vec4 colBase = texture2D(u_texBase, uvBase);
        vec4 colReveal = texture2D(u_texReveal, uvReveal);

        // Smooth blend between base and reveal image
        vec4 finalColor = mix(colBase, colReveal, wipe);

        // Subtle minimal edge glow on wavefront transition
        float edgeGlow = envClick * 0.045 * (1.0 - abs(wipe * 2.0 - 1.0));
        finalColor.rgb += vec3(edgeGlow * finalColor.a);

        gl_FragColor = finalColor;
      }
    `;

    function createShader(glCtx, type, source) {
      const shader = glCtx.createShader(type);
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error(glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry with UVs
    // prettier-ignore
    const vertices = new Float32Array([
      // pos: x, y    uv: u, v
      -1, -1,         0, 1,
       1, -1,         1, 1,
      -1,  1,         0, 0,
      -1,  1,         0, 0,
       1, -1,         1, 1,
       1,  1,         1, 0,
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'a_position');
    const aUv = gl.getAttribLocation(program, 'a_uv');

    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 16, 8);

    // Uniform locations
    const uTexBaseLoc = gl.getUniformLocation(program, 'u_texBase');
    const uTexRevealLoc = gl.getUniformLocation(program, 'u_texReveal');
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uClickProgressLoc = gl.getUniformLocation(program, 'u_clickProgress');
    const uClickCenterLoc = gl.getUniformLocation(program, 'u_clickCenter');
    const uMouseActiveLoc = gl.getUniformLocation(program, 'u_mouseActive');
    const uMouseCenterLoc = gl.getUniformLocation(program, 'u_mouseCenter');
    const uResolutionLoc = gl.getUniformLocation(program, 'u_resolution');

    // Create & upload textures
    function setupTexture(image, unit) {
      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      return tex;
    }

    let texBase = null;
    let texReveal = null;

    const img1 = new Image();
    const img2 = new Image();
    let loadedCount = 0;

    const checkBothLoaded = () => {
      loadedCount++;
      if (loadedCount === 2) {
        texBase = setupTexture(img1, 0);
        texReveal = setupTexture(img2, 1);
        gl.uniform1i(uTexBaseLoc, 0);
        gl.uniform1i(uTexRevealLoc, 1);
        setIsLoaded(true);
      }
    };

    img1.crossOrigin = 'anonymous';
    img2.crossOrigin = 'anonymous';
    img1.src = baseSrc;
    img2.src = revealSrc;
    img1.onload = checkBothLoaded;
    img2.onload = checkBothLoaded;

    // Mouse Listeners
    const handleMouseMove = (e) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        stateRef.current.targetMouseX = nx;
        stateRef.current.targetMouseY = ny;
        stateRef.current.targetMouseActive = 1.0;
      }
    };

    const handleMouseEnter = (e) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        stateRef.current.targetMouseX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        stateRef.current.targetMouseY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        stateRef.current.mouseX = stateRef.current.targetMouseX;
        stateRef.current.mouseY = stateRef.current.targetMouseY;
      }
      stateRef.current.targetMouseActive = 1.0;
    };

    const handleMouseLeave = () => {
      stateRef.current.targetMouseActive = 0.0;
    };

    if (container) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
      container.addEventListener('mouseenter', handleMouseEnter, { passive: true });
      container.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }

    // Animation Loop
    let animId;
    const startTime = performance.now();

    const render = (now) => {
      animId = requestAnimationFrame(render);

      const elapsed = (now - startTime) * 0.001;
      const s = stateRef.current;

      // Smooth progress animation on click
      s.clickProgress += (s.targetClickProgress - s.clickProgress) * 0.075;
      if (Math.abs(s.targetClickProgress - s.clickProgress) < 0.001) {
        s.clickProgress = s.targetClickProgress;
      }

      // Smooth center position lerp for click
      s.clickCenterX += (s.targetClickCenterX - s.clickCenterX) * 0.1;
      s.clickCenterY += (s.targetClickCenterY - s.clickCenterY) * 0.1;

      // Smooth mouse tracking & activation
      s.mouseX += (s.targetMouseX - s.mouseX) * 0.12;
      s.mouseY += (s.targetMouseY - s.mouseY) * 0.12;
      s.mouseActive += (s.targetMouseActive - s.mouseActive) * 0.09;
      if (s.mouseActive < 0.001 && s.targetMouseActive === 0) {
        s.mouseActive = 0;
      }

      // Handle canvas resizing & DPR
      const width = container ? container.clientWidth : canvas.clientWidth;
      const height = container ? container.clientHeight : canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (width > 0 && height > 0) {
        const displayW = Math.round(width * dpr);
        const displayH = Math.round(height * dpr);
        if (canvas.width !== displayW || canvas.height !== displayH) {
          canvas.width = displayW;
          canvas.height = displayH;
          gl.viewport(0, 0, displayW, displayH);
        }
      }

      if (loadedCount < 2) return;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform1f(uClickProgressLoc, s.clickProgress);
      gl.uniform2f(uClickCenterLoc, s.clickCenterX, s.clickCenterY);
      gl.uniform1f(uMouseActiveLoc, s.mouseActive);
      gl.uniform2f(uMouseCenterLoc, s.mouseX, s.mouseY);
      gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (vertexBuffer) gl.deleteBuffer(vertexBuffer);
      if (texBase) gl.deleteTexture(texBase);
      if (texReveal) gl.deleteTexture(texReveal);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      if (program) gl.deleteProgram(program);
    };
  }, [baseSrc, revealSrc]);

  // Click handler to toggle full reveal
  const handleClick = (e) => {
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const cx = Math.max(0.1, Math.min(0.9, (e.clientX - rect.left) / rect.width));
        const cy = Math.max(0.1, Math.min(0.9, (e.clientY - rect.top) / rect.height));
        stateRef.current.targetClickCenterX = cx;
        stateRef.current.targetClickCenterY = cy;
      }
    }
    playRealisticSwordSound('zeeek');
    setIsRevealed((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`samurai-morph-container ${className}`}
      title="Click to toggle full reveal"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'manipulation',
      }}
    >

      {/* Fallback image before WebGL textures load */}
      {!isLoaded && (
        <img
          src={baseSrc}
          alt="Antimanual Samurai"
          className="samurai-fallback-img"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'bottom center',
            pointerEvents: 'none',
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        className="samurai-morph-canvas"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'bottom center',
          pointerEvents: 'none',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.4s ease-out',
        }}
      />
    </div>
  );
}
