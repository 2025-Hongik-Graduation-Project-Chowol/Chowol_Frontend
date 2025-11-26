// src/pages/TranslationPage.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/translation/Header";
import Tabs from "../components/translation/Tabs";
import Toggle from "../components/translation/Toggle";
import Button from "../components/translation/Button";
import LanguageSelector from "../components/translation/LanguageSelector";
import Toolbar from "../components/translation/Toolbar";
import { EditorProvider, useEditor } from "../components/translation/EditorContext";
import { Canvas } from "../components/translation/Canvas";
import {
  translateWithPapagoService,
  translateRawTextWithPapago,
  fetchReinsertBoxes,
} from "../services/api.translate";
import DownloadButton from "../components/translation/DownloadButton";

/* ---------------- RightTextPanel ---------------- */

function RightTextPanel() {
  const {
    originalText,
    setOriginalText,
    translatedText,
    setTranslatedText,
    textObjects,
    updateText,
  } = useEditor();

  const handleTranslatedChange = (e) => {
    const value = e.target.value;
    setTranslatedText(value);

    const lines = value.split("\n");
    const count = Math.min(lines.length, textObjects.length);

    for (let i = 0; i < count; i++) {
      updateText(textObjects[i].id, lines[i]);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "0 32px 16px",
        boxSizing: "border-box",
      }}
    >
      {/* 원본 텍스트 */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
          원본 텍스트
        </div>
        <textarea
          value={originalText}
          onChange={(e) => setOriginalText(e.target.value)}
          placeholder="OCR 원본 텍스트"
          style={{
            flex: 1,
            minHeight: "80px",
            width: "100%",
            resize: "none",
            borderRadius: "8px",
            border: "1px solid #ccc",
            padding: "8px",
            fontSize: "13px",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* 번역 텍스트 */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
          번역 텍스트
        </div>
        <textarea
          value={translatedText}
          onChange={handleTranslatedChange}
          placeholder="번역 결과"
          style={{
            flex: 1,
            minHeight: "80px",
            width: "100%",
            resize: "none",
            borderRadius: "8px",
            border: "1px solid #ccc",
            padding: "8px",
            fontSize: "13px",
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}

/* ---------------- TranslateButton ---------------- */

const getFontByLang = () => "Noto Sans";

function TranslateButton({ onLoadingChange }) {
  const {
    originalText,
    setOriginalText,
    setTranslatedText,
    textObjects,
    setTextObjects,
    updateText,
    sourceLang,
    targetLang,
    ocrJsonUrl,
    originalImageUrl,
  } = useEditor();

  const handleClick = async () => {
    onLoadingChange(true);

    try {
      if (!ocrJsonUrl || !originalImageUrl) {
        console.warn("비어있는 OCR URL / Original 이미지");
        onLoadingChange(false);
        return;
      }

      // 📌 1) 수정된 원본 텍스트 재번역
      if (originalText && originalText.trim()) {
        const translated = await translateRawTextWithPapago({
          text: originalText,
          sourceLang,
          targetLang,
        });

        setTranslatedText(translated);

        const lines = translated.split("\n");
        const count = Math.min(lines.length, textObjects.length);
        for (let i = 0; i < count; i++) {
          updateText(textObjects[i].id, lines[i]);
        }
        return;
      }

      // 📌 2) 최초 번역
      const { originalText: oText, translatedText: tText, meta } =
        await translateWithPapagoService({
          ocrJsonUrl,
          originalImageUrl,
          sourceLang,
          targetLang,
        });

      setOriginalText(oText);
      setTranslatedText(tText);

      // 📌 reinsert → 텍스트 박스 생성
      const boxes = await fetchReinsertBoxes({
        ocrJsonUrl,
        translatedJsonUrl: meta.translatedUrl,
      });

      const fontFamily = getFontByLang(targetLang);

      const nextTextObjects = boxes.map((b) => ({
        id: b.id,
        x: b.x,
        y: b.y,
        width: b.width,
        height: b.height,
        text: b.translated_text ?? b.original_text ?? "",
        rotation: b.angle || 0,
        style: {
          bold: false,
          italic: false,
          fontSize: b.fontSize || 16,
          color: b.color || "#000000",
          fontFamily,
        },
      }));

      setTextObjects(nextTextObjects);
    } catch (err) {
      console.error("Papago Error:", err);
    } finally {
      onLoadingChange(false);
    }
  };

  return <Button onPress={handleClick}>번역하기</Button>;
}

/* ---------------- TextBoxControls ---------------- */

function TextBoxControls() {
  const {
    addTextObject,
    removeSelectedTextObject,
    selectedTextId,
    imageLayout,
  } = useEditor();

  const handleAdd = () => {
    if (imageLayout) {
      const { offsetX, offsetY, renderedW, renderedH } = imageLayout;
      addTextObject({
        x: offsetX + renderedW / 2 - 100,
        y: offsetY + renderedH / 2 - 25,
        width: 200,
        height: 50,
        text: "",
      });
    } else {
      addTextObject({ text: "" });
    }
  };

  return (
    <div style={{ display: "flex", gap: "8px", marginRight: "16px" }}>
      <button
        type="button"
        onClick={handleAdd}
        style={{
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          background: "#fff",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        텍스트 추가
      </button>

      <button
        type="button"
        onClick={removeSelectedTextObject}
        disabled={!selectedTextId}
        style={{
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          background: selectedTextId ? "#fff" : "#eee",
          cursor: selectedTextId ? "pointer" : "default",
          fontSize: "12px",
        }}
      >
        텍스트 삭제
      </button>
    </div>
  );
}

/* ---------------- InitFromLocationState ---------------- */

function InitFromLocationState() {
  const { setImageUrl, setOcrJsonUrl, setOriginalImageUrl } = useEditor();
  const { state } = useLocation();

  useEffect(() => {
    if (!state) return;

    const { outputUrl, originalUrl, ocrJsonUrl } = state;

    if (!outputUrl || !originalUrl || !ocrJsonUrl) return;

    setImageUrl(outputUrl);
    setOriginalImageUrl(originalUrl);
    setOcrJsonUrl(ocrJsonUrl);
  }, [state, setImageUrl, setOriginalImageUrl, setOcrJsonUrl]);

  return null;
}

/* ---------------- TranslationPage ---------------- */

function TranslationPage() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <EditorProvider>
      <InitFromLocationState />

      <div className="app-root">
        <div className="app-shell">
          <Header />
          <Tabs />

          <main
            style={{
              marginTop: "40px",
              display: "flex",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            {/* LEFT */}
            <div
              style={{
                width: "1146.764px",
                height: "740.735px",
                borderRadius: "22.935px",
                border: "1px solid #424242",
                background: "#ffffff",
                marginLeft: "40px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  height: "100%",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: "20px",
                    marginRight: "20px",
                  }}
                >
                  <Toggle onToggle={setShowOriginal} />
                  <TextBoxControls />
                </div>

                <div
                  style={{
                    marginLeft: "20px",
                    marginRight: "20px",
                    flex: 1,
                    background: "#f2f2f2",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Toolbar />
                  <Canvas showOriginal={showOriginal} />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "20px",
                  gap: "12px",
                }}
              >
                <DownloadButton />
              </div>
            </div>

            {/* RIGHT */}
            <div
              style={{
                width: "448.385px",
                height: "740.735px",
                borderRadius: "22.935px",
                border: "1px solid #424242",
                background: "#ffffff",
                marginRight: "40px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "32px",
                  paddingBottom: "28px",
                }}
              >
                <LanguageSelector />
              </div>

              <div style={{ flex: 1, minHeight: 0 }}>
                <RightTextPanel />
              </div>

              <div
                style={{
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: "center",
                  padding: "16px 0 24px",
                }}
              >
                <TranslateButton onLoadingChange={setIsTranslating} />
              </div>
            </div>
          </main>
        </div>
      </div>

      {isTranslating && (
        <div className="loading-overlay">
          <div className="loading-center">
            <div className="loading-spinner" />
            <p className="loading-text">번역 중…</p>
          </div>
        </div>
      )}
    </EditorProvider>
  );
}

export default TranslationPage;
