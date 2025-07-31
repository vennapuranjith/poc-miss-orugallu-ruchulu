// src/orugallu-components/LogoIntro.js
import { useEffect, useRef } from "react";
import "./LogoIntro.css";

function LogoIntro({ onComplete }) {
  const logoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(); // ✅ Call after zoom-in completes
    }, 1200); // match with zoomIn duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="logo-intro-wrapper">
      <img
        ref={logoRef}
        src="/orugallu-logo.png"
        alt="Logo"
        className="logo-image"
      />
    </div>
  );
}

export default LogoIntro;