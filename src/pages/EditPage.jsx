// // src/pages/EditPage.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Header from "../components/translation/Header";
// import Tabs from "../components/translation/Tabs";
// import Toggle from "../components/translation/Toggle";
// import Button from "../components/translation/Button";
// import TextList from "../components/edit/Textlist";
// import ZoomControl from "../components/edit/zoomControl";
// import CanvasArea from "../components/edit/CanvasArea";


// import "./EditPage.css";

// function EditPage() {
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   // 3번(/inpaint) 화면에서 넘어오는 값들
//   const originalUrl = state?.originalUrl || null;
//   const ocrJsonUrl = state?.ocrJsonUrl || null;
//   const projectId = "test123";

//   const [ocrItems, setOcrItems] = useState([]);
//   const [zoomScale, setZoomScale] = useState(1); // 1 = 100%
//   const [isAdding, setIsAdding] = useState(false);

//   // 🔹 OCR JSON 로드해서 텍스트/박스 세팅
//   useEffect(() => {
//     if (!ocrJsonUrl) return;

//     const load = async () => {
//       try {
//         const res = await fetch(ocrJsonUrl);
//         const data = await res.json();

//         const items = [];

//         // TODO: 네 full_text_annotation 구조에 맞춰 추가로 파싱하면 됨
//         // 여기서는 manualTexts만 예시로 사용
//         if (Array.isArray(data.manualTexts)) {
//           data.manualTexts.forEach((item) => {
//             items.push({
//               text: item.text,
//               bbox: item.bbox, // [{x,y}, ...4점]
//               source: "manual",
//             });
//           });
//         }

//         setOcrItems(items);
//       } catch (e) {
//         console.error("OCR JSON 로드 실패:", e);
//       }
//     };

//     load();
//   }, [ocrJsonUrl]);

//   // 🔹 드래그 박스 추가 → /ocr/select 호출
//   const handleAddBox = async (bbox) => {
//     // bbox: [{x,y}, {x,y}, {x,y}, {x,y}] (이미 원본 이미지 좌표)
//     if (!originalUrl) return;

//     try {
//       const res = await fetch("http://3.238.171.96:5001/api/ocr/select", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           projectId,
//           image_url: originalUrl,
//           bbox,
//         }),
//       });

//       if (!res.ok) {
//         console.error("ocr/select 실패", await res.text());
//         return;
//       }

//       const result = await res.json();

//       const newItem = {
//         text: result.text,
//         bbox: result.bbox,
//         source: "manual",
//       };

//       setOcrItems((prev) => [...prev, newItem]);
//     } catch (e) {
//       console.error("ocr/select 오류:", e);
//     }
//   };

//   // 🔹 취소 → 3번(/inpaint) 화면으로 그냥 복귀
//   const handleCancel = () => {
//     navigate("/inpaint", {
//       state: {
//         originalUrl,
//         ocrJsonUrl,
//       },
//     });
//   };

//   // 🔹 완료 → 조용히 인페인팅 재실행 (팝업 X)
//   const handleComplete = async () => {
//     try {
//       // TODO: 인페인팅 재실행 API 호출 자리
//       // await fetch("http://.../api/inpaint/reapply", {...})

//       navigate("/inpaint", {
//         state: {
//           originalUrl,
//           ocrJsonUrl,
//         },
//       });
//     } catch (e) {
//       console.error("인페인팅 재실행 오류:", e);
//     }
//   };

//   // 🔹 이미지 없을 때도 프레임은 유지 → 캔버스 안에서만 안내 메시지
//   const renderCanvas = () => {
//     if (!originalUrl) {
//       return (
//         <div className="edit-canvas-empty">
//           이미지가 없습니다. 업로드 화면에서 다시 시도해주세요.
//         </div>
//       );
//     }

//     return (
//       <CanvasArea
//         imageUrl={originalUrl}
//         ocrItems={ocrItems}
//         zoomScale={zoomScale}
//         isAdding={isAdding}
//         setIsAdding={setIsAdding}
//         onAddBox={handleAddBox}
//       />
//     );
//   };

//   return (
//     <div className="app-root">
//       <div className="app-shell">
//         <Header />
//         <Tabs />

//         <main className="edit-main">
//           {/* LEFT: 이미지 / 캔버스 */}
//           <section className="edit-left-card">
//             <div className="edit-left-inner">
//               <div className="edit-toggle-wrapper">
//                 {                             }
//                 <div style={{ width: "80px", height: "32px" }} />
//               </div>

