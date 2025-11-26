
// src/components/edit/CanvasArea.jsx
import { useRef, useState, useEffect } from "react";
import OCRBox from "./OCRBox";
import ManualDragBox from "./ManualDragBox";
import "./CanvasArea.css";

function CanvasArea({
  imageUrl,
  ocrItems,
  zoomScale,
  isAdding,
  setIsAdding,
  onAddBox,
}) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const [naturalSize, setNaturalSize] = useState({ w: 1, h: 1 });
  const [containerSize, setContainerSize] = useState({ w: 1, h: 1 });
  const [baseScale, setBaseScale] = useState(1);

  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);

  const [dragStart, setDragStart] = useState(null);
  const [dragBox, setDragBox] = useState(null);

  // 이미지 로드 후 기본 스케일 계산
  useEffect(() => {
    const img = imgRef.current;
    const container = containerRef.current;
    if (!img || !container) return;

    const handleLoad = () => {
      const naturalW = img.naturalWidth || 1;
      const naturalH = img.naturalHeight || 1;

      const rect = container.getBoundingClientRect();
      const cw = rect.width || 1;
      const ch = rect.height || 1;

      const scale = Math.min(cw / naturalW, ch / naturalH);

      setNaturalSize({ w: naturalW, h: naturalH });
      setContainerSize({ w: cw, h: ch });
      setBaseScale(scale);

      const displayW = naturalW * scale;
      const displayH = naturalH * scale;

      setPanOffset({
        x: (cw - displayW) / 2,
        y: (ch - displayH) / 2,
      });
    };

    if (img.complete) handleLoad();
    else img.onload = handleLoad;
  }, [imageUrl]);

  const displayScale = baseScale * zoomScale;

  // container 좌표 → 원본 이미지 좌표로 변환
  const containerToImageCoords = (clientX, clientY) => {
    const rect = containerRef.current.getBoundingClientRect();
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;

    return {
      x: (cx - panOffset.x) / displayScale,
      y: (cy - panOffset.y) / displayScale,
    };
  };

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const handleMouseDown = (e) => {
    if (isAdding) {
      const { x, y } = containerToImageCoords(e.clientX, e.clientY);
      const ix = clamp(x, 0, naturalSize.w);
      const iy = clamp(y, 0, naturalSize.h);

      setDragStart({ x: ix, y: iy });
      setDragBox({ x1: ix, y1: iy, x2: ix, y2: iy });

    } else {
      setIsPanning(true);
      setPanStart({
        startClientX: e.clientX,
        startClientY: e.clientY,
        startX: panOffset.x,
        startY: panOffset.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isAdding && dragStart) {
      const { x, y } = containerToImageCoords(e.clientX, e.clientY);
      const ix = clamp(x, 0, naturalSize.w);
      const iy = clamp(y, 0, naturalSize.h);

      setDragBox({
        x1: Math.min(dragStart.x, ix),
        y1: Math.min(dragStart.y, iy),
        x2: Math.max(dragStart.x, ix),
        y2: Math.max(dragStart.y, iy),
      });

    } else if (isPanning && panStart) {
      const dx = e.clientX - panStart.startClientX;
      const dy = e.clientY - panStart.startClientY;

      setPanOffset({
        x: panStart.startX + dx,
        y: panStart.startY + dy,
      });
    }
  };

  const handleMouseUp = () => {
    if (isAdding && dragBox) {
      const { x1, y1, x2, y2 } = dragBox;

      if (x2 - x1 > 5 && y2 - y1 > 5) {
        const bbox = [
          { x: x1, y: y1 },
          { x: x2, y: y1 },
          { x: x2, y: y2 },
          { x: x1, y: y2 },
        ];

        onAddBox(bbox);
      }
    }

    setDragStart(null);
    setDragBox(null);
    setIsAdding(false);
    setIsPanning(false);
  };

  const wrapperStyle = {
    position: "absolute",
    left: panOffset.x,
    top: panOffset.y,
    width: naturalSize.w * displayScale,
    height: naturalSize.h * displayScale,
  };

  return (
    <div
      ref={containerRef}
      className="canvas-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div style={wrapperStyle}>
        <img
          ref={imgRef}
          src={imageUrl}
          alt="canvas"
          style={{ width: "100%", height: "100%" }}
          draggable={false}
        />

        {/* 기존 OCR 박스 */}
        {ocrItems.map((item, idx) =>
          Array.isArray(item.bbox) ? (
            <OCRBox key={idx} bbox={item.bbox} displayScale={displayScale} />
          ) : null
        )}

        {/* 드래그 중 박스 */}
        <ManualDragBox dragBox={dragBox} displayScale={displayScale} />
      </div>
    </div>
  );
}

export default CanvasArea;
