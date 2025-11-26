import { apiClient } from "./api.client";

// image_url 기준으로 OCR JSON을 가져오는 API 예시
export async function loadOCRJson(imageUrl) {
  const res = await apiClient.post("/api/ocr/auto", {
    image_url: imageUrl,
  });
  return res.data; // Vision 형식의 JSON
}

// Vision JSON -> textObjects 변환 헬퍼 예시
export function visionJsonToTextObjects(visionJson) {
  // TODO: blocks / paragraphs / words를 어떻게 묶을지 규칙을 정해야 함
  // 일단은 block 기준으로 bbox + text를 합쳐서 하나의 textObject로 만든다고 가정.
  const textObjects = [];

  if (!visionJson?.pages) return textObjects;

  visionJson.pages.forEach((page) => {
    page.blocks.forEach((block, idx) => {
      const vertices = block.boundingBox.vertices;
      const x = vertices[0].x;
      const y = vertices[0].y;
      const width = vertices[1].x - vertices[0].x;
      const height = vertices[3].y - vertices[0].y;

      // block 내부 텍스트 추출 (단순 join)
      const textParts = [];
      block.paragraphs?.forEach((para) => {
        para.words?.forEach((word) => {
          const wordText =
            word.symbols?.map((s) => s.text).join("") ?? "";
          textParts.push(wordText);
        });
      });

      const text = textParts.join("");

      textObjects.push({
        id: `ocr_${idx}`,
        text,
        x,
        y,
        width,
        height,
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
