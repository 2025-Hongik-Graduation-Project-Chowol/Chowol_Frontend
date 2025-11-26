import React, { useState } from "react";

function OriginalToggle() {
  const [showOriginal, setShowOriginal] = useState(true);

  const handleToggle = () => {
    setShowOriginal((prev) => !prev);
    // TODO: 필요하면 부모로 상태 올리기
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={
        "flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
        (showOriginal
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-300 bg-white text-gray-700")
      }
    >
      {showOriginal ? "원본 보기" : "번역본 보기"}
    </button>
  );
}

export default OriginalToggle;
