// src/utils/visionToTextObjects.js

/**
 * Google Vision OCR JSON + imageLayout -> textObjects[]
 * Canvas 위에 올릴 TextBox 리스트
 */
export function visionJsonToTextObjects(visionJson, imageLayout) {
  if (!visionJson?.pages || !imageLayout) return [];

  const { scale, offsetX, offsetY } = imageLayout;
  const textObjects = [];

  const pages = visionJson.pages || [];
  pages.forEach((page, pageIdx) => {
    const blocks = page.blocks || [];
    blocks.forEach((block, blockIdx) => {
      const vertices = block.boundingBox?.vertices || [];
      if (vertices.length < 4) return;

      const xs = vertices.map((v) => v.x || 0);
      const ys = vertices.map((v) => v.y || 0);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      const origW = maxX - minX;
      const origH = maxY - minY;

      const x = offsetX + minX * scale;
      const y = offsetY + minY * scale;
      const width = origW * scale;
      const height = origH * scale;

      const textParts = [];
      (block.paragraphs || []).forEach((para) => {
        (para.words || []).forEach((word) => {
          const wordText =
            (word.symbols || []).map((s) => s.text || "").join("");
          if (wordText) {
            textParts.push(wordText);
          }
        });
      });

      const text = textParts.join("").trim();
      if (!text) return;

      textObjects.push({
        id: `ocr_${pageIdx}_${blockIdx}`,
        text,
        x,
        y,
        width: Math.max(width, 60),
        height: Math.max(height, 24),
        rotation: 0,
        style: {
          bold: false,
          italic: false,
          fontSize: 20,
          color: "#000000",
          fontFamily: "Noto Sans",
        },
      });
    });
  });

  return textObjects;
}

/**
 * Google Vision OCR JSON -> 오른쪽 textarea용 평문 텍스트
 */
export function visionJsonToPlainText(visionJson) {
  if (!visionJson?.pages) return "";

  const lines = [];

  const pages = visionJson.pages || [];
  pages.forEach((page) => {
    const blocks = page.blocks || [];
    blocks.forEach((block) => {
      const textParts = [];
      (block.paragraphs || []).forEach((para) => {
        (para.words || []).forEach((word) => {
          const wordText =
            (word.symbols || []).map((s) => s.text || "").join("");
          if (wordText) textParts.push(wordText);
        });
      });
      const blockText = textParts.join("");
      if (blockText.trim()) {
        lines.push(blockText.trim());
      }
    });
  });

  return lines.join("\n");
}
