import { useState } from "react";
import Directory from "./components/Directory";

// 📂 폴더 & 파일 타입 정의
function Coding() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [, setFileContent] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");

  // 📄 파일 클릭 시 내용 불러오기
  const openFile = (filePath: string) => {
    console.log("📁 파일 클릭됨:", filePath);
    setSelectedFile(filePath);
    
    fetch(`http://localhost:8080/api/file?path=${encodeURIComponent(filePath)}`)
      .then((res) => {
        console.log("서버 응답 상태:", res.status);
        if (!res.ok) {
          throw new Error(`파일을 불러오는데 실패했습니다. 상태 코드: ${res.status}`);
        }
        return res.text();
      })
      .then((data: string) => {
        console.log("📄 파일 내용:", data.substring(0, 100) + "...");
        setFileContent(data);
        setNewContent(data);
      })
      .catch((err) => {
        console.error("Error loading file:", err);
        alert("파일을 불러오는데 실패했습니다: " + err.message);
      });
  };

  // 📝 파일 수정 요청
  const saveFile = () => {
    if (!selectedFile) return;

    fetch(`http://localhost:8080/api/file?path=${encodeURIComponent(selectedFile)}`, {
      method: "PUT",
      headers: { "Content-Type": "text/plain" },
      body: newContent,
    })
      .then((res) => res.text())
      .then((message: string) => {
        alert(message);
        setFileContent(newContent);
      })
      .catch((err) => console.error("Error updating file:", err));
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <Directory onFileSelect={openFile} />
        
        {selectedFile && (
          <div style={{ flex: 1, padding: "20px" }}>
            <h2>📄 {selectedFile}</h2>
            <textarea
              style={{ width: "100%", minHeight: "400px" }}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <br />
            <button 
              onClick={saveFile} 
              style={{ 
                marginTop: "10px", 
                padding: "8px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              저장
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Coding;