//               <div className="edit-canvas-wrapper">
//                 {renderCanvas()}

//                 {/* 줌 컨트롤: 오른쪽 아래 */}
//                 <div className="edit-zoom-wrapper">
//                   <ZoomControl
//                     zoomScale={zoomScale}
//                     setZoomScale={setZoomScale}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="edit-bottom-buttons">
//               <Button
//                 onPress={handleCancel}
//                 style={{ backgroundColor: "#f2f2f2", color: "#000" }}
//               >
//                 취소
//               </Button>
//               <Button onPress={handleComplete}>완료</Button>
//             </div>
//           </section>

//           {/* RIGHT: Text 리스트 */}
//           <section className="edit-right-card">
//             <TextList items={ocrItems} />
//             <div className="edit-add-button-wrapper">
//               <Button onPress={() => setIsAdding(true)}>추가하기</Button>
//             </div>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default EditPage;


// // src/pages/EditPage.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Header from "../components/translation/Header";
// import Tabs from "../components/translation/Tabs";
// import Toggle from "../components/translation/Toggle";
// import Button from "../components/translation/Button";
// import TextList from "../components/edit/TextList";
// import ZoomControl from "../components/edit/ZoomControl";
// import CanvasArea from "../components/edit/CanvasArea";

// import "./EditPage.css";

// function EditPage() {
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   const originalUrl = state?.originalUrl || null;
//   const ocrJsonUrl = state?.ocrJsonUrl || null;
//   const projectId = "test123";

//   const [ocrItems, setOcrItems] = useState([]);
//   const [zoomScale, setZoomScale] = useState(1);
//   const [isAdding, setIsAdding] = useState(false);

//   // OCR JSON 불러오기
//   useEffect(() => {
//     if (!ocrJsonUrl) return;

//     const load = async () => {
//       try {
//         const res = await fetch(ocrJsonUrl);
//         const data = await res.json();

//         const items = [];

//         if (Array.isArray(data.manualTexts)) {
//           data.manualTexts.forEach((item) => {
//             items.push({
//               text: item.text,
//               bbox: item.bbox,
//               source: "manual",
//             });
//           });
//         }

//         setOcrItems(items);
//       } catch (e) {
//         console.error("OCR JSON 로드 실패:", e);
//       }
//     };

//     load();
//   }, [ocrJsonUrl]);

//   // 바운딩 박스 추가 API
//   const handleAddBox = async (bbox) => {
//     if (!originalUrl) return;

//     try {
//       const res = await fetch("http://3.238.171.96:5001/api/ocr/select", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           projectId,
//           image_url: originalUrl,
//           bbox,
//         }),
//       });

//       if (!res.ok) {
//         console.error("ocr/select 실패", await res.text());
//         return;
//       }

//       const result = await res.json();

//       const newItem = {
//         text: result.text,
//         bbox: result.bbox,
//         source: "manual",
//       };

//       setOcrItems((prev) => [...prev, newItem]);
//     } catch (e) {
//       console.error("ocr/select 오류:", e);
//     }
//   };

//   // 취소
//   const handleCancel = () => {
//     navigate("/inpaint", {
//       state: { originalUrl, ocrJsonUrl },
//     });
//   };

//   // 완료
//   const handleComplete = () => {
//     navigate("/inpaint", {
//       state: { originalUrl, ocrJsonUrl },
//     });
//   };

//   // 캔버스 렌더링
//   const renderCanvas = () => {
//     if (!originalUrl) {
//       return (
//         <div className="edit-canvas-empty">
//           이미지가 없습니다. 업로드 화면에서 다시 시도해주세요.
//         </div>
//       );
//     }

//     return (
//       <CanvasArea
//         imageUrl={originalUrl}
//         ocrItems={ocrItems}
//         zoomScale={zoomScale}
//         isAdding={isAdding}
//         setIsAdding={setIsAdding}
//         onAddBox={handleAddBox}
//       />
//     );
//   };

//   return (
//     <div className="app-root">
//       <div className="app-shell">
//         <Header />
//         <Tabs />

//         <main className="edit-main">

//           {/* LEFT: 이미지 / 캔버스 */}
//           <section className="edit-left-card">
//             <div className="edit-left-inner">
//               <div className="edit-toggle-wrapper">
//                 {/* 토글 비어 있는 영역 */}
//                 <div style={{ width: "80px", height: "32px" }} />
//               </div>

