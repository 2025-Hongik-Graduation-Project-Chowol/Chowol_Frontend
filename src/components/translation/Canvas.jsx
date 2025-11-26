// src/components/translation/Canvas.jsx

import React, { useRef, useEffect, useState } from "react";
import { useEditor } from "./EditorContext";
import { TextBox } from "./TextBox";

export const Canvas = ({ showOriginal = false }) => {
  const {
    imageUrl,
    originalImageUrl,
    textObjects,
    imageLayout,
    setImageLayout,
  } = useEditor();

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  /* --------------------------------------------------
      📌 패닝 기능 (친구 코드)
  -------------------------------------------------- */
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);

  const handleMouseDown = (e) => {
    // TextBox 안에서는 stopPropagation으로 여기로 안옴
    setIsPanning(true);
    setPanStart({
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isPanning || !panStart) return;

    const dx = e.clientX - panStart.startX;
    const dy = e.clientY - panStart.startY;

    setPan({
      x: panStart.panX + dx,
      y: panStart.panY + dy,
    });
  };

  const stopPan = () => {
    setIsPanning(false);
    setPanStart(null);
  };

  /* --------------------------------------------------
      📌 이미지 스케일 및 offset 계산 (너/내 방식 유지)
  -------------------------------------------------- */
  const handleImageLoad = () => {
    if (!imageRef.current || !containerRef.current) return;

    const natW = imageRef.current.naturalWidth;
    const natH = imageRef.current.naturalHeight;

    const boxW = containerRef.current.clientWidth;
    const boxH = containerRef.current.clientHeight;

    // 이미지가 캔버스에 꽉 차도록 scale 계산
    const scale = Math.min(boxW / natW, boxH / natH);

    const renderedW = natW * scale;
    const renderedH = natH * scale;

    const offsetX = (boxW - renderedW) / 2;
    const offsetY = (boxH - renderedH) / 2;

    setImageLayout({
      natW,
      natH,
      scale,
      renderedW,
      renderedH,
      offsetX,
      offsetY,
      boxW,
      boxH,
    });
  };

  const displayUrl = showOriginal ? originalImageUrl : imageUrl;

  return (
    <div
      id="editor-canvas"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopPan}
      onMouseLeave={stopPan}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "#f3f3f3",
        cursor: isPanning ? "grabbing" : "grab",
      }}
    >
      {/* 이미지 + 텍스트 전체를 감싸는 패닝 래퍼 */}
      <div
        style={{
          position: "absolute",
          left: pan.x,
          top: pan.y,
        }}
      >
        {displayUrl ? (
          <>
            {/* 이미지 */}
            <img
              ref={imageRef}
              src={displayUrl}
              draggable={false}
              onLoad={handleImageLoad}
              style={{
                display: "block",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />

            {/* 텍스트 박스 (좌표 변환은 TextBox.jsx에서 처리) */}
            {imageLayout &&
              textObjects.map((obj) => <TextBox key={obj.id} textObj={obj} />)}
          </>
        ) : (
          <div style={{ color: "#777" }}>이미지를 불러오는 중…</div>
        )}
      </div>
    </div>
  );
};
