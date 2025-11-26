import { useState } from "react";
import "./Toggle.css";

function Toggle({ onToggle }) {
  const [isRight, setIsRight] = useState(false);

  const handleClick = () => {
    const next = !isRight;
    setIsRight(next);
    if (onToggle) {
      onToggle(next); // true = 오른쪽(원본), false = 왼쪽(번역)
    }
  };

  return (
    <div className="toggle-wrapper" onClick={handleClick}>
      {/* 검은 반쪽 알약 */}
      <div className={`toggle-slider ${isRight ? "right" : "left"}`} />

      {/* 아래 라벨 */}
      <div className="toggle-labels">
        <span className={!isRight ? "active" : ""}>번역</span>
        <span className={isRight ? "active" : ""}>원본</span>
      </div>
    </div>
  );
}

export default Toggle;
