// 팀 리드(백엔드/프론트엔드)용 컴포넌트 
import { useState } from 'react';
import JobAssign from './components/JobAssign';
import JobManage from './components/JobManage';
import UserManage from './components/UserManage';

function ProjectLeadWork() {
  const [activeTab, setActiveTab] = useState<'userManage' | 'jobManage' | 'jobAssign'>('userManage');

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('userManage')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'userManage' ? '#1a73e8' : '#f1f3f4',
            color: activeTab === 'userManage' ? 'white' : '#666',
            border: 'none',
            borderRadius: '8px 0 0 8px',
            cursor: 'pointer'
          }}
        >
          사용자 관리
        </button>
        <button
          onClick={() => setActiveTab('jobManage')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'jobManage' ? '#1a73e8' : '#f1f3f4',
            color: activeTab === 'jobManage' ? 'white' : '#666',
            border: 'none',
            borderRadius: '0',
            cursor: 'pointer'
          }}
        >
          업무 관리
        </button>
        <button
          onClick={() => setActiveTab('jobAssign')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'jobAssign' ? '#1a73e8' : '#f1f3f4',
            color: activeTab === 'jobAssign' ? 'white' : '#666',
            border: 'none',
            borderRadius: '0 8px 8px 0',
            cursor: 'pointer'
          }}
        >
          업무 배정
        </button>
      </div>

      {activeTab === 'userManage' && <UserManage />}
      {activeTab === 'jobManage' && <JobManage />}
      {activeTab === 'jobAssign' && <JobAssign />}
    </div>
  );
}

export default ProjectLeadWork; 