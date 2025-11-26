// src/services/api.export.js
const API_BASE_URL = "http://127.0.0.1:5001"; // 너가 쓰는 백엔드 주소

export async function exportFinalImage({ baseImageUrl, boxes }) {
  const res = await fetch(`${API_BASE_URL}/api/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ baseImageUrl, boxes }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Export API 실패: ${res.status} ${text}`);
  }

  return res.json(); // { message, url }
}
