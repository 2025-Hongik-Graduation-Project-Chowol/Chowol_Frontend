// src/components/translation/Tabs.jsx
import { useState } from "react";
import "./Tabs.css";

function Tabs() {
  const [activeTab, setActiveTab] = useState("translation");

  return (
    <div className="tabs-wrapper">
      <nav className="tabs">
        <button
          className={`tab ${
            activeTab === "inpainting" ? "tab-active" : "tab-inactive"
          }`}
          onClick={() => setActiveTab("inpainting")}
        >
          Inpainting
        </button>

        <button
          className={`tab ${
            activeTab === "translation" ? "tab-active" : "tab-inactive"
          }`}
          onClick={() => setActiveTab("translation")}
        >
          Translation
        </button>
      </nav>
    </div>
  );
}

export default Tabs;
