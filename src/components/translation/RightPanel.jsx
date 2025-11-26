import React, { useState } from "react";
import { useEditor } from "./EditorContext";
import { translateTextAPI } from "../../services/api.translate";

export const RightPanel = () => {
  const { textObjects, setTextObjects } = useEditor();

  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  // OCR JSON에서 넘어왔을 때 한 번 세팅해주는 헬퍼 (나중에 EditorContext or Page에서 호출)
  // originalText는 OCR에서 가져온 전체 문장/줄 합친 것이라고 가정.
  // translatedText는 translate API 이후 업데이트.

  const handleClickTranslate = async () => {
    try {
      const res = await translateTextAPI(originalText);
      // 예시: 백엔드 응답을 그대로 textarea에 펼친다고 가정
      // [
      //   { original: "...", translated: "..." },
      //   ...
      // ]
      const lines = res
        .map((item) => item.translated)
        .join("\n");
      setTranslatedText(lines);

      // textObjects에 번역문을 싱크하는 로직은 여기서/또는 별도 헬퍼로
      // 예: 각 textObject.text를 대응되는 translated로 변경
      // setTextObjects(...) 로 업데이트
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        {/* LanguageSelector는 이미 있다고 했으니 여기에 배치 */}
        <div className="font-semibold">Language</div>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">원본 텍스트</label>
        <textarea
          className="flex-1 border rounded-md p-2 text-sm"
          value={originalText}
          onChange={(e) => setOriginalText(e.target.value)}
        />
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">번역된 텍스트</label>
        <textarea
          className="flex-1 border rounded-md p-2 text-sm"
          value={translatedText}
          onChange={(e) => setTranslatedText(e.target.value)}
        />
      </div>

      <button
        className="mt-2 py-2 px-4 rounded-md bg-black text-white text-sm"
        onClick={handleClickTranslate}
      >
        번역하기
      </button>
    </div>
  );
};
