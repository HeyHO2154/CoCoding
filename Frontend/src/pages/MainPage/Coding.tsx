import { useState, useEffect } from "react";
import Directory from "./components/Directory";
import { useLocation } from "react-router-dom";

// 📂 폴더 & 파일 타입 정의
function Coding() {
  const location = useLocation();
  const filePath = location.state?.filePath;
  const [, setCurrentUser] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [, setFileContent] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      checkFileAccess(user.userId, user.role, filePath);
    }
  }, [filePath]);

  const checkFileAccess = async (userId: string, userRole: string, path: string | null) => {
    // path가 없으면 early return
    if (!path) {
      setHasAccess(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/file-permissions/accessible?userId=${userId}&userRole=${userRole}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch accessible files');
      }
      const accessibleFiles = await response.json();
      console.log('Path to check:', path);
      console.log('Accessible files:', accessibleFiles);
      
      const hasAccess = accessibleFiles.includes(path) || 
                       userRole === 'PROJECT_LEAD' ||
                       (userRole === 'FRONTEND_LEAD' && path.startsWith('Frontend/')) ||
                       (userRole === 'BACKEND_LEAD' && path.startsWith('Backend/'));
      setHasAccess(hasAccess);
    } catch (error) {
      console.error('Failed to check file access:', error);
      setHasAccess(false);
    }
  };

  // 📄 파일 클릭 시 내용 불러오기
  const openFile = (filePath: string) => {
    if (!hasAccess) {
      alert('이 파일에 대한 접근 권한이 없습니다.');
      return;
    }

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

  // 파일 내용 표시 컴포넌트
  const FileContent = () => {
    if (!selectedFile) return null;
    
    if (!hasAccess) {
      return (
        <div style={{ 
          flex: 1, 
          padding: "20px",
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          color: 'red',
          fontSize: '1.2em'
        }}>
          이 파일에 대한 접근 권한이 없습니다.
        </div>
      );
    }

    return (
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
    );
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <Directory onFileSelect={openFile} />
        <FileContent />
      </div>
    </div>
  );
}

export default Coding;
