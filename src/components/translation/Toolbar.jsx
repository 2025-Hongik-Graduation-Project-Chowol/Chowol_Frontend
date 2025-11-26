// src/components/translation/Toolbar.jsx
import React, { useState } from "react";
import "./Toolbar.css";
import { useEditor } from "./EditorContext";

function Toolbar() {
  const {
    selectedTextId,
    textObjects,
    updateSelectedStyle,
    targetLang,
    setTextObjects, // 전체 텍스트 박스 변경용
  } = useEditor();

  const selected = textObjects.find((t) => t.id === selectedTextId);
  const disabled = !selected; // 굵게/기울임/사이즈용

  const [open, setOpen] = useState(true);
  const [aiUsed, setAiUsed] = useState(false); // 🔹 AI 추천 1번만 실행

  // 버튼 4개: B / i / A+ / A-
  const tools = [
    { id: "bold", label: "B" }, // 굵게
    { id: "italic", label: "i" }, // 기울임
    { id: "sizeUp", label: "A+" }, // 폰트 키우기
    { id: "sizeDown", label: "A-" }, // 폰트 줄이기
  ];

  // 🔹 전체 폰트 옵션(셀렉터용)
  const fontOptions = [
    { label: "Noto Sans (기본)", value: "Noto Sans" },
    { label: "나눔고딕", value: "NanumGothicLocal" },
    { label: "나눔고딕 Light", value: "NanumGothicLightLocal" },
    { label: "양진체", value: "Yangjin" },
    { label: "KoPub 바탕 Light", value: "KoPubBatangLight" },
    { label: "국립박물관 클래식", value: "GuknipClassicL" },
    { label: "교보 2020 pdy", value: "Kyobo2020pdy" },
    { label: "교보 2021 sjy", value: "Kyobo2021sjy" },
    { label: "교보 2022 khn", value: "Kyobo2022khn" },
    { label: "교보 2024 psw", value: "Kyobo2024psw" },
    { label: "IPAex Mincho (JP)", value: "IPAexMincho" },
    { label: "SourceHanSerif JP", value: "SourceHanSerifJP" },
    { label: "SourceHanSerif SC", value: "SourceHanSerifSC" },
    { label: "SourceHanSerif TC", value: "SourceHanSerifTC" },
    { label: "SourceHanSerif", value: "SourceHanSerif" },
  ];

  // 🔹 언어별 추천 폰트 풀
  const KOREAN_FONTS = [
    "NanumGothicLocal",
    "GuknipClassicL",
    "KoPubBatangLight",
    "Kyobo2022khn",
    "Kyobo2024psw",
  ];

  const JAPANESE_FONTS = ["IPAexMincho", "SourceHanSerifJP"];

  const CHINESE_FONTS = ["SourceHanSerifSC", "SourceHanSerifTC", "SourceHanSerif"];

  const DEFAULT_FONTS = ["Noto Sans", "SourceHanSerif"];

  const handleToolClick = (toolId) => {
    if (disabled) return;

    switch (toolId) {
      case "bold":
        updateSelectedStyle((prev) => ({ bold: !prev.bold }));
        break;
      case "italic":
        updateSelectedStyle((prev) => ({ italic: !prev.italic }));
        break;
      case "sizeUp":
        updateSelectedStyle((prev) => ({
          fontSize: Math.min((prev.fontSize || 20) + 2, 80),
        }));
        break;
      case "sizeDown":
        updateSelectedStyle((prev) => ({
          fontSize: Math.max((prev.fontSize || 20) - 2, 8),
        }));
        break;
      default:
        break;
    }
  };

  const handleFontChange = (e) => {
    if (disabled) return;
    updateSelectedStyle({ fontFamily: e.target.value });
  };

  const handleColorChange = (e) => {
    if (disabled) return;
    updateSelectedStyle({ color: e.target.value });
  };

  // 🔹 AI 추천: 언어별 폰트 풀에서 랜덤 선택 → 이미지 내 모든 텍스트 박스에 동일 적용 (1번만)
  const handleAiRecommend = () => {
    if (aiUsed) return; // 이미 한 번 적용했으면 더 이상 실행 X
    if (!textObjects || textObjects.length === 0) return;

    let pool;

    switch (targetLang) {
      case "ko":
        pool = KOREAN_FONTS;
        break;
      case "ja":
        pool = JAPANESE_FONTS;
        break;
      case "zh-CN":
      case "zh":
      case "zh-TW":
      case "zh-HK":
        pool = CHINESE_FONTS;
        break;
      default:
        pool = DEFAULT_FONTS;
        break;
    }

    const candidates = (pool || []).filter(Boolean);
    if (candidates.length === 0) return;

    const randomFont =
      candidates[Math.floor(Math.random() * candidates.length)];

    // ✅ 이미지 내 모든 텍스트 박스에 동일 폰트 적용
    setTextObjects((prev) =>
      prev.map((obj) => ({
        ...obj,
        style: {
          ...(obj.style || {}),
          fontFamily: randomFont,
        },
      }))
    );

    setAiUsed(true); // 한 번 사용 처리

    console.log(
      `[AI 추천] targetLang=${targetLang}, 전체에 적용된 폰트 = ${randomFont}`
    );
  };

  // 셀렉터에 표시할 현재 폰트: 선택된 게 있으면 그거, 없으면 첫 번째 텍스트의 폰트
  const currentFont = selected?.style?.fontFamily
    ? selected.style.fontFamily
    : textObjects[0]?.style?.fontFamily || "";

  const aiDisabled = !textObjects || textObjects.length === 0 || aiUsed;

  return (
    <div className="toolbar-root">
      {open ? (
        <div className="toolbar-pill">
          {/* AI 추천 버튼 */}
          <button
            type="button"
            className="ai-button"
            onClick={handleAiRecommend}
            disabled={aiDisabled}
          >
            {aiUsed ? "✓ 적용 완료" : "✪ AI 추천"}
          </button>

          {/* 툴 버튼들 */}
          <div className="tool-list">
            {tools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className="tool-btn"
                onClick={() => handleToolClick(tool.id)}
                disabled={disabled}
              >
                {tool.label}
              </button>
            ))}

            {/* 폰트 셀렉터 */}
            <select
              className="tool-btn toolbar-font-select"
              onChange={handleFontChange}
              disabled={disabled}
              value={currentFont}
              style={{ padding: "0 4px" }}
            >
              <option value="" disabled>
                Aa
              </option>
              {fontOptions.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            {/* 색상 선택 */}
            <input
              type="color"
              onChange={handleColorChange}
              disabled={disabled}
              style={{
                width: 24,
                height: 24,
                border: "none",
                padding: 0,
                background: "transparent",
                cursor: disabled ? "default" : "pointer",
              }}
            />

            {/* 접기 버튼: ^ */}
            <button
              type="button"
              className="tool-btn caret-btn"
              onClick={() => setOpen(false)}
            >
              ˄
            </button>
          </div>
        </div>
      ) : (
        // 접힌 상태: 꽉 찬 타원 + v 아이콘
        <button
          type="button"
          className="toolbar-handle"
          onClick={() => setOpen(true)}
        >
          ˅
        </button>
      )}
    </div>
  );
}

export default Toolbar;
