// import React, { useState } from "react";
// import "./Toggle.css";

// function Toggle({ leftLabel = "복원", rightLabel = "원본", onChange }) {
//   const [isRight, setIsRight] = useState(false);

//   const handleClick = () => {
//     const next = !isRight;
//     setIsRight(next);
//     if (onChange) onChange(next); // 오른쪽이면 true
//   };

//   return (
//     <div className="toggle-wrapper" onClick={handleClick}>
//       <div className={`toggle-slider ${isRight ? "right" : "left"}`} />

//       <div className="toggle-labels">
//         <span className={!isRight ? "active" : ""}>{leftLabel}</span>
//         <span className={isRight ? "active" : ""}>{rightLabel}</span>
//       </div>
//     </div>
//   );
// }

// export default Toggle;

// // src/components/translation/Toggle.jsx
// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "./Toggle.css";

// function Toggle() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isRight, setIsRight] = useState(location.pathname === "/original"); 

//   const handleToggle = () => {
//     const nextState = !isRight;
//     setIsRight(nextState);

//     if (nextState) {
//       // 오른쪽 = 원본
//       navigate("/original", { replace: false });
//     } else {
//       // 왼쪽 = 복원
//       navigate("/inpaint", { replace: false });
//     }
//   };

//   return (
//     <div className="toggle-wrapper" onClick={handleToggle}>
//       <div className={`toggle-slider ${isRight ? "right" : "left"}`} />

//       <div className="toggle-labels">
//         <span className={!isRight ? "active" : ""}>복원</span>
//         <span className={isRight ? "active" : ""}>원본</span>
//       </div>
//     </div>
//   );
// }

// export default Toggle;

import React, { useState } from "react";
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
