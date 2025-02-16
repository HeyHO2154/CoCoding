import { useState, useEffect } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { EditorView } from '@codemirror/view';
import Directory from "./components/Directory";
import { useLocation } from "react-router-dom";

// 📂 폴더 & 파일 타입 정의
function Coding() {
  const location = useLocation();
  const filePath = location.state?.filePath;
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      checkFileAccess(user.userId, user.role, filePath);
    }
  }, [filePath]);

  const checkFileAccess = async (userId: string, userRole: string, path: string | null) => {
    // 임시로 모든 파일에 접근 가능하도록 설정
    setHasAccess(true);
  };

  // 📄 파일 클릭 시 내용 불러오기
  const openFile = (filePath: string) => {
    // 권한 체크 제거
    console.log("📁 파일 클릭됨:", filePath);
    setSelectedFile(filePath);
    
    fetch(`http://localhost:8080/api/file?path=${encodeURIComponent(filePath)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`파일을 불러오는데 실패했습니다. 상태 코드: ${res.status}`);
        }
        return res.text();
      })
      .then((data: string) => {
        setFileContent(data);
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
      body: fileContent,
    })
      .then((res) => res.text())
      .then((message: string) => {
        alert(message);
      })
      .catch((err) => console.error("Error updating file:", err));
  };

  const getLanguageExtension = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return javascript();
      case 'java':
        return java();
      default:
        return javascript();
    }
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2>📄 {selectedFile}</h2>
          <button onClick={saveFile} style={{ 
            padding: "8px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
            저장
          </button>
        </div>
        <div style={{ 
          border: '1px solid #ddd',
          borderRadius: '4px',
          height: 'calc(100vh - 200px)',
          overflow: 'hidden'
        }}>
          <CodeMirror
            value={fileContent}
            height="100%"
            theme="dark"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightActiveLine: true,
              foldGutter: true,
              autocompletion: true,
              closeBrackets: true,
              indentOnInput: true
            }}
            extensions={[
              getLanguageExtension(selectedFile),
              EditorView.lineWrapping
            ]}
            onChange={(value) => setFileContent(value)}
          />
        </div>
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
