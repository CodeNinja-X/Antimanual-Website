import React, { useEffect, useRef, useState } from 'react';

function evaluatePointerTarget(x, y, fallbackTarget) {
  let isDark = false;
  let isInteractive = false;

  const elements =
    typeof document !== 'undefined' && typeof document.elementsFromPoint === 'function'
      ? document.elementsFromPoint(x, y)
      : [fallbackTarget].filter(Boolean);

  const interactiveSelector =
    'button, a, input, textarea, select, label, [role="button"], .cursor-pointer, .slider-positioner, .interactive, .tab-btn, .carousel-dot, .nav-btn, .software-pill, .tag-btn, .modal-trigger, .feature-card, .menu-item, .logo-group, .am-win-btn, .sm-action-btn, .sm-subtab-btn, .sm-checkbox-label, .sidebar-toggle-btn, .features-back-btn, .feature-tab-item, .video-nav-arrow-btn, .video-carousel-dots, .contact-nav-button, .contact-channel-item, .hero-scroll-snap-indicator';

  let bgDetermined = false;

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (!el || el === document.documentElement) continue;

    // Ignore custom cursor elements
    if (
      el.classList &&
      (el.classList.contains('custom-cursor-dot') ||
        el.classList.contains('custom-cursor-ring') ||
        el.classList.contains('custom-cursor-click-ripple'))
    ) {
      continue;
    }

    if (!isInteractive && el.closest && el.closest(interactiveSelector)) {
      isInteractive = true;
    }

    // Top-most background determination
    if (!bgDetermined) {
      if (
        el.classList &&
        (el.classList.contains('am-electron-window') ||
          el.classList.contains('primary-download-button') ||
          el.classList.contains('video-embed-stage') ||
          el.classList.contains('feature-tab-active-bg') ||
          el.classList.contains('software-pill-active-bg') ||
          (el.classList.contains('feature-tab-item') && el.classList.contains('active')) ||
          (el.classList.contains('software-pill') && el.classList.contains('active')) ||
          (el.classList.contains('contact-nav-button') && el.classList.contains('active')) ||
          (el.classList.contains('snap-pill') && el.classList.contains('active')) ||
          el.classList.contains('snap-switch-pills'))
      ) {
        isDark = true;
        bgDetermined = true;
      } else if (
        el.classList &&
        (el.classList.contains('contact-dropdown') ||
          el.classList.contains('features-overlay-view') ||
          el.classList.contains('features-wrapper') ||
          el.classList.contains('navbar'))
      ) {
        isDark = false;
        bgDetermined = true;
      } else {
        const style = window.getComputedStyle(el);
        const bg = style.backgroundColor;
        if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
          const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if (match) {
            const alpha = match[4] !== undefined ? parseFloat(match[4]) : 1;
            if (alpha > 0.45) {
              const r = parseInt(match[1], 10);
              const g = parseInt(match[2], 10);
              const b = parseInt(match[3], 10);
              const brightness = (r * 299 + g * 587 + b * 114) / 1000;
              isDark = brightness < 135;
              bgDetermined = true;
            }
          }
        }
      }
    }
  }

  return { isDark, isInteractive };
}

export default function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(pointer: fine)');
    let hasFinePointer = mediaQuery.matches;

    const handleMediaChange = (e) => {
      hasFinePointer = e.matches;
      if (!hasFinePointer) {
        setIsVisible(false);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleMediaChange);
    }

    if (!hasFinePointer) {
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleMediaChange);
        } else if (mediaQuery.removeListener) {
          mediaQuery.removeListener(handleMediaChange);
        }
      };
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId;

    const handleMouseMove = (e) => {
      if (!hasFinePointer) return;
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      const { isDark: darkTarget, isInteractive: interactiveTarget } = evaluatePointerTarget(
        mouseX,
        mouseY,
        e.target
      );

      setIsHovered(interactiveTarget);
      setIsDark(darkTarget);
    };

    const handleMouseDown = (e) => {
      if (!hasFinePointer) return;
      setIsClicked(true);
      const { isDark: darkTarget } = evaluatePointerTarget(e.clientX, e.clientY, e.target);
      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        isDark: darkTarget
      };
      setRipples((prev) => [...prev.slice(-5), newRipple]);
    };

    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => {
      if (hasFinePointer) setIsVisible(true);
    };
    const handleTouchStart = () => {
      setIsVisible(false);
    };

    const render = () => {
      animId = requestAnimationFrame(render);
      ringX += (mouseX - ringX) * 0.25;
      ringY += (mouseY - ringY) * 0.25;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
    };

    render();

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      cancelAnimationFrame(animId);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleMediaChange);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  const removeRipple = (id) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <>
      {/* Click Animation Shockwave Ripples */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className={`custom-cursor-click-ripple ${ripple.isDark ? 'white-ripple' : 'dark-ripple'}`}
          style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
          onAnimationEnd={() => removeRipple(ripple.id)}
        />
      ))}

      {/* Outer Follower Ring */}
      <div
        ref={cursorRingRef}
        className={`custom-cursor-ring ${isVisible ? 'visible' : ''} ${isHovered ? 'hovered' : ''} ${isDark ? 'theme-dark' : 'theme-light'} ${isClicked ? 'clicked' : ''}`}
        aria-hidden="true"
      />

      {/* Central Cursor Dot */}
      <div
        ref={cursorDotRef}
        className={`custom-cursor-dot ${isVisible ? 'visible' : ''} ${isHovered ? 'hovered' : ''} ${isDark ? 'theme-dark' : 'theme-light'} ${isClicked ? 'clicked' : ''}`}
        aria-hidden="true"
      />
    </>
  );
}
