// src/components/edit/TextList.jsx

import "../../pages/EditPage.css"; // edit-text-* 클래스 재사용

function TextList({ items }) {
  return (
    <div className="edit-text-panel">
      <h3 className="edit-text-header">Text</h3>

      <div className="edit-text-list">
        {items.map((item, idx) => (
          <div key={idx} className="edit-text-item">
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TextList;
