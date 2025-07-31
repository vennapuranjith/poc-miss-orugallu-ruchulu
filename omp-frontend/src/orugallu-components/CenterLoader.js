// src/orugallu-components/CenterLoader.js
import React from "react";
import "./CenterLoader.css";

function CenterLoader() {
  return (
    <div className="center-loader-overlay">
      <div className="center-loader-logo">
        <img src="/orugallu-logo.png" alt="Loading..." />
      </div>
    </div>
  );
}

export default CenterLoader;