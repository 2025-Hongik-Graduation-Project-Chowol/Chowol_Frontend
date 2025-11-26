// src/components/translation/TextBox.jsx
import { useEffect, useRef, useState } from "react";
import { useEditor } from "./EditorContext";

export const TextBox = ({ textObj }) => {
  const { id, text, x, y, width, height, style, rotation = 0 } = textObj;

  const {
    selectedTextId,
    setSelectedTextId,
    updateText,

    moveTextBox,
    resizeTextBox,
    updateRotation,

    imageLayout, // ⭐ scale/offset 읽기
  } = useEditor();

  if (!imageLayout) return null; // 안전장치

  const isSelected = selectedTextId === id;

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef({
    startX: 0,
    startY: 0,
    startW: width,
    startH: height,
  });

  const [isRotating, setIsRotating] = useState(false);
  const rotateStartRef = useRef({
    centerX: 0,
    centerY: 0,
    startAngle: 0,
    startRotation: 0,
  });

  const textareaRef = useRef(null);
  const boxRef = useRef(null);

  const scale = imageLayout.scale;

  // -------------------------------
  //   📌 화면 좌표 → 원본 좌표로 역변환
  // -------------------------------
  const toOriginalX = (renderX) =>
    (renderX - imageLayout.offsetX) / imageLayout.scale;
  const toOriginalY = (renderY) =>
    (renderY - imageLayout.offsetY) / imageLayout.scale;
  const toOriginalW = (renderW) => renderW / imageLayout.scale;
  const toOriginalH = (renderH) => renderH / imageLayout.scale;

  // -------------------------------
  //   📌 원본 좌표 → 화면 좌표로 변환 (렌더링용)
  // -------------------------------
  const renderX = x * scale + imageLayout.offsetX;
  const renderY = y * scale + imageLayout.offsetY;
  const renderW = width * scale;
  const renderH = height * scale;

  // 🔥 폰트도 이미지 축소 비율에 맞춰 같이 줄이기
  const renderFontSize = (style.fontSize || 16) * scale;

  // -------------------------------
  //   📌 드래그 시작
  // -------------------------------
  const handleMouseDown = (e) => {
    e.stopPropagation();
    setSelectedTextId(id);
    setIsDragging(true);

    setDragOffset({
      x: e.clientX - renderX,
      y: e.clientY - renderY,
    });
  };

  // -------------------------------
  //   📌 리사이즈 시작
  // -------------------------------
  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    setSelectedTextId(id);
    setIsResizing(true);

    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: renderW,
      startH: renderH,
    };
  };

  // -------------------------------
  //   📌 회전 시작
  // -------------------------------
  const handleRotateMouseDown = (e) => {
    e.stopPropagation();
    setSelectedTextId(id);
    setIsRotating(true);

    const rect = boxRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

    rotateStartRef.current = {
      centerX,
      centerY,
      startAngle,
      startRotation: rotation,
    };
  };

  const handleTextChange = (e) => {
    updateText(id, e.target.value);
  };

  // -------------------------------
  //  📌 드래그/리사이즈/회전 처리
  // -------------------------------
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!imageLayout) return;

      // ⭐ 드래그(이동)
      if (isDragging) {
        const newRenderX = e.clientX - dragOffset.x;
        const newRenderY = e.clientY - dragOffset.y;

        const originalX = toOriginalX(newRenderX);
        const originalY = toOriginalY(newRenderY);

        moveTextBox(id, originalX, originalY);
      }

      // ⭐ 리사이즈
      if (isResizing) {
        const { startX, startY, startW, startH } = resizeStartRef.current;
        const diffX = e.clientX - startX;
        const diffY = e.clientY - startY;

        let newRenderW = startW + diffX;
        let newRenderH = startH + diffY;

        const MIN_W = 40;
        const MIN_H = 24;
        if (newRenderW < MIN_W) newRenderW = MIN_W;
        if (newRenderH < MIN_H) newRenderH = MIN_H;

        // ⭐ 렌더 크기 → 원본 크기 변환
        const originalW = toOriginalW(newRenderW);
        const originalH = toOriginalH(newRenderH);

        resizeTextBox(id, originalW, originalH);
      }

      // ⭐ 회전
      if (isRotating) {
        const { centerX, centerY, startAngle, startRotation } =
          rotateStartRef.current;

        const currentAngle = Math.atan2(
          e.clientY - centerY,
          e.clientX - centerX
        );
        const deltaRad = currentAngle - startAngle;
        const deltaDeg = (deltaRad * 180) / Math.PI;

        updateRotation(id, startRotation + deltaDeg);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setIsRotating(false);
    };

    if (isDragging || isResizing || isRotating) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    id,
    isDragging,
    isResizing,
    isRotating,
    dragOffset,
    imageLayout,
    moveTextBox,
    resizeTextBox,
    updateRotation,
  ]);

  // -------------------------------
  //   📌 textarea 내용 변경 → 자동 높이 조절
  //   (이제 원본 height는 건드리지 않고, 렌더 높이만 맞춰줌)
  // -------------------------------
  useEffect(() => {
    if (!textareaRef.current) return;
    const ta = textareaRef.current;

    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [text, renderFontSize]);

  return (
    <div
      ref={boxRef}
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: renderX,
        top: renderY,
        width: renderW,
        height: renderH,
        cursor: isDragging ? "grabbing" : "move",
        border: isSelected ? "1px solid #3b82f6" : "1px solid transparent",
        boxSizing: "border-box",
        padding: 4,
        background: "transparent",
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "top left",
      }}
    >
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: -40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 1,
              height: 16,
              background: "#666",
            }}
          />
          <div
            onMouseDown={handleRotateMouseDown}
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              border: "1px solid #666",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              cursor: "grab",
              pointerEvents: "auto",
              boxShadow: "0 0 2px rgba(0,0,0,0.2)",
              userSelect: "none",
            }}
          >
            ⟳
          </div>
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        style={{
          width: "100%",
          height: "100%",
          resize: "none",
          border: "none",
          outline: "none",
          background: "transparent",
          overflow: "hidden",
          whiteSpace: "pre-wrap",
          lineHeight: 1.4,
          // 🔥 폰트는 축소된 이미지 비율에 맞춰 같이 줄이기
          fontSize: renderFontSize,
          fontWeight: style.bold ? "700" : "400",
          fontStyle: style.italic ? "italic" : "normal",
          color: style.color,
          fontFamily: style.fontFamily,
        }}
      />

      <div
        onMouseDown={handleResizeMouseDown}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 10,
          height: 10,
          borderRadius: 2,
          background: isSelected ? "#3b82f6" : "#999",
          cursor: "se-resize",
        }}
      />
    </div>
  );
};
