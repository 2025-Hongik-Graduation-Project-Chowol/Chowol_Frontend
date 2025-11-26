// src/components/translation/EditorContext.jsx
import React, { createContext, useContext, useState } from "react";

const EditorContext = createContext(null);

export const useEditor = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error("useEditor must be used within EditorProvider");
  }
  return ctx;
};

export const EditorProvider = ({ children }) => {
  // 🔹 이미지 / OCR / 원본 이미지 URL
  const [imageUrl, setImageUrl] = useState(null);
  const [ocrJsonUrl, setOcrJsonUrl] = useState(null);             // OCR JSON
  const [originalImageUrl, setOriginalImageUrl] = useState(null); // 원본 이미지

  const [textObjects, setTextObjects] = useState([]);
  const [selectedTextId, setSelectedTextId] = useState(null);

  const [imageLayout, setImageLayout] = useState(null);

  // 오른쪽 패널 텍스트
  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  // 언어
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("ko");

  // 🔹 언어별 기본 폰트 매핑
  const getDefaultFontByLang = (lang) => {
    switch (lang) {
      case "ja":
        return "SourceHanSerifJP";   // 일본어
      case "zh-CN":
        return "SourceHanSerifSC";   // 중국어 간체
      // 만약 나중에 zh-TW 지원하면:
      case "zh-TW":
        return "SourceHanSerifTC";   // 중국어 번체
      case "en":
        return "NanumGothicLocal";        // 영어 기본
      case "ko":
      default:
        return "NanumGothicLocal";   // 한국어 기본
    }
  };

  // 크기 조절
  const resizeTextBox = (id, newWidth, newHeight) => {
    setTextObjects((prev) =>
      prev.map((obj) =>
        obj.id === id
          ? { ...obj, width: newWidth, height: newHeight }
          : obj
      )
    );
  };

  // 텍스트 박스 추가
  const addTextObject = (partial = {}) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : `t_${Date.now()}`;
    const defaultFontFamily = getDefaultFontByLang(targetLang);

    const newObj = {
      id,
      text: partial.text || "새 텍스트",
      x: partial.x ?? 100,
      y: partial.y ?? 100,
      width: partial.width ?? 200,
      height: partial.height ?? 50,
      rotation: partial.rotation ?? 0,
      style: {
        bold: false,
        italic: false,
        fontSize: 24,
        color: "#000000",
        fontFamily: defaultFontFamily,
        ...(partial.style || {}),   // partial.style에 fontFamily 넣으면 이게 우선
      },
    };
    setTextObjects((prev) => [...prev, newObj]);
    setSelectedTextId(id);
  };

  // 텍스트 내용 수정
  const updateText = (id, text) => {
    setTextObjects((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, text } : obj))
    );
  };

  // 이동
  const moveTextBox = (id, x, y) => {
    setTextObjects((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, x, y } : obj))
    );
  };

  // 회전
  const updateRotation = (id, rotation) => {
    setTextObjects((prev) =>
      prev.map((obj) =>
        obj.id === id ? { ...obj, rotation } : obj
      )
    );
  };

  // 스타일 변경
  const updateStyle = (id, stylePatchOrFn) => {
    setTextObjects((prev) =>
      prev.map((obj) => {
        if (obj.id !== id) return obj;
        const prevStyle = obj.style || {};
        const patch =
          typeof stylePatchOrFn === "function"
            ? stylePatchOrFn(prevStyle)
            : stylePatchOrFn;
        return {
          ...obj,
          style: {
            ...prevStyle,
            ...patch,
          },
        };
      })
    );
  };

  const updateSelectedStyle = (stylePatchOrFn) => {
    if (!selectedTextId) return;
    updateStyle(selectedTextId, stylePatchOrFn);
  };

  // 삭제
  const removeTextObject = (id) => {
    setTextObjects((prev) => prev.filter((obj) => obj.id !== id));
    setSelectedTextId((prev) => (prev === id ? null : prev));
  };

  const removeSelectedTextObject = () => {
    if (!selectedTextId) return;
    removeTextObject(selectedTextId);
  };

  const value = {
    // URL 관련 전역 상태
    imageUrl,
    setImageUrl,
    ocrJsonUrl,
    setOcrJsonUrl,
    originalImageUrl,
    setOriginalImageUrl,

    textObjects,
    setTextObjects,
    selectedTextId,
    setSelectedTextId,

    imageLayout,
    setImageLayout,

    addTextObject,
    updateText,
    moveTextBox,
    resizeTextBox,
    updateRotation,
    updateStyle,
    updateSelectedStyle,
    removeTextObject,
    removeSelectedTextObject,

    originalText,
    setOriginalText,
    translatedText,
    setTranslatedText,
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

export function useEditorContext() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditorContext must be used within EditorProvider");
  return ctx;
}
