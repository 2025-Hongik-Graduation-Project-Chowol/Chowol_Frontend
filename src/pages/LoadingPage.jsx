
// LoadingPage.js
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/translation/Header";
import Footer from "../components/upload/Footer";
import "./UploadPage.css";   // ← UploadPage와 동일한 CSS 사용

import "./LoadingPage.css";   // ← 스피너 애니메이션만 포함

function LoadingPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const file = state?.file;
  console.log("🔥 전달된 파일:", file);

  useEffect(() => {
    if (!file) return;

    const runPipeline = async () => {
      try {
        // 1. S3 업로드
        const formData = new FormData();
        formData.append("image", file);

        const uploadRes = await fetch("http://3.238.171.96:3000/api/upload", {
          method: "POST",
          body: formData
        }).then((r) => r.json());

        const originalUrl = uploadRes.imageUrl;

        // 2. OCR 요청
        const ocrRes = await fetch("http://3.238.171.96:5001/api/ocr/auto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: "test123",
            image_url: originalUrl
          })
        }).then((r) => r.json());

        const maskUrl = ocrRes.mask_image_url;

        // 3. 인페인팅
        const inpaintRes = await fetch("http://3.238.171.96:5001/api/inpaint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_url: originalUrl,
            mask_url: maskUrl
          })
        }).then((r) => r.json());

        const outputUrl = inpaintRes.output_url;

        // 결과 화면 이동
        navigate("/inpaint", {
          state: {
            originalUrl,
            maskUrl,
            outputUrl,
            ocrJsonUrl: ocrRes.ocr_json_url
          }
        });

      } catch (err) {
        console.error("🔥 API 오류:", err);
      }
    };

    runPipeline();
  }, [file, navigate]);

  return (
    <div className="app-root">
      <div className="app-shell">

        <Header />

        {/* 💛 UploadPage 구조 그대로 복원 */}
        <div className="upload-wrapper">

          <div className="upload-card">

            <div className="upload-box">
              <div className="loading-center">
                <div className="loading-spinner" />
                <p className="loading-text">업로드 중입니다...</p>
              </div>
            </div>

          </div>

        </div>

        <Footer />

      </div>
    </div>
  );
}

export default LoadingPage;