//               <div className="edit-canvas-wrapper">
//                 {renderCanvas()}

//                 <div className="edit-zoom-wrapper">
//                   <ZoomControl
//                     zoomScale={zoomScale}
//                     setZoomScale={setZoomScale}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="edit-bottom-buttons">
//               <Button
//                 onPress={handleCancel}
//                 style={{ backgroundColor: "#f2f2f2", color: "#000" }}
//               >
//                 취소
//               </Button>
//               <Button onPress={handleComplete}>완료</Button>
//             </div>
//           </section>

//           {/* RIGHT: Text 리스트 */}
//           <section className="edit-right-card">

//             {/* ⭐ 스크롤 생기는 영역 */}
//             <div className="edit-right-scroll">
//               <TextList items={ocrItems} />
//             </div>

//             <div className="edit-add-button-wrapper">
//               <Button onPress={() => setIsAdding(true)}>추가하기</Button>
//             </div>

//           </section>

//         </main>
//       </div>
//     </div>
//   );
// }

// export default EditPage;


// src/pages/EditPage.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Header from "../components/translation/Header";
// import Tabs from "../components/translation/Tabs";
// import Button from "../components/translation/Button";
// import TextList from "../components/edit/TextList";
// import ZoomControl from "../components/edit/ZoomControl";
// import CanvasArea from "../components/edit/CanvasArea";

// import "./EditPage.css";

// function EditPage() {
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   const originalUrl = state?.originalUrl || null;
//   const maskUrl = state?.maskUrl || null;
//   const ocrJsonUrl = state?.ocrJsonUrl || null;

//   const [ocrItems, setOcrItems] = useState([]);
//   const [zoomScale, setZoomScale] = useState(1);
//   const [isAdding, setIsAdding] = useState(false);

//   // OCR JSON → line 단위로 묶어서 파싱
//   useEffect(() => {
//     if (!ocrJsonUrl) return;

//     const load = async () => {
//       try {
//         const res = await fetch(ocrJsonUrl);
//         const data = await res.json();

//         let lines = [];
//         let bufText = "";
//         let bufVertices = [];

//         for (const page of data.pages || []) {
//           for (const block of page.blocks || []) {
//             for (const para of block.paragraphs || []) {
//               for (const word of para.words || []) {
//                 for (const sym of word.symbols || []) {
//                   bufText += sym.text;

//                   if (sym.boundingBox?.vertices) {
//                     bufVertices.push(...sym.boundingBox.vertices);
//                   }

//                   const br = sym.property?.detectedBreak;
//                   if (br?.type === "LINE_BREAK") {
//                     if (bufText.trim()) {
//                       lines.push({
//                         text: bufText.trim(),
//                         vertices: [...bufVertices],
//                         source: "ocr",
//                       });
//                     }
//                     bufText = "";
//                     bufVertices = [];
//                   }
//                 }
//               }
//             }
//           }
//         }

//         if (bufText.trim()) {
//           lines.push({
//             text: bufText.trim(),
//             vertices: [...bufVertices],
//             source: "ocr",
//           });
//         }

//         // line → 4점 bbox 변환
//         const items = lines.map((line) => {
//           const xs = line.vertices.map((v) => v.x);
//           const ys = line.vertices.map((v) => v.y);

//           return {
//             text: line.text,
//             bbox: [
//               { x: Math.min(...xs), y: Math.min(...ys) },
//               { x: Math.max(...xs), y: Math.min(...ys) },
//               { x: Math.max(...xs), y: Math.max(...ys) },
//               { x: Math.min(...xs), y: Math.max(...ys) },
//             ],
//             source: "ocr",
//           };
//         });

//         setOcrItems(items);
//       } catch (e) {
//         console.error("OCR JSON 로드 실패:", e);
//       }
//     };

//     load();
//   }, [ocrJsonUrl]);

//   // 박스 수동 추가
//   const handleAddBox = (bbox) => {
//     setOcrItems((prev) => [
//       ...prev,
//       {
//         text: "",
//         bbox,
//         source: "manual",
//       },
//     ]);
//   };

//   // 취소
//   const handleCancel = () => {
//     navigate("/inpaint", {
//       state: { originalUrl, maskUrl, ocrJsonUrl },
//     });
//   };

//   // 완료 → 인페인팅 재실행 후 이동
//   const handleComplete = async () => {
//     try {
//       const res = await fetch("http://3.238.171.96:5001/api/inpaint", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           image_url: originalUrl,
//           mask_url: maskUrl,
//         }),
//       });

