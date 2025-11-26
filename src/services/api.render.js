import { apiClient } from "./api.client";

// textObjects 기반으로 번역문이 들어간 이미지 재생성
export async function reinpaintImageAPI(imageUrl, textObjects) {
  const res = await apiClient.post("/api/render/reinpaint", {
    image_url: imageUrl,
    text_objects: textObjects,
  });
  // 응답: { image_url: "새로 렌더링된 S3 url" } 라고 가정
  return res.data;
}
