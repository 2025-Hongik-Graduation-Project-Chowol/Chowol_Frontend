// src/components/translation/DownloadButton.jsx
import React from "react";
import Button from "./Button";
import { useEditor } from "./EditorContext";

function DownloadButton() {
  const { imageUrl, imageLayout, textObjects } = useEditor();

  const handleDownload = () => {
    if (!imageUrl) {
      console.warn("이미지 URL이 없습니다.");
      return;
    }

    // 🔹 배경 이미지 로드
    const img = new Image();
    img.crossOrigin = "anonymous"; // S3/CloudFront CORS 허용돼 있으면 OK
    img.src = imageUrl;

    img.onload = () => {
      // 🔹 출력 캔버스 크기 (가능하면 원본 해상도 사용)
      const natW = imageLayout?.natW || img.naturalWidth || img.width;
      const natH = imageLayout?.natH || img.naturalHeight || img.height;

      const canvas = document.createElement("canvas");
      canvas.width = natW;
      canvas.height = natH;
      const ctx = canvas.getContext("2d");

      // 1) 배경 이미지 그리기
      ctx.drawImage(img, 0, 0, natW, natH);

      // 2) 텍스트 박스들 그리기
      (textObjects || []).forEach((obj) => {
        const {
          x,
          y,
          width,
          height,
          rotation = 0,
          text = "",
          style = {},
        } = obj;

        const {
          fontSize = 20,
          fontFamily = "Noto Sans",
          color = "#000000",
          bold = false,
          italic = false,
        } = style;

        // 🔹 좌표가 화면 좌표인지, 원본 좌표인지에 따라 변환
        //   - reinsert 박스는 원본 좌표
        //   - 사용자가 추가한 박스도 EditorContext에서 이미 보정해 놨다고 가정
        //   만약 화면 좌표라면 아래처럼 역변환하면 됨:
        //
        // const scale = imageLayout?.scale || 1;
        // const offsetX = imageLayout?.offsetX || 0;
        // const offsetY = imageLayout?.offsetY || 0;
        // const natX = (x - offsetX) / scale;
        // const natY = (y - offsetY) / scale;
        // const natWBox = width / scale;
        // const natHBox = height / scale;
        //
        // 지금은 x,y,width,height가 "원본 좌표"라고 보고 그대로 사용:

        const natX = x;
        const natY = y;
        const natWBox = width;
        const natHBox = height;

        ctx.save();

        // 🔹 회전 중심 = 박스 왼쪽 위 (TextBox랑 동일하게)
        ctx.translate(natX, natY);
        ctx.rotate((rotation * Math.PI) / 180);

        // 텍스트 스타일
        const fontWeight = bold ? "700" : "400";
        const fontStyle = italic ? "italic" : "normal";
        ctx.fillStyle = color;
        ctx.textBaseline = "top";
        ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;

        // 🔹 줄바꿈 그대로 살리기 (세로 나열 유지용)
        const lines = (text || "").split("\n");
        const lineHeight = fontSize * 1.2;

        lines.forEach((line, idx) => {
          ctx.fillText(line, 0, idx * lineHeight);
        });

        ctx.restore();
      });

      // 3) 실제 다운로드
      const link = document.createElement("a");
      link.download = "translated-image.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.onerror = (err) => {
      console.error("이미지 로드 실패:", err);
    };
  };

  return <Button onPress={handleDownload}>이미지 다운로드</Button>;
}

export default DownloadButton;