//       if (!res.ok) {
//         console.error("인페인팅 실패:", await res.text());
//         return;
//       }

//       const { output_url } = await res.json();

//       navigate("/inpaint", {
//         state: {
//           originalUrl,
//           maskUrl,
//           ocrJsonUrl,
//           outputUrl: output_url,
//         },
//       });
//     } catch (err) {
//       console.error("인페인팅 오류:", err);
//     }
//   };

//   return (
//     <div className="app-root">
//       <div className="app-shell">
//         <Header />
//         <Tabs />

//         <main className="edit-main">
//           {/* LEFT */}
//           <section className="edit-left-card">
//             <div className="edit-left-inner">

//               <div className="edit-canvas-wrapper">
//                 <CanvasArea
//                   imageUrl={originalUrl}
//                   ocrItems={ocrItems}
//                   zoomScale={zoomScale}
//                   isAdding={isAdding}
//                   setIsAdding={setIsAdding}
//                   onAddBox={handleAddBox}
//                 />

//                 <div className="edit-zoom-wrapper">
//                   <ZoomControl zoomScale={zoomScale} setZoomScale={setZoomScale} />
//                 </div>
//               </div>
//             </div>

//             <div className="edit-bottom-buttons">
//               <Button
//                 onPress={handleCancel}
//                 style={{ backgroundColor: "#f2f2f2", color: "#000" }}
//               >
//                 취소
//               </Button>
//               <Button onPress={handleComplete}>완료</Button>
//             </div>
//           </section>

//           {/* RIGHT */}
//           <section className="edit-right-card">
//             <div className="edit-right-scroll">
//               <TextList items={ocrItems} />
//             </div>

//             <div className="edit-add-button-wrapper">
//               <Button onPress={() => setIsAdding(true)}>추가하기</Button>
//             </div>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default EditPage;


// src/pages/EditPage.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Header from "../components/translation/Header";
// import Tabs from "../components/translation/Tabs";
// import Button from "../components/translation/Button";
// import TextList from "../components/edit/TextList";
// import ZoomControl from "../components/edit/ZoomControl";
// import CanvasArea from "../components/edit/CanvasArea";

// import "./EditPage.css";

// function EditPage() {
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   // 받아온 값들
//   const originalUrl = state?.originalUrl || null;
//   const maskUrl = state?.maskUrl || null;
//   const ocrJsonUrl = state?.ocrJsonUrl || null;

//   const [ocrItems, setOcrItems] = useState([]);
//   const [zoomScale, setZoomScale] = useState(1);
//   const [isAdding, setIsAdding] = useState(false);

//   // ⭐ 로딩 상태 추가
//   const [isLoading, setIsLoading] = useState(false);

//   // ========= OCR JSON 불러와서 "한 줄 단위"로 묶기 =========
//   useEffect(() => {
//     if (!ocrJsonUrl) return;

//     const load = async () => {
//       try {
//         const res = await fetch(ocrJsonUrl);
//         const data = await res.json();

//         let lines = [];
//         let bufText = "";
//         let bufVertices = [];

//         for (const page of data.pages || []) {
//           for (const block of page.blocks || []) {
//             for (const para of block.paragraphs || []) {
//               for (const word of para.words || []) {
//                 for (const sym of word.symbols || []) {
//                   bufText += sym.text;

//                   if (sym.boundingBox?.vertices) {
//                     bufVertices.push(...sym.boundingBox.vertices);
//                   }

//                   const br = sym.property?.detectedBreak;
//                   if (br?.type === "LINE_BREAK") {
//                     if (bufText.trim()) {
//                       lines.push({
//                         text: bufText.trim(),
//                         vertices: [...bufVertices],
//                         source: "ocr",
//                       });
//                     }
//                     bufText = "";
//                     bufVertices = [];
//                   }
//                 }
//               }
//             }
//           }
//         }

//         if (bufText.trim()) {
//           lines.push({
//             text: bufText.trim(),
//             vertices: [...bufVertices],
//             source: "ocr",
//           });
//         }

//         const items = lines.map((line) => {
//           const xs = line.vertices.map((v) => v.x);
//           const ys = line.vertices.map((v) => v.y);

//           return {
//             text: line.text,
//             bbox: [
//               { x: Math.min(...xs), y: Math.min(...ys) },
//               { x: Math.max(...xs), y: Math.min(...ys) },
//               { x: Math.max(...xs), y: Math.max(...ys) },
//               { x: Math.min(...xs), y: Math.max(...ys) },
//             ],
//             source: "ocr",
//           };
//         });

