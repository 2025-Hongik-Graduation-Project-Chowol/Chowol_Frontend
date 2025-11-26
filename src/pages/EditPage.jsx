

// src/pages/EditPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/translation/Header";
import Tabs from "../components/translation/Tabs";
import Button from "../components/translation/Button";
import TextList from "../components/edit/TextList";
import ZoomControl from "../components/edit/ZoomControl";
import CanvasArea from "../components/edit/CanvasArea";
import "./EditPage.css";

function EditPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const originalUrl = state?.originalUrl || null;
  const maskUrl = state?.maskUrl || null;
  const ocrJsonUrl = state?.ocrJsonUrl || null;

  const [ocrItems, setOcrItems] = useState([]);
  const [zoomScale, setZoomScale] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // 🟦 기본 OCR JSON 불러오기 + 자동 + manual 모두 로드
  useEffect(() => {
    if (!ocrJsonUrl) return;

    const load = async () => {
      try {
        const res = await fetch(ocrJsonUrl);
        const data = await res.json();

        let items = [];

        // 🔹 1) 자동 OCR (한 줄 단위)
        let lines = [];
        let buf = "";
        let bufVertices = [];

        for (const page of data.pages || []) {
          for (const block of page.blocks || []) {
            for (const para of block.paragraphs || []) {
              for (const word of para.words || []) {
                for (const sym of word.symbols || []) {
                  buf += sym.text;
                  if (sym.boundingBox?.vertices)
                    bufVertices.push(...sym.boundingBox.vertices);

                  const br = sym.property?.detectedBreak;
                  if (br?.type === "LINE_BREAK") {
                    if (buf.trim()) {
                      lines.push({
                        text: buf.trim(),
                        vertices: [...bufVertices],
                      });
                    }
                    buf = "";
                    bufVertices = [];
                  }
                }
              }
            }
          }
        }

        // 마지막 라인 추가
        if (buf.trim()) {
          lines.push({
            text: buf.trim(),
            vertices: [...bufVertices],
          });
        }

        // boundingBox 만들기
        lines.forEach((line) => {
          const xs = line.vertices.map((v) => v.x);
          const ys = line.vertices.map((v) => v.y);

          items.push({
            text: line.text,
            source: "ocr",
            bbox: [
              { x: Math.min(...xs), y: Math.min(...ys) },
              { x: Math.max(...xs), y: Math.min(...ys) },
              { x: Math.max(...xs), y: Math.max(...ys) },
              { x: Math.min(...xs), y: Math.max(...ys) },
            ],
          });
        });

        // 🔹 2) manualTexts 추가 (드래그 추가)
        if (Array.isArray(data.manualTexts)) {
          data.manualTexts.forEach((m) => {
            items.push({
              text: m.text,
              bbox: m.bbox,
              source: "manual",
            });
          });
        }

        setOcrItems(items);
      } catch (err) {
        console.error("OCR JSON 파싱 실패:", err);
      }
    };

    load();
  }, [ocrJsonUrl]);

  // 🟦 드래그 후 API 호출
  const handleAddBox = async (bbox) => {
    try {
      const res = await fetch("http://3.238.171.96:5001/api/ocr/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: "test123",
          image_url: originalUrl,
          bbox,
        }),
      });

      if (!res.ok) {
        console.error("select 오류:", await res.text());
        return;
      }

      const result = await res.json();

      // 프런트에도 즉시 반영
      setOcrItems((prev) => [
        ...prev,
        {
          text: result.text,
          bbox: result.bbox,
          source: "manual",
        },
      ]);
    } catch (err) {
      console.error("select API 실패:", err);
    }
  };

  // 취소
  const handleCancel = () => {
    navigate("/inpaint", {
      state: { originalUrl, maskUrl, ocrJsonUrl },
    });
  };

  // 완료 → 다시 인페인팅
  const handleComplete = async () => {
    try {
      setIsLoading(true);

      const res = await fetch("http://3.238.171.96:5001/api/inpaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: originalUrl,
          mask_url: maskUrl,
        }),
      });

      if (!res.ok) {
        console.error("인페인팅 오류:", await res.text());
        return;
      }

      const data = await res.json();

      navigate("/inpaint", {
        state: {
          originalUrl,
          maskUrl,
          ocrJsonUrl,
          outputUrl: data.output_url,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-root">
      <div className="app-shell">
        <Header />
        <Tabs />

        <main className="edit-main">
          {/* LEFT */}
          <section className="edit-left-card">
            <div className="edit-left-inner">
              <div className="edit-canvas-wrapper">
                <CanvasArea
                  imageUrl={originalUrl}
                  ocrItems={ocrItems}
                  zoomScale={zoomScale}
                  isAdding={isAdding}
                  setIsAdding={setIsAdding}
                  onAddBox={handleAddBox}
                />

                <div className="edit-zoom-wrapper">
                  <ZoomControl zoomScale={zoomScale} setZoomScale={setZoomScale} />
                </div>
              </div>
            </div>

            <div className="edit-bottom-buttons">
              <Button
                onPress={handleCancel}
                style={{ backgroundColor: "#f2f2f2", color: "#000" }}
              >
                취소
              </Button>
              <Button onPress={handleComplete}>완료</Button>
            </div>
          </section>

          {/* RIGHT */}
          <section className="edit-right-card">
            <div className="edit-right-scroll">
              <TextList items={ocrItems} />
            </div>

            <div className="edit-add-button-wrapper">
              <Button onPress={() => setIsAdding(true)}>추가하기</Button>
            </div>
          </section>
        </main>
      </div>

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <p>인페인팅 중…</p>
        </div>
      )}
    </div>
  );
}

export default EditPage;
