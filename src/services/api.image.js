import { apiClient } from "./api.client";

export async function loadInpaintedImage(imageUrl) {
  // 여기선 그냥 URL을 그대로 쓰면 되지만,
  // 필요하면 presigned-url 요청 등 백엔드 경유도 가능.
  return imageUrl;
}
