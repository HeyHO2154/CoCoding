import { useState, useEffect } from "react";

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

  useEffect(() => {
    fetch("http://localhost:8080/api/files")
      .then((res) => res.json())
      .then((data: FileNode[]) => {
        const processNodes = (nodes: FileNode[]): FileNode[] => {
          return nodes.map(node => ({
            ...node,
            isOpen: false,
            children: node.children ? processNodes(node.children) : undefined
          }));
        };
        setFileTree(processNodes(data));
      })
      .catch((err) => console.error("Error loading file tree:", err));
  }, []);

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
              onClick={() => node.isDirectory ? toggleFolder(node.path) : onFileSelect(node.path)}
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
                  <span style={{ color: '#0066cc' }}>{node.name}</span>
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