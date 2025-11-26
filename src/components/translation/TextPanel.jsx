// src/components/translation/TextPanel.jsx
import React from "react";

function TextPanel({ blocks, selectedId, onSelect, onChangeText }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingTop: "16px",
        paddingBottom: "16px",
      }}
    >
      {blocks.map((b) => (
        <div
          key={b.id}
          style={{
            border:
              selectedId === b.id
                ? "1px solid #6c4ad9"
                : "1px solid #dddddd",
            borderRadius: "8px",
            padding: "8px",
          }}
          onClick={() => onSelect && onSelect(b.id)}
        >
          <div style={{ fontSize: 12, color: "#666" }}>원본</div>
          <textarea
            value={b.original}
            onChange={(e) =>
              onChangeText(b.id, "original", e.target.value)
            }
            style={{
              width: "100%",
              resize: "vertical",
              border: "none",
              outline: "none",
              fontSize: 14,
              marginBottom: 8,
            }}
          />

          <div style={{ fontSize: 12, color: "#666" }}>번역</div>
          <textarea
            value={b.translated}
            onChange={(e) =>
              onChangeText(b.id, "translated", e.target.value)
            }
            style={{
              width: "100%",
              resize: "vertical",
              border: "none",
              outline: "none",
              fontSize: 14,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default TextPanel;
