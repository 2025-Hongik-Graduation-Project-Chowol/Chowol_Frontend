

import { useState } from "react";
import "./Toggle.css";

function Toggle({ onToggle }) {
  const [isRight, setIsRight] = useState(false);

  const handleClick = () => {
    const newState = !isRight;
    setIsRight(newState);

    // ⭐ 부모에게 상태 전달
    if (onToggle) onToggle(newState);
  };

  return (
    <div className="toggle-wrapper" onClick={handleClick}>
      <div className={`toggle-slider ${isRight ? "right" : "left"}`} />

      <div className="toggle-labels">
        <span className={!isRight ? "active" : ""}>복원</span>
        <span className={isRight ? "active" : ""}>원본</span>
      </div>
    </div>
  );
}

export default Toggle;
