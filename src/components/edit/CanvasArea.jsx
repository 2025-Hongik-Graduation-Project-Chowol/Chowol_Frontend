// // src/components/edit/CanvasArea.jsx
// import React, { useRef, useState, useEffect } from "react";
// import OCRBox from "./OCRBox";
// import ManualDragBox from "./ManualDragBox";
// import "./CanvasArea.css"

// function CanvasArea({
//   imageUrl,
//   ocrItems,
//   zoomScale,
//   isAdding,
//   setIsAdding,
//   onAddBox,
// }) {
//   const containerRef = useRef(null);
//   const imgRef = useRef(null);

//   const [naturalSize, setNaturalSize] = useState({ w: 1, h: 1 });
//   const [containerSize, setContainerSize] = useState({ w: 1, h: 1 });
//   const [baseScale, setBaseScale] = useState(1); // 화면에 꽉 차게 배치하는 기본 스케일

//   const [panOffset, setPanOffset] = useState({ x: 0, y: 0 }); // 이미지/박스 전체 이동
//   const [isPanning, setIsPanning] = useState(false);
//   const [panStart, setPanStart] = useState(null);

//   // 드래그 박스 (이미지 원본 좌표 기준)
//   const [dragStart, setDragStart] = useState(null);
//   const [dragBox, setDragBox] = useState(null); // {x1,y1,x2,y2} in image space

//   // 이미지 로딩 후 실제 크기 / 컨테이너 크기 / 기본 스케일 계산
//   useEffect(() => {
//     const img = imgRef.current;
//     const container = containerRef.current;
//     if (!img || !container) return;

//     const handleLoad = () => {
//       const naturalW = img.naturalWidth || 1;
//       const naturalH = img.naturalHeight || 1;

//       const rect = container.getBoundingClientRect();
//       const cw = rect.width || 1;
//       const ch = rect.height || 1;

//       const scale = Math.min(cw / naturalW, ch / naturalH); // 전체가 보이도록 맞춤

//       setNaturalSize({ w: naturalW, h: naturalH });
//       setContainerSize({ w: cw, h: ch });
//       setBaseScale(scale);

//       // 처음엔 중앙 정렬
//       const displayW = naturalW * scale;
//       const displayH = naturalH * scale;
//       setPanOffset({
//         x: (cw - displayW) / 2,
//         y: (ch - displayH) / 2,
//       });
//     };

//     if (img.complete) {
//       handleLoad();
//     } else {
//       img.onload = handleLoad;
//     }
//   }, [imageUrl]);

//   const displayScale = baseScale * zoomScale; // 실제 화면에 그릴 때 사용하는 스케일

//   // 컨테이너 좌표 → 이미지 원본 좌표로 변환
//   const containerToImageCoords = (clientX, clientY) => {
//     const rect = containerRef.current.getBoundingClientRect();
//     const cx = clientX - rect.left;
//     const cy = clientY - rect.top;

//     const ix = (cx - panOffset.x) / displayScale;
//     const iy = (cy - panOffset.y) / displayScale;

//     return { x: ix, y: iy };
//   };

//   const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

//   const handleMouseDown = (e) => {
//     if (!containerRef.current) return;

//     if (isAdding) {
//       // 바운딩 박스 드래그 시작
//       const { x, y } = containerToImageCoords(e.clientX, e.clientY);
//       const cx = clamp(x, 0, naturalSize.w);
//       const cy = clamp(y, 0, naturalSize.h);

//       setDragStart({ x: cx, y: cy });
//       setDragBox({ x1: cx, y1: cy, x2: cx, y2: cy });
//     } else {
//       // 이미지 전체 팬(이동) 시작
//       setIsPanning(true);
//       setPanStart({
//         startClientX: e.clientX,
//         startClientY: e.clientY,
//         startX: panOffset.x,
//         startY: panOffset.y,
//       });
//     }
//   };

