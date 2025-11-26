// src/components/edit/ManualDragBox.jsx
import React from "react";

function ManualDragBox({ dragBox, displayScale }) {
  if (!dragBox) return null;

  const { x1, y1, x2, y2 } = dragBox;

  const left = x1 * displayScale;
  const top = y1 * displayScale;
  const width = (x2 - x1) * displayScale;
  const height = (y2 - y1) * displayScale;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        border: "2px dashed #00bcd4",
        background: "rgba(0, 188, 212, 0.2)",
        pointerEvents: "none",
      }}
    />
  );
}

export default ManualDragBox;
