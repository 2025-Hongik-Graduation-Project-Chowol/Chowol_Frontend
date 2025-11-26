import React, { useState } from "react";
import "./LanguageSelector.css";
import { useEditorContext } from "./EditorContext";

const LANGUAGES = [
  { id: "ko", label: "한국어" },
  { id: "en", label: "영어" },
  { id: "zh-CN", label: "중국어" },
  { id: "ja", label: "일본어" },
];

function LanguageSelector() {
  // 🔹 드롭다운 열림/닫힘 상태는 로컬로 유지
  const [sourceOpen, setSourceOpen] = useState(false);
  const [targetOpen, setTargetOpen] = useState(false);

  // 🔹 실제 선택된 언어는 EditorContext에서 가져오기
  const {
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
  } = useEditorContext();

  const getLabel = (id) => LANGUAGES.find((l) => l.id === id)?.label || id;

  const swap = () => {
    // 🔁 context 기반으로 언어 스왑
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  return (
    <div className="lang-container">
      {/* 왼쪽 selector (원본 언어) */}
      <div className="lang-box">
        <button
          type="button"
          className="lang-btn"
          onClick={() => {
            setSourceOpen(!sourceOpen);
            setTargetOpen(false);
          }}
        >
          {getLabel(sourceLang)} ▾
        </button>

        {sourceOpen && (
          <div className="lang-dropdown">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                type="button"
                className="lang-option"
                onClick={() => {
                  setSourceLang(lang.id);  // ✅ 전역 상태 업데이트
                  setSourceOpen(false);
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 중앙 아이콘 (나중에 제거 가능) */}
      <button
        type="button"
        className="lang-swap"
        onClick={swap}
        disabled
      >
        ⇄
      </button>

      {/* 오른쪽 selector (번역 언어) */}
      <div className="lang-box">
        <button
          type="button"
          className="lang-btn"
          onClick={() => {
            setTargetOpen(!targetOpen);
            setSourceOpen(false);
          }}
        >
          {getLabel(targetLang)} ▾
        </button>

        {targetOpen && (
          <div className="lang-dropdown">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                type="button"
                className="lang-option"
                onClick={() => {
                  setTargetLang(lang.id);  // ✅ 전역 상태 업데이트
                  setTargetOpen(false);
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LanguageSelector;
