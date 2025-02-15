import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

type FileNode = {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
  isOpen?: boolean;
};

interface DirectoryProps {
  onFileSelect: (filePath: string) => void;
}

function Directory({ onFileSelect }: DirectoryProps) {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [accessibleFiles, setAccessibleFiles] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  // 정렬 함수 추가
  const sortFileTree = (nodes: FileNode[]): FileNode[] => {
    return nodes.sort((a, b) => {
      // 둘 다 디렉토리이거나 둘 다 파일인 경우 알파벳 순 정렬
      if (a.isDirectory === b.isDirectory) {
        return a.name.localeCompare(b.name);
      }
      // 디렉토리가 파일보다 먼저 오도록 정렬
      return a.isDirectory ? -1 : 1;
    }).map(node => {
      if (node.children) {
        return {
          ...node,
          children: sortFileTree(node.children)
        };
      }
      return node;
    });
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      fetchAccessibleFiles(user.userId, user.role);
    }
    fetchFileStructure();
  }, []);

  const fetchFileStructure = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/files');
      if (response.ok) {
        const data = await response.json();
        const processNodes = (nodes: FileNode[]): FileNode[] => {
          return sortFileTree(nodes.map(node => ({
            ...node,
            isOpen: false,
            isDirectory: node.isDirectory,
            children: node.children ? processNodes(node.children) : undefined
          })));
        };
        setFileTree(processNodes(data));
      }
    } catch (error) {
      console.error('Failed to fetch file structure:', error);
    }
  };

  const fetchAccessibleFiles = async (userId: string, userRole: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/file-permissions/accessible?userId=${userId}&userRole=${userRole}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch accessible files');
      }
      const text = await response.text();
      const data = text ? JSON.parse(text) : [];
      setAccessibleFiles(data);
    } catch (error) {
      console.error('Failed to fetch accessible files:', error);
      setAccessibleFiles([]);
    }
  };

  const hasAccessToFile = (path: string) => {
    // 경로 구분자 통일 (백슬래시를 슬래시로)
    const normalizedPath = path.replace(/\\/g, '/');
    
    if (!currentUser) {
      console.log('No current user');
      return false;
    }
    
    console.log('=== Access Check Debug ===');
    console.log('Original Path:', path);
    console.log('Normalized Path:', normalizedPath);
    console.log('User:', currentUser);
    console.log('Role:', currentUser.role);
    console.log('Accessible Files:', accessibleFiles);
    
    // 프로젝트 리드는 모든 파일에 접근 가능
    if (currentUser.role === 'PROJECT_LEAD') {
      console.log('Is Project Lead: true');
      return true;
    }
    
    // 프론트엔드 리드는 Frontend 폴더 내 파일만 접근 가능
    if (currentUser.role === 'FRONTEND_LEAD' && normalizedPath.startsWith('Frontend/')) {
      console.log('Is Frontend Lead with Frontend access: true');
      return true;
    }
    
    // 백엔드 리드는 Backend 폴더 내 파일만 접근 가능
    if (currentUser.role === 'BACKEND_LEAD' && 
        (normalizedPath.startsWith('Backend/') || normalizedPath.startsWith('DB/'))) {
      console.log('Is Backend Lead with DB/Backend access: true');
      return true;
    }
    
    // 일반 개발자는 할당된 업무의 파일만 접근 가능
    const hasAccess = accessibleFiles.some(filePath => {
      const normalizedFilePath = filePath.replace(/\\/g, '/');
      const isMatch = normalizedPath === normalizedFilePath;
      console.log(`Comparing ${normalizedPath} with ${normalizedFilePath}: ${isMatch}`);
      return isMatch;
    });
    
    console.log('Final access result:', hasAccess);
    return hasAccess;
  };

  const hasAccessToFolder = (node: FileNode): boolean => {
    if (node.isDirectory) {
      if (node.children) {
        // 폴더 내 모든 파일/폴더에 접근 가능한지 확인
        return node.children.some(child => 
          child.isDirectory ? hasAccessToFolder(child) : hasAccessToFile(child.path)
        );
      }
      return true;
    }
    return hasAccessToFile(node.path);
  };

  // 폴더 토글 함수
  const toggleFolder = (path: string) => {
    const updateNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.path === path) {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: updateNodes(node.children) };
        }
        return node;
      });
    };
    setFileTree(updateNodes(fileTree));
  };

  // 🌳 폴더 & 파일 트리 렌더링
  const renderTree = (nodes: FileNode[]) => {
    return (
      <ul style={{ listStyle: 'none', paddingLeft: '20px', margin: '5px 0' }}>
        {nodes.map((node) => (
          <li key={node.path} style={{ margin: '5px 0' }}>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                gap: '5px'
              }}
              onClick={() => {
                if (node.isDirectory) {
                  toggleFolder(node.path);
                } else {
                  if (hasAccessToFile(node.path)) {
                    onFileSelect(node.path);
                  } else {
                    alert('이 파일에 대한 접근 권한이 없습니다.');
                  }
                }
              }}
            >
              {node.isDirectory ? (
                <>
                  <span style={{ fontSize: '16px' }}>
                    {node.isOpen ? '📂' : '📁'}
                  </span>
                  <span style={{ fontWeight: 'bold' }}>{node.name}</span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '16px' }}>📄</span>
                  <span style={{ 
                    color: hasAccessToFile(node.path) ? '#0066cc' : 'red' 
                  }}>
                    {node.name}
                  </span>
                </>
              )}
            </div>
            {node.isDirectory && node.isOpen && node.children && renderTree(node.children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ 
      flex: "0 0 300px",
      borderRight: "1px solid #e0e0e0",
      height: "calc(100vh - 60px)", // TopBar 높이를 고려한 높이
      overflowY: "auto",
      backgroundColor: "#fafafa",
      padding: "20px"
    }}>
      {renderTree(fileTree)}
    </div>
  );
}

export default Directory;