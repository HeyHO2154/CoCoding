import { useState, useEffect } from 'react';

interface Job {
  jobId: number;
  jobName: string;
  description: string;
  status: string;
  assignedTo: string | null;
  createdBy: string;
  createdAt: string;
}

interface User {
  userId: string;
  name: string;
  role: string;
}

const roleToKorean: { [key: string]: string } = {
  'PROJECT_LEAD': '프로젝트 리드',
  'BACKEND_LEAD': '백엔드 리드',
  'FRONTEND_LEAD': '프론트엔드 리드',
  'BACKEND_DEVELOPER': '백엔드 개발자',
  'FRONTEND_DEVELOPER': '프론트엔드 개발자',
  'JUNIOR_DEVELOPER': '주니어 개발자'
};

function JobAssign() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchJobs();
    fetchUsers();
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
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

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleAssign = async (jobId: number, userId: string) => {
    if (!currentUser) return;
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:8080/api/jobs/${jobId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          assignedBy: currentUser.userId
        })
      });
      
      if (!response.ok) {
        throw new Error('업무 배정에 실패했습니다.');
      }

      const data = await response.json();
      console.log('Assignment response:', data);

      alert('업무가 배정되었습니다.');
      fetchJobs();
    } catch (error) {
      console.error('Failed to assign job:', error);
      alert('업무 배정에 실패했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>업무 배정</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={tableHeaderStyle}>업무명</th>
            <th style={tableHeaderStyle}>설명</th>
            <th style={tableHeaderStyle}>현재 담당자</th>
            <th style={tableHeaderStyle}>배정</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.jobId} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tableCellStyle}>{job.jobName}</td>
              <td style={tableCellStyle}>{job.description}</td>
              <td style={tableCellStyle}>{job.assignedTo || '-'}</td>
              <td style={tableCellStyle}>
                <select
                  onChange={(e) => handleAssign(job.jobId, e.target.value)}
                  value=""
                  style={{
                    padding: '5px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                >
                  <option value="">담당자 선택</option>
                  {users.map(user => (
                    <option key={user.userId} value={user.userId}>
                      {user.name} ({roleToKorean[user.role]})
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default JobAssign;