//   const handleMouseMove = (e) => {
//     if (isAdding && dragStart) {
//       // 드래그 박스 업데이트
//       const { x, y } = containerToImageCoords(e.clientX, e.clientY);
//       const cx = clamp(x, 0, naturalSize.w);
//       const cy = clamp(y, 0, naturalSize.h);

//       const x1 = Math.min(dragStart.x, cx);
//       const y1 = Math.min(dragStart.y, cy);
//       const x2 = Math.max(dragStart.x, cx);
//       const y2 = Math.max(dragStart.y, cy);

//       setDragBox({ x1, y1, x2, y2 });
//     } else if (isPanning && panStart) {
//       // 팬(이동)
//       const dx = e.clientX - panStart.startClientX;
//       const dy = e.clientY - panStart.startClientY;

//       setPanOffset({
//         x: panStart.startX + dx,
//         y: panStart.startY + dy,
//       });
//     }
//   };

//   const handleMouseUp = () => {
//     if (isAdding && dragBox) {
//       const { x1, y1, x2, y2 } = dragBox;

//       // 너무 작은 박스는 무시
//       if (x2 - x1 > 5 && y2 - y1 > 5) {
//         const bbox = [
//           { x: x1, y: y1 },
//           { x: x2, y: y1 },
//           { x: x2, y: y2 },
//           { x: x1, y: y2 },
//         ];
//         onAddBox(bbox);
//       }

//       setDragStart(null);
//       setDragBox(null);
//       setIsAdding(false);
//     }

//     setIsPanning(false);
//   };

//   // 이미지/박스 전체를 그리는 wrapper 스타일
//   const wrapperStyle = {
//     position: "absolute",
//     left: panOffset.x,
//     top: panOffset.y,
//     width: naturalSize.w * displayScale,
//     height: naturalSize.h * displayScale,
//   };

//   const containerClassName = isAdding
//     ? "canvas-container canvas-add-mode"
//     : "canvas-container";

//   return (
//     <div
//       ref={containerRef}
//       className={containerClassName}
//       onMouseDown={handleMouseDown}
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//     >
//       <div style={wrapperStyle}>
//         <img
//           ref={imgRef}
//           src={imageUrl}
//           alt="canvas-img"
//           style={{
//             width: "100%",
//             height: "100%",
//             display: "block",
//           }}
//           draggable={false}
//         />

//         {/* 기존 + manual OCR 박스들 */}
//         {ocrItems.map((item, idx) =>
//           Array.isArray(item.bbox) ? (
//             <OCRBox
//               key={idx}
//               bbox={item.bbox}
//               displayScale={displayScale}
//             />
//           ) : null
//         )}

//         {/* 드래그 중인 박스 */}
//         <ManualDragBox dragBox={dragBox} displayScale={displayScale} />
//       </div>
//     </div>
//   );
// }

// export default CanvasArea;

// src/components/edit/CanvasArea.jsx
// import React, { useRef, useState, useEffect } from "react";
// import OCRBox from "./OCRBox";
// import ManualDragBox from "./ManualDragBox";
// import "./CanvasArea.css";

// function CanvasArea({
//   imageUrl,
//   ocrItems,
//   zoomScale,
//   isAdding,
//   setIsAdding,
//   onAddBox,
// }) {
//   const containerRef = useRef(null);
//   const imgRef = useRef(null);

//   const [naturalSize, setNaturalSize] = useState({ w: 1, h: 1 });
//   const [containerSize, setContainerSize] = useState({ w: 1, h: 1 });
//   const [baseScale, setBaseScale] = useState(1);

//   const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
//   const [isPanning, setIsPanning] = useState(false);
//   const [panStart, setPanStart] = useState(null);

//   const [dragStart, setDragStart] = useState(null);
//   const [dragBox, setDragBox] = useState(null);

//   useEffect(() => {
//     const img = imgRef.current;
//     const container = containerRef.current;
//     if (!img || !container) return;

//     const handleLoad = () => {
//       const naturalW = img.naturalWidth || 1;
//       const naturalH = img.naturalHeight || 1;

