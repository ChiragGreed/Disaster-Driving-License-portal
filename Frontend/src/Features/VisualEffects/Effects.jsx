import React, { useEffect, useState, useRef } from 'react';
import './Effects.css';

const CornerWeb = ({ className }) => (
  <svg viewBox="0 0 100 100" className={`fill-none stroke-black opacity-30 stroke-[0.8] ${className}`}>
    <path d="M100 0 L0 100 M100 0 L25 100 M100 0 L50 100 M100 0 L75 100 M100 0 L0 75 M100 0 L0 50 M100 0 L0 25" />
    <path d="M 90 0 Q 85 5 90 10 Q 95 5 100 10" />
    <path d="M 75 0 Q 70 12 78 22 Q 88 18 100 25" />
    <path d="M 60 0 Q 55 20 65 35 Q 80 30 100 40" />
    <path d="M 45 0 Q 40 30 52 48 Q 72 45 100 55" />
    <path d="M 30 0 Q 25 40 40 60 Q 65 60 100 70" />
    <path d="M 15 0 Q 10 50 28 72 Q 58 75 100 85" />
    <path d="M 0 0 Q 0 60 15 85 Q 50 90 100 100" />
    <path d="M 0 25 Q 10 60 15 85" />
    <path d="M 0 50 Q 15 70 28 72" />
    <path d="M 0 75 Q 25 70 40 60" />
  </svg>
);

export default function Effects({ children }) {
  const customCursorRef = useRef(null);
  const realMouse = useRef({ x: -100, y: -100 });
  const renderedMouse = useRef({ x: -100, y: -100 });

  const [flickerActive, setFlickerActive] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [warningActive, setWarningActive] = useState(false);
  const [warningPos, setWarningPos] = useState({ top: '50%', left: '50%' });

  useEffect(() => {
    let timerId;
    const triggerRandomEffect = () => {
      const chance = Math.random();

      if (chance < 0.2) {
        setFlickerActive(true);
        setTimeout(() => setFlickerActive(false), 100 + Math.random() * 300);
      } else if (chance < 0.4) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 300 + Math.random() * 500);
      } else if (chance < 0.6) {
        setWarningPos({
          top: `${10 + Math.random() * 80}%`,
          left: `${10 + Math.random() * 80}%`
        });
        setWarningActive(true);
        setTimeout(() => setWarningActive(false), 800 + Math.random() * 1000);
      }

      const nextTime = 2000 + Math.random() * 8000;
      timerId = setTimeout(triggerRandomEffect, nextTime);
    };

    timerId = setTimeout(triggerRandomEffect, 3000);
    return () => clearTimeout(timerId);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      realMouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    let animationFrameId;

    const updateCursor = () => {
      const { x: rx, y: ry } = realMouse.current;
      const { x: dx, y: dy } = renderedMouse.current;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const cornerThreshold = 180; // Distance from corners to consider "in web"

      const distTL = Math.hypot(dx - 0, dy - 0);
      const distTR = Math.hypot(dx - w, dy - 0);
      const distBL = Math.hypot(dx - 0, dy - h);
      const distBR = Math.hypot(dx - w, dy - h);
      const minDist = Math.min(distTL, distTR, distBL, distBR);

      let factor = 1; // Instant movement outside the web

      if (minDist < cornerThreshold) {
        // The further into the web, the stickier it gets (0 to 1)
        const normalized = minDist / cornerThreshold;
        // factor ranges from 0.002 (deepest corner) to 0.05 (edge of web)
        factor = 0.02 + Math.pow(normalized, 2) * 0.05;
      }

      // apply interpolation based on the tension factor
      renderedMouse.current = {
        x: dx + (rx - dx) * factor,
        y: dy + (ry - dy) * factor
      };

      if (customCursorRef.current) {
        customCursorRef.current.style.opacity = '1';
        customCursorRef.current.style.transform = `translate(${renderedMouse.current.x}px, ${renderedMouse.current.y}px)`;
      }

      animationFrameId = requestAnimationFrame(updateCursor);
    };

    animationFrameId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);


  return (
    <>
      {/* Scanlines */}
      <div className="scanlines"></div>

      {/* Random Effects */}
      {flickerActive && <div className="website-flicker"></div>}
      {glitchActive && (
        <div className="glitch-popup">
          ERROR 0x000000FF<br />
          MODI_CORRUPTION<br />
          DATA LOST
          PAISA LOST
        </div>
      )}
      {warningActive && (
        <div
          className="fake-warning"
          style={{ top: warningPos.top, left: warningPos.left }}
        >
          <div className="fake-warning-header">
            <span>Error</span>
            <div className="fake-warning-close">X</div>
          </div>
          <div className="fake-warning-content">
            <div className="fake-warning-icon">X</div>
            <div className="fake-warning-text">A fatal exception 0E has occurred.<br />The current application will be terminated.</div>
          </div>
          <div className="fake-warning-footer">
            <div className="fake-warning-button">OK</div>
          </div>
        </div>
      )}

      {/* Dusk Overlay */}
      <div className="dusk-overlay"></div>

      {/* Stuck Custom Cursor */}
      <div
        ref={customCursorRef}
        className="stuck-cursor"
        style={{ pointerEvents: 'none' }}
      >
        <img
          src="/images/CarKey.png"
          alt="car key cursor"
          className="w-10 h-10 rotate-150 object-contain pointer-events-none"
          style={{
            pointerEvents: 'none',
            filter: 'brightness(1.1) drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))'
          }}
        />
      </div>

      {/* Spider Webs */}
      <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
        <CornerWeb className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64" />
        <CornerWeb className="absolute top-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 -scale-x-100" />
        <CornerWeb className="absolute bottom-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 -scale-y-100" />
        <CornerWeb className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 -scale-x-100 -scale-y-100" />
      </div>

      {/* Flies */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className={`fly fly-${i % 3}`}
          style={{
            left: `${10 + Math.random() * 80}vw`,
            top: `${10 + Math.random() * 80}vh`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 10}s`
          }}
        >
          <div className="buzzing-fly" style={{ animationDelay: `${Math.random()}s` }}></div>
        </div>
      ))}
      {children}
    </>
  );
}
