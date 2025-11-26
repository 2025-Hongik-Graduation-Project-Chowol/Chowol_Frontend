
// src/pages/InpaintPage.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/translation/Header";
import Tabs from "../components/translation/Tabs";
import Toggle from "../components/inpainting/Toggle";
import Button from "../components/inpainting/Button";
import { useLocation, useNavigate } from "react-router-dom";
import "./InpaintPage.css";

function InpaintPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const outputUrl = state?.outputUrl;
  const originalUrl = state?.originalUrl;
  const maskUrl = state?.maskUrl;
  const ocrJsonUrl = state?.ocrJsonUrl;


  // ⭐ 글로벌 endpoint → regional endpoint로 변환
  const convertToRegional = (url) => {
    if (!url) return url;

    // 이미 region 포함이면 그대로
    if (url.includes("s3.us-east-1.amazonaws.com")) return url;

    return url.replace(
      "s3.amazonaws.com",
      "s3.us-east-1.amazonaws.com"
    );
  };

  // 변환된 원본 URL
  const fixedOriginalUrl = convertToRegional(originalUrl);

  // 토글 상태 (false = 번역/인페인팅, true = 원본)
  const [showOriginal, setShowOriginal] = useState(false);

  // 항상 인페인팅된 이미지를 다운로드하도록 고정
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = outputUrl;
    link.download = "inpainted.png";
    link.click();
  };

  return (
    <div className="app-root">
      <div className="app-shell">

        <Header />
        <Tabs />

        <div className="inpaint-layout">
          <div className="inpaint-box">

            {/* 토글 + 수정하기 버튼 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <div style={{ marginLeft: "20px" }}>
                <Toggle onToggle={(v) => setShowOriginal(v)} />
              </div>

              <Button
                onPress={() =>
                  navigate("/edit", {
                    state: { outputUrl, originalUrl, maskUrl, ocrJsonUrl },
                  })
                }
                style={{ marginRight: "20px" }}
              >
                수정하기
              </Button>
            </div>

            {/* 이미지 영역 */}
            <div className="inpaint-image-wrapper">
              <img
                src={showOriginal ? fixedOriginalUrl : outputUrl}
                className="inpaint-image"
                onError={() =>
                  console.log(
                    "❌ 로딩 실패:", showOriginal ? fixedOriginalUrl : outputUrl
                  )
                }
                onLoad={() =>
                  console.log(
                    "✅ 로딩 성공:", showOriginal ? fixedOriginalUrl : outputUrl
                  )
                }
              />
            </div>

            {/* 버튼 영역 */}
            <div className="inpaint-buttons">
              <Button
                onPress={handleDownload}
                style={{
                  background: "#f2f2f2",
                  color: "#000",
                  border: "1px solid #ccc",
                }}
              >
                다운로드
              </Button>

              <Button
                onPress={() =>
                  navigate("/translate", {
                    state: { outputUrl, originalUrl, maskUrl, ocrJsonUrl },
                  })
                }
              >
                다음
              </Button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default InpaintPage;
