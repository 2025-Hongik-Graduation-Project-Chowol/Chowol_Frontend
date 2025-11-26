
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TranslationPage from "./pages/TranslationPage";
import UploadPage from "./pages/UploadPage";
import LoadingPage from "./pages/LoadingPage";
import InpaintPage from "./pages/InpaintPage";
import EditPage from "./pages/EditPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1번 화면 - 기본 업로드 페이지 */}
        <Route path="/" element={<UploadPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/inpaint" element={<InpaintPage />} />
        <Route path="/edit" element={<EditPage />} />
        <Route path="/translate" element={<TranslationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
history
