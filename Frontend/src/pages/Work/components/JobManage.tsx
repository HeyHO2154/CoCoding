import { useState, useEffect } from 'react';

interface Job {
  jobId: number;
  jobName: string;
  description: string;
  status: string;
  createdBy: string;
  createdAt: string;
}

interface FileNode {
  path: string;
  name: string;
  directory: boolean;
  children?: FileNode[];
}

// 상태 매핑 객체 추가
const statusToKorean: { [key: string]: string } = {
  'ACTIVE': '진행중',
  'COMPLETED': '완료',
  'ARCHIVED': '보관됨'
};

function JobManage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    jobName: '',
    description: '',
    status: 'ACTIVE',
    createdBy: ''
  });
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentJob, setCurrentJob] = useState<Partial<Job>>({});
  const [fileStructure, setFileStructure] = useState<FileNode[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchJobs();
    fetchFileStructure();
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setNewJob(prev => ({...prev, createdBy: user.userId}));
      setCurrentUser(user);
    }
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const fetchFileStructure = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/files/structure');
      if (response.ok) {
        const data = await response.json();
        setFileStructure(data);
      }
    } catch (error) {
      console.error('Failed to fetch file structure:', error);
    }
  };

  const handleOpenCreateModal = () => {
    setShowAddJobModal(true);
    setSelectedFiles([]);
    setExpandedFolders(new Set());
  };

  const handleEditClick = async (job: Job) => {
    try {
      const response = await fetch(`http://localhost:8080/api/file-permissions/job/${job.jobId}`);
      if (response.ok) {
        const permissions = await response.json();
        setSelectedFiles(permissions.map((p: any) => p.filePath));
      }
      setCurrentJob(job);
      setOpenDialog(true);
    } catch (error) {
      console.error('Failed to fetch file permissions:', error);
    }
  };

  const handleUpdateJob = async () => {
    if (!currentJob.jobId) return;

    try {
      // 1. 작업 정보 업데이트
      const response = await fetch(`http://localhost:8080/api/jobs/${currentJob.jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentJob)
      });

      if (response.ok) {
        // 2. 선택된 파일 권한들만 한번에 전송
        await fetch(`http://localhost:8080/api/file-permissions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            selectedFiles.map(filePath => ({
              jobId: currentJob.jobId,
              filePath,
              createdBy: currentUser?.userId
            }))
          )
        });

        alert('업무가 수정되었습니다.');
        setOpenDialog(false);
        setCurrentJob({});
        setSelectedFiles([]);
        fetchJobs();
      }
    } catch (error) {
      console.error('Failed to update job:', error);
      alert('업무 수정에 실패했습니다.');
    }
  };

  const handleAddJob = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJob)
      });
      
      if (response.ok) {
        const createdJob = await response.json();
        
        // 파일 권한 저장 시 벌크 API 사용
        await fetch('http://localhost:8080/api/file-permissions/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            selectedFiles.map(filePath => ({
              jobId: createdJob.jobId,
              filePath,
              createdBy: currentUser?.userId
            }))
          )
        });

        alert('업무가 추가되었습니다.');
        setShowAddJobModal(false);
        setNewJob({
          jobName: '',
          description: '',
          status: 'ACTIVE',
          createdBy: newJob.createdBy
        });
        setSelectedFiles([]);
        fetchJobs();
      }
    } catch (error) {
      console.error('Failed to add job:', error);
      alert('업무 추가에 실패했습니다.');
    }
  };

  const handleEditSubmit = async () => {
    if (!editingJob) return;

    try {
      const response = await fetch(`http://localhost:8080/api/jobs/${editingJob.jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingJob)
      });
      
      if (response.ok) {
        await fetch(`http://localhost:8080/api/file-permissions/job/${editingJob.jobId}`, {
          method: 'DELETE'
        });

        await Promise.all(selectedFiles.map(filePath => 
          fetch('http://localhost:8080/api/file-permissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jobId: editingJob.jobId,
              filePath,
              createdBy: currentUser?.userId
            })
          })
        ));

        alert('업무가 수정되었습니다.');
        setShowEditJobModal(false);
        setEditingJob(null);
        setSelectedFiles([]);
        fetchJobs();
      }
    } catch (error) {
      console.error('Failed to update job:', error);
      alert('업무 수정에 실패했습니다.');
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/jobs/${jobId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('업무가 삭제되었습니다.');
        fetchJobs();
      }
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('업무 삭제에 실패했습니다.');
    }
  };

  const handleCreateJob = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...currentJob,
          createdBy: currentUser?.userId,
          status: 'ACTIVE'
        })
      });

      if (!response.ok) throw new Error('Failed to create job');
      
      const newJob = await response.json();
      
      // 파일 권한 벌크 저장
      await fetch('http://localhost:8080/api/file-permissions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          selectedFiles.map(filePath => ({
            jobId: newJob.jobId,
            filePath,
            createdBy: currentUser?.userId
          }))
        )
      });

      setOpenDialog(false);
      setCurrentJob({});
      setSelectedFiles([]);
      fetchJobs();
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  // 폴더의 모든 하위 경로를 가져오는 함수
  const getAllPathsUnderDirectory = (node: FileNode): string[] => {
    let paths: string[] = [node.path];
    if (node.children) {
      node.children.forEach(child => {
        paths = paths.concat(getAllPathsUnderDirectory(child));
      });
    }
    return paths;
  };

  // 파일 선택 처리 함수 수정
  const handleFileSelect = (node: FileNode, isSelected: boolean) => {
    if (node.directory) {
      // 폴더인 경우 하위 모든 파일/폴더에 대해 동일하게 적용
      const allPaths = getAllPathsUnderDirectory(node);
      setSelectedFiles(prev => {
        if (isSelected) {
          // 선택된 경우 기존 선택에 새로운 경로들 추가
          return [...new Set([...prev, ...allPaths])];
        } else {
          // 선택 해제된 경우 해당 경로들 제거
          return prev.filter(path => !allPaths.includes(path));
        }
      });
    } else {
      // 단일 파일인 경우
      setSelectedFiles(prev => {
        if (isSelected) {
          return [...prev, node.path];
        } else {
          return prev.filter(path => path !== node.path);
        }
      });
    }
  };

  const isFileSelected = (path: string) => {
    return selectedFiles.includes(path);
  };

  const handleFolderToggle = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const FileSelector = ({ node, level = 0 }: { node: FileNode; level?: number }) => {
    const isSelected = isFileSelected(node.path);
    
    // 폴더의 경우 모든 하위 항목이 선택되었는지 확인
    const isAllChildrenSelected = node.directory && node.children ? 
      node.children.every(child => {
        if (child.directory) {
          return getAllPathsUnderDirectory(child).every(path => selectedFiles.includes(path));
        }
        return selectedFiles.includes(child.path);
      }) : isSelected;

    return (
      <div style={{ marginLeft: `${level * 20}px` }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          padding: '4px 0'
        }}>
          {node.directory && (
            <span 
              onClick={() => handleFolderToggle(node.path)}
              style={{ 
                marginRight: '5px',
                cursor: 'pointer',
                width: '20px'
              }}
            >
              {expandedFolders.has(node.path) ? '▼' : '▶'}
            </span>
          )}
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isAllChildrenSelected}
              onChange={(e) => handleFileSelect(node, e.target.checked)}
            />
            {node.directory ? '📁' : '📄'} {node.name}
          </label>
        </div>
        {node.directory && expandedFolders.has(node.path) && node.children && (
          <div style={{ marginLeft: '20px' }}>
            {node.children.map(child => (
              <FileSelector key={child.path} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px' 
      }}>
        <h2>업무 관리</h2>
        <button
          onClick={handleOpenCreateModal}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          업무 생성
        </button>
      </div>

      {/* 업무 목록 테이블 - 원래 디자인으로 복구 */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={tableHeaderStyle}>업무명</th>
            <th style={tableHeaderStyle}>설명</th>
            <th style={tableHeaderStyle}>상태</th>
            <th style={tableHeaderStyle}>생성자</th>
            <th style={tableHeaderStyle}>생성일</th>
            <th style={tableHeaderStyle}>작업</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.jobId} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tableCellStyle}>{job.jobName}</td>
              <td style={tableCellStyle}>{job.description}</td>
              <td style={tableCellStyle}>{statusToKorean[job.status]}</td>
              <td style={tableCellStyle}>{job.createdBy}</td>
              <td style={tableCellStyle}>{new Date(job.createdAt).toLocaleDateString()}</td>
              <td style={tableCellStyle}>
                <button
                  onClick={() => handleEditClick(job)}
                  style={{
                    marginRight: '8px',
                    padding: '4px 8px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  수정
                </button>
                <button
                  onClick={() => handleDeleteJob(job.jobId)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 새 업무 추가 모달 */}
      {showAddJobModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '800px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3>새 업무 추가</h3>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="업무명"
                value={newJob.jobName}
                onChange={(e) => setNewJob({...newJob, jobName: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <textarea
                placeholder="업무 설명"
                value={newJob.description}
                onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                style={{...inputStyle, height: '100px'}}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <h4>파일 권한 설정</h4>
              <div style={{ 
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '10px',
                maxHeight: '400px',
                overflow: 'auto',
                backgroundColor: '#f8f9fa'
              }}>
                {fileStructure.map(node => (
                  <FileSelector key={node.path} node={node} />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowAddJobModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ddd',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
              <button
                onClick={handleAddJob}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1a73e8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 업무 수정 모달 */}
      {showEditJobModal && editingJob && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '800px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3>업무 수정</h3>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="업무명"
                value={editingJob.jobName}
                onChange={(e) => setEditingJob({...editingJob, jobName: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <textarea
                placeholder="업무 설명"
                value={editingJob.description}
                onChange={(e) => setEditingJob({...editingJob, description: e.target.value})}
                style={{...inputStyle, height: '100px'}}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <select
                value={editingJob.status}
                onChange={(e) => setEditingJob({...editingJob, status: e.target.value})}
                style={inputStyle}
              >
                <option value="ACTIVE">진행중</option>
                <option value="COMPLETED">완료</option>
                <option value="ARCHIVED">보관됨</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <h4>파일 권한 설정</h4>
              <div style={{ 
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '10px',
                maxHeight: '400px',
                overflow: 'auto',
                backgroundColor: '#f8f9fa'
              }}>
                {fileStructure.map(node => (
                  <FileSelector key={node.path} node={node} />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowEditJobModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ddd',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
              <button
                onClick={handleEditSubmit}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1a73e8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Material-UI Dialog를 일반 모달로 변경 */}
      {openDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '600px'
          }}>
            <h3>업무 생성</h3>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="업무명"
                value={currentJob.jobName || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, jobName: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <textarea
                placeholder="설명"
                value={currentJob.description || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, description: e.target.value })}
                style={{...inputStyle, height: '100px'}}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <h4>파일 권한 설정</h4>
              <div style={{ 
                maxHeight: '300px', 
                overflow: 'auto', 
                border: '1px solid #ddd', 
                padding: '10px',
                borderRadius: '4px'
              }}>
                {fileStructure.map(node => (
                  <FileSelector key={node.path} node={node} />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => setOpenDialog(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ddd',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
              <button
                onClick={handleCreateJob}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1a73e8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '2px solid #ddd'
};

const tableCellStyle: React.CSSProperties = {
  padding: '12px',
  textAlign: 'left'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  boxSizing: 'border-box'
};

export default JobManage;
