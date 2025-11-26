import axios from "axios";

const BASE_URL = "http://3.238.171.96:3000/api";

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file); // ← Node 서버에서 req.file로 받는 key 이름과 동일해야 함

  const res = await axios.post(`${BASE_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.imageUrl; // ← 백엔드에서 보내는 필드 이름 정확하게 반영
};