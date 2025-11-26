// src/services/api.translate.js

// 🔹 UI 테스트용 더미 번역 (원래 쓰던 거, 남겨두기)
export async function translateText(original) {
  if (!original || !original.trim()) return "";

  const lines = original.split("\n");
  const translatedLines = lines.map((line) =>
    line.trim() ? `Translated: ${line.trim()}` : ""
  );

  return translatedLines.join("\n");
}

// TODO: 실제 백엔드 주소로 바꿔줘 (이미 넣었다고 했던 부분)
const API_BASE_URL = "http://3.238.171.96:5001";

/**
 * process_translation 호출 + S3 translatedUrl JSON까지 불러오는 헬퍼
 *
 * backend:
 *   body.ocrJsonUrl
 *   body.originalImageUrl
 *   body.forcedSource (선택)
 *   body.target       (선택)
 * => { translatedUrl, source, target, ... }
 */
export async function translateWithPapagoService({
  ocrJsonUrl,
  originalImageUrl,
  sourceLang = "auto", // 🔹 EditorContext에서 넘어오는 값
  targetLang = "ko",   // 🔹 EditorContext에서 넘어오는 값
}) {
  // 1) 번역 요청
  const res = await fetch(`${API_BASE_URL}/api/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ocrJsonUrl,
      originalImageUrl,
      // 🔹 백엔드가 기대하는 필드 이름으로 매핑
      // auto(언어 인식)이면 강제 지정 안 함
      forcedSource: sourceLang === "auto" ? null : sourceLang,
      target: targetLang,
    }),
  });

  if (!res.ok) {
    throw new Error(`번역 API 호출 실패: ${res.status}`);
  }

  const data = await res.json();
  const { translatedUrl, source, target: realTarget } = data;

  // 2) S3에 저장된 [ { original, translated } ] JSON 다시 로드
  const jsonRes = await fetch(translatedUrl);
  if (!jsonRes.ok) {
    throw new Error(`translatedUrl JSON 로드 실패: ${jsonRes.status}`);
  }

  /** @type {{ original: string, translated: string }[]} */
  const pairs = await jsonRes.json();

  // 3) 오른쪽 패널용 문자열 만들기
  const originalText = pairs.map((p) => p.original ?? "").join("\n");
  const translatedText = pairs.map((p) => p.translated ?? "").join("\n");

  return {
    originalText,
    translatedText,
    pairs,
    meta: { source, target: realTarget, translatedUrl },
  };
}



/**
 * 🔹 수정된 원본 텍스트를 그대로 번역하는 헬퍼 (/api/translate/text)
 */
export async function translateRawTextWithPapago({
  text,
  sourceLang = "auto",
  targetLang,
}) {
  if (!text || !text.trim()) {
    return "";
  }
  if (!targetLang) {
    throw new Error("targetLang is required for translateRawTextWithPapago");
  }

  const res = await fetch(`${API_BASE_URL}/api/translate/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      source_lang: sourceLang,
      target_lang: targetLang,
    }),
  });

  if (!res.ok) {
    throw new Error(`텍스트 번역 API 호출 실패: ${res.status}`);
  }

  const data = await res.json();

  if (data.message === "same_language") {
    return data.translated_text ?? text;
  }
  if (data.message !== "success") {
    throw new Error(`텍스트 번역 실패: ${data.message}`);
  }

  return data.translated_text;
}




// 🔹 OCR JSON + 번역 JSON 기반으로 텍스트 박스(boxes) 받아오는 헬퍼 (/api/reinsert)
export async function fetchReinsertBoxes({ ocrJsonUrl, translatedJsonUrl }) {
  const res = await fetch(`${API_BASE_URL}/api/reinsert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ocr_json_url: ocrJsonUrl,
      translated_json_url: translatedJsonUrl,
    }),
  });

  if (!res.ok) {
    throw new Error(`reinsert API 호출 실패: ${res.status}`);
  }

  const data = await res.json();

  if (data.message !== "success") {
    throw new Error(`reinsert 실패: ${data.message}`);
  }

  return data.boxes || [];
}



/**
 * 최종 이미지 합성 요청
 * - imageLayout을 이용해 화면 좌표(textObjects)를 원본 좌표계로 환산하고
 * - 백엔드 /api/export/image 호출
 */
export async function exportFinalImage({ baseImageUrl, imageLayout, textObjects }) {
  if (!baseImageUrl || !imageLayout) {
    throw new Error("baseImageUrl 또는 imageLayout이 없습니다.");
  }

  const { offsetX, offsetY, scale } = imageLayout;

  // 👉 화면 좌표 → 원본 이미지 좌표로 변환
  const boxes = textObjects.map((obj) => {
    const { x, y, text, style = {} } = obj;

    const natX = (x - offsetX) / scale;
    const natY = (y - offsetY) / scale;

    return {
      x: natX,
      y: natY,
      text: text || "",
      fontSize: style.fontSize || 24,
      color: style.color || "#000000",
      bold: !!style.bold,
      italic: !!style.italic,
      fontFamily: style.fontFamily || "Noto Sans",
    };
  });

  const res = await fetch(`${API_BASE_URL}/api/export/image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      baseImageUrl,
      boxes,
    }),
  });

  if (!res.ok) {
    throw new Error(`export API 실패: ${res.status}`);
  }

  const data = await res.json();
  // { message: "success", finalImageUrl: "https://..." }
  return data.finalImageUrl;
}