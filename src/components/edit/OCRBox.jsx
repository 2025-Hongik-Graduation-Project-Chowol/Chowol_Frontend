// src/components/edit/OCRBox.jsx


function OCRBox({ bbox, displayScale }) {
  if (!bbox || bbox.length < 4) return null;

  const x1 = bbox[0].x * displayScale;
  const y1 = bbox[0].y * displayScale;
  const x2 = bbox[1].x * displayScale;
  const y2 = bbox[2].y * displayScale;

  return (
    <div
      style={{
        position: "absolute",
        left: x1,
        top: y1,
        width: x2 - x1,
        height: y2 - y1,
        background: "rgba(255, 105, 180, 0.7)",
        pointerEvents: "none",
      }}
    />
  );
}

export default OCRBox;
