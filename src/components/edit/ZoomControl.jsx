// src/components/edit/ZoomControl.jsx
import React from "react";

function ZoomControl({ zoomScale, setZoomScale }) {
  return (
    <div
      style={{
        display: "flex",
        width: "120px",
        height: "32px",
        background: "#1e1e1e",
        color: "white",
        borderRadius: "8px",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 12px",
        fontSize: "13px",
      }}
    >
      <div
        style={{ cursor: "pointer", userSelect: "none" }}
        onClick={() => setZoomScale((p) => Math.max(0.1, p - 0.1))}
      >
        –
      </div>

      <div>{Math.round(zoomScale * 100)}%</div>

      <div
        style={{ cursor: "pointer", userSelect: "none" }}
        onClick={() => setZoomScale((p) => p + 0.1)}
      >
        +
      </div>
    </div>
  );
}

export default ZoomControl;
