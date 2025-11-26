// UploadPage.js
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/translation/Header";
import Footer from "../components/upload/Footer";
import uploadIcon from "../assets/upload/Icon.svg";
import "./UploadPage.css";

function UploadPage() {
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const startUploadFlow = (file) => {
    if (!file) return;

    // 2번 화면(로딩 화면)으로 넘어가면서 파일 전달
    navigate("/loading", {
      state: {
        file: file
      }
    });
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) {
      setImageFile(f);
      startUploadFlow(f);
    }
  }, []);

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (f) {
      setImageFile(f);
      startUploadFlow(f);
    }
  };

  return (
    <div className="app-root">
      <div className="app-shell">

        <Header />

        <div className="upload-wrapper">
          <div className="upload-card">

            <div 
              className="upload-box"
              onDrop={handleDrop}
              onDragOver={(e)=> e.preventDefault()}
            >
              {!imageFile ? (
                <>
                  <p className="upload-text">
                    번역할 <strong>이미지</strong>를 드래그하거나 불러오세요
                  </p>

                  <label className="upload-button">
                    <img src={uploadIcon} />
                    이미지 불러오기
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: "none" }}
                    />
                  </label>
                </>
              ) : (
                <img
                  src={URL.createObjectURL(imageFile)}
                  className="preview-image"
                />
              )}
            </div>

          </div>
        </div>

        <Footer />

      </div>
    </div>
  );
}

export default UploadPage;
