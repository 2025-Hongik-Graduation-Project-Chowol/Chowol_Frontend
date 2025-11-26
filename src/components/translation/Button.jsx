// src/components/common/Button.jsx

import "./Button.css";

function Button({ children, onPress, variant = "primary", style }) {
  return (
    <button
      className={`custom-btn ${variant}`}
      onClick={onPress}
      style={style}
    >
      {children}
    </button>
  );
}

export default Button;