//       const rect = container.getBoundingClientRect();
//       const cw = rect.width || 1;
//       const ch = rect.height || 1;

//       const scale = Math.min(cw / naturalW, ch / naturalH);

//       setNaturalSize({ w: naturalW, h: naturalH });
//       setContainerSize({ w: cw, h: ch });
//       setBaseScale(scale);

//       const displayW = naturalW * scale;
//       const displayH = naturalH * scale;
//       setPanOffset({
//         x: (cw - displayW) / 2,
//         y: (ch - displayH) / 2,
//       });
//     };

//     if (img.complete) handleLoad();
//     else img.onload = handleLoad;
//   }, [imageUrl]);

//   const displayScale = baseScale * zoomScale;

//   const containerToImageCoords = (clientX, clientY) => {
//     const rect = containerRef.current.getBoundingClientRect();
//     const cx = clientX - rect.left;
//     const cy = clientY - rect.top;

//     return {
//       x: (cx - panOffset.x) / displayScale,
//       y: (cy - panOffset.y) / displayScale,
//     };
//   };

//   const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

//   const handleMouseDown = (e) => {
//     if (isAdding) {
//       const { x, y } = containerToImageCoords(e.clientX, e.clientY);
//       const cx = clamp(x, 0, naturalSize.w);
//       const cy = clamp(y, 0, naturalSize.h);

//       setDragStart({ x: cx, y: cy });
//       setDragBox({ x1: cx, y1: cy, x2: cx, y2: cy });
//     } else {
//       setIsPanning(true);
//       setPanStart({
//         startClientX: e.clientX,
//         startClientY: e.clientY,
//         startX: panOffset.x,
//         startY: panOffset.y,
//       });
//     }
//   };

//   const handleMouseMove = (e) => {
//     if (isAdding && dragStart) {
//       const { x, y } = containerToImageCoords(e.clientX, e.clientY);
//       const cx = clamp(x, 0, naturalSize.w);
//       const cy = clamp(y, 0, naturalSize.h);

//       setDragBox({
//         x1: Math.min(dragStart.x, cx),
//         y1: Math.min(dragStart.y, cy),
//         x2: Math.max(dragStart.x, cx),
//         y2: Math.max(dragStart.y, cy),
//       });
//     } else if (isPanning && panStart) {
//       const dx = e.clientX - panStart.startClientX;
//       const dy = e.clientY - panStart.startClientY;

//       setPanOffset({
//         x: panStart.startX + dx,
//         y: panStart.startY + dy,
//       });
//     }
//   };

//   const handleMouseUp = () => {
//     if (isAdding && dragBox) {
//       const { x1, y1, x2, y2 } = dragBox;

//       if (x2 - x1 > 5 && y2 - y1 > 5) {
//         onAddBox([
//           { x: x1, y: y1 },
//           { x: x2, y: y1 },
//           { x: x2, y: y2 },
//           { x: x1, y: y2 },
//         ]);
//       }

//       setDragStart(null);
//       setDragBox(null);
//       setIsAdding(false);
//     }

//     setIsPanning(false);
//   };

//   const wrapperStyle = {
//     position: "absolute",
//     left: panOffset.x,
//     top: panOffset.y,
//     width: naturalSize.w * displayScale,
//     height: naturalSize.h * displayScale,
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="canvas-container"
//       onMouseDown={handleMouseDown}
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//     >
//       <div style={wrapperStyle}>
//         <img
//           ref={imgRef}
//           src={imageUrl}
//           alt="canvas"
//           style={{ width: "100%", height: "100%" }}
//           draggable={false}
//         />

//         {ocrItems.map((item, idx) =>
//           Array.isArray(item.bbox) ? (
//             <OCRBox key={idx} bbox={item.bbox} displayScale={displayScale} />
//           ) : null
//         )}

//         <ManualDragBox dragBox={dragBox} displayScale={displayScale} />
//       </div>
//     </div>
//   );
// }

// export default CanvasArea;


// src/components/edit/CanvasArea.jsx
import React, { useRef, useState, useEffect } from "react";
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
