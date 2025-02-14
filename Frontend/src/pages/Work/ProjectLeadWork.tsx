// 팀 리드(백엔드/프론트엔드)용 컴포넌트 
import { useState } from 'react';
import UserManage from './components/UserManage';
import JobManage from './components/JobManage';

function ProjectLeadWork() {
  const [activeTab, setActiveTab] = useState<'users' | 'jobs'>('users');

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'users' ? '#1a73e8' : '#f1f3f4',
            color: activeTab === 'users' ? 'white' : '#666',
            border: 'none',
            borderRadius: '8px 0 0 8px',
            cursor: 'pointer'
          }}
        >
          사용자 관리
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'jobs' ? '#1a73e8' : '#f1f3f4',
            color: activeTab === 'jobs' ? 'white' : '#666',
            border: 'none',
            borderRadius: '0 8px 8px 0',
            cursor: 'pointer'
          }}
        >
          업무 관리
        </button>
      </div>

      {activeTab === 'users' ? <UserManage /> : <JobManage />}
    </div>
  );
}

export default ProjectLeadWork; 