//         setOcrItems(items);
//       } catch (e) {
//         console.error("OCR JSON 로드 실패:", e);
//       }
//     };

//     load();
//   }, [ocrJsonUrl]);

//   // ========= 수동 박스 추가 =========
//   const handleAddBox = (bbox) => {
//     setOcrItems((prev) => [
//       ...prev,
//       {
//         text: "",
//         bbox,
//         source: "manual",
//       },
//     ]);
//   };

//   // ========= 취소 =========
//   const handleCancel = () => {
//     navigate("/inpaint", {
//       state: { originalUrl, maskUrl, ocrJsonUrl },
//     });
//   };

//   // ========= 완료 → 인페인팅 재실행 + 로딩 표시 =========
//   const handleComplete = async () => {
//     try {
//       setIsLoading(true); // ⭐ 로딩 시작

//       const res = await fetch("http://3.238.171.96:5001/api/inpaint", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           image_url: originalUrl,
//           mask_url: maskUrl,
//         }),
//       });

//       if (!res.ok) {
//         console.error("인페인팅 실패:", await res.text());
//         setIsLoading(false); 
//         return;
//       }

//       const { output_url } = await res.json();

//       navigate("/inpaint", {
//         state: {
//           originalUrl,
//           maskUrl,
//           ocrJsonUrl,
//           outputUrl: output_url,
//         },
//       });
//     } catch (err) {
//       console.error("인페인팅 오류:", err);
//     } finally {
//       setIsLoading(false); // ⭐ 완료 또는 에러 → 로딩 종료
//     }
//   };

//   return (
//     <div className="app-root">
//       <div className="app-shell">
//         <Header />
//         <Tabs />

//         <main className="edit-main">
//           {/* LEFT */}
//           <section className="edit-left-card">
//             <div className="edit-left-inner">
//               <div className="edit-canvas-wrapper">
//                 <CanvasArea
//                   imageUrl={originalUrl}
//                   ocrItems={ocrItems}
//                   zoomScale={zoomScale}
//                   isAdding={isAdding}
//                   setIsAdding={setIsAdding}
//                   onAddBox={handleAddBox}
//                 />

//                 <div className="edit-zoom-wrapper">
//                   <ZoomControl zoomScale={zoomScale} setZoomScale={setZoomScale} />
//                 </div>
//               </div>
//             </div>

//             <div className="edit-bottom-buttons">
//               <Button
//                 onPress={handleCancel}
//                 style={{ backgroundColor: "#f2f2f2", color: "#000" }}
//               >
//                 취소
//               </Button>
//               <Button onPress={handleComplete}>완료</Button>
//             </div>
//           </section>

//           {/* RIGHT */}
//           <section className="edit-right-card">
//             <div className="edit-right-scroll">
//               <TextList items={ocrItems} />
//             </div>

//             <div className="edit-add-button-wrapper">
//               <Button onPress={() => setIsAdding(true)}>추가하기</Button>
//             </div>
//           </section>
//         </main>
//       </div>

//       {/* ⭐ 화면 전체 덮는 로딩 오버레이 */}
//       {isLoading && (
//         <div className="loading-overlay">
//           <div className="spinner"></div>
//           <p className="loading-text">인페인팅 중...</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default EditPage;


// src/pages/EditPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/translation/Header";
import Tabs from "../components/translation/Tabs";
import Button from "../components/translation/Button";
import TextList from "../components/edit/TextList";
import ZoomControl from "../components/edit/ZoomControl";
import CanvasArea from "../components/edit/CanvasArea";
import "./EditPage.css";

function EditPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const originalUrl = state?.originalUrl || null;
  const maskUrl = state?.maskUrl || null;
  const ocrJsonUrl = state?.ocrJsonUrl || null;

  const [ocrItems, setOcrItems] = useState([]);
  const [zoomScale, setZoomScale] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // 🟦 기본 OCR JSON 불러오기 + 자동 + manual 모두 로드
  useEffect(() => {
    if (!ocrJsonUrl) return;

    const load = async () => {
      try {
        const res = await fetch(ocrJsonUrl);
        const data = await res.json();

        let items = [];

        // 🔹 1) 자동 OCR (한 줄 단위)
        let lines = [];
        let buf = "";
        let bufVertices = [];

        for (const page of data.pages || []) {
          for (const block of page.blocks || []) {
            for (const para of block.paragraphs || []) {
              for (const word of para.words || []) {
                for (const sym of word.symbols || []) {
                  buf += sym.text;
                  if (sym.boundingBox?.vertices)
                    bufVertices.push(...sym.boundingBox.vertices);

                  const br = sym.property?.detectedBreak;
                  if (br?.type === "LINE_BREAK") {
                    if (buf.trim()) {
                      lines.push({
                        text: buf.trim(),
                        vertices: [...bufVertices],
                      });
                    }
                    buf = "";
                    bufVertices = [];
                  }
                }
              }
            }
          }
        }

        // 마지막 라인 추가
        if (buf.trim()) {
          lines.push({
            text: buf.trim(),
            vertices: [...bufVertices],
          });
        }

        // boundingBox 만들기
        lines.forEach((line) => {
          const xs = line.vertices.map((v) => v.x);
          const ys = line.vertices.map((v) => v.y);

          items.push({
            text: line.text,
            source: "ocr",
            bbox: [
              { x: Math.min(...xs), y: Math.min(...ys) },
              { x: Math.max(...xs), y: Math.min(...ys) },
              { x: Math.max(...xs), y: Math.max(...ys) },
              { x: Math.min(...xs), y: Math.max(...ys) },
            ],
          });
        });

        // 🔹 2) manualTexts 추가 (드래그 추가)
        if (Array.isArray(data.manualTexts)) {
          data.manualTexts.forEach((m) => {
            items.push({
              text: m.text,
              bbox: m.bbox,
              source: "manual",
            });
          });
        }

        setOcrItems(items);
      } catch (err) {
        console.error("OCR JSON 파싱 실패:", err);
      }
    };

    load();
  }, [ocrJsonUrl]);

  // 🟦 드래그 후 API 호출
  const handleAddBox = async (bbox) => {
    try {
      const res = await fetch("http://3.238.171.96:5001/api/ocr/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: "test123",
          image_url: originalUrl,
          bbox,
        }),
      });

      if (!res.ok) {
        console.error("select 오류:", await res.text());
        return;
      }

      const result = await res.json();

      // 프런트에도 즉시 반영
      setOcrItems((prev) => [
        ...prev,
        {
          text: result.text,
          bbox: result.bbox,
          source: "manual",
        },
      ]);
    } catch (err) {
      console.error("select API 실패:", err);
    }
  };

  // 취소
  const handleCancel = () => {
    navigate("/inpaint", {
      state: { originalUrl, maskUrl, ocrJsonUrl },
    });
  };

  // 완료 → 다시 인페인팅
  const handleComplete = async () => {
    try {
      setIsLoading(true);

      const res = await fetch("http://3.238.171.96:5001/api/inpaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: originalUrl,
          mask_url: maskUrl,
        }),
      });

      if (!res.ok) {
        console.error("인페인팅 오류:", await res.text());
        return;
      }

      const data = await res.json();

      navigate("/inpaint", {
        state: {
          originalUrl,
          maskUrl,
          ocrJsonUrl,
          outputUrl: data.output_url,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-root">
      <div className="app-shell">
        <Header />
        <Tabs />

        <main className="edit-main">
          {/* LEFT */}
          <section className="edit-left-card">
            <div className="edit-left-inner">
              <div className="edit-canvas-wrapper">
                <CanvasArea
                  imageUrl={originalUrl}
                  ocrItems={ocrItems}
                  zoomScale={zoomScale}
                  isAdding={isAdding}
                  setIsAdding={setIsAdding}
                  onAddBox={handleAddBox}
                />

                <div className="edit-zoom-wrapper">
                  <ZoomControl zoomScale={zoomScale} setZoomScale={setZoomScale} />
                </div>
              </div>
            </div>

            <div className="edit-bottom-buttons">
              <Button
                onPress={handleCancel}
                style={{ backgroundColor: "#f2f2f2", color: "#000" }}
              >
                취소
              </Button>
              <Button onPress={handleComplete}>완료</Button>
            </div>
          </section>

          {/* RIGHT */}
          <section className="edit-right-card">
            <div className="edit-right-scroll">
              <TextList items={ocrItems} />
            </div>

            <div className="edit-add-button-wrapper">
              <Button onPress={() => setIsAdding(true)}>추가하기</Button>
            </div>
          </section>
        </main>
      </div>

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <p>인페인팅 중…</p>
        </div>
      )}
    </div>
  );
}

export default EditPage;
