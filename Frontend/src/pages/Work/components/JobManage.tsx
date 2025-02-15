import { useState, useEffect } from 'react';

interface Job {
  jobId: number;
  jobName: string;
  description: string;
  createdAt: string;
  createdBy: string;
  status: string;
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

  useEffect(() => {
    fetchJobs();
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setNewJob(prev => ({...prev, createdBy: user.userId}));
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
        alert('업무가 추가되었습니다.');
        setShowAddJobModal(false);
        setNewJob({
          jobName: '',
          description: '',
          status: 'ACTIVE',
          createdBy: newJob.createdBy
        });
        fetchJobs();
      }
    } catch (error) {
      console.error('Failed to add job:', error);
      alert('업무 추가에 실패했습니다.');
    }
  };

  const handleUpdateJob = (job: Job) => {
    setEditingJob(job);
    setShowEditJobModal(true);
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
        alert('업무가 수정되었습니다.');
        setShowEditJobModal(false);
        setEditingJob(null);
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
          onClick={() => setShowAddJobModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          새 업무 추가
        </button>
      </div>

      {/* 업무 목록 테이블 */}
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
                  onClick={() => handleUpdateJob(job)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '5px'
                  }}
                >
                  수정
                </button>
                <button
                  onClick={() => handleDeleteJob(job.jobId)}
                  style={{
                    padding: '5px 10px',
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
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px'
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
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px'
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
