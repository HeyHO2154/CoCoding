import { useState } from 'react';
import JobAssign from './components/JobAssign';
import JobManage from './components/JobManage';
import UserManage from './components/UserManage';

function TeamLeadWork() {
  const [activeTab, setActiveTab] = useState<'jobManage' | 'jobAssign' | 'userManage'>('jobManage');

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('jobManage')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'jobManage' ? '#1a73e8' : '#f1f3f4',
            color: activeTab === 'jobManage' ? 'white' : '#666',
            border: 'none',
            borderRadius: '8px 0 0 8px',
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
            borderRadius: '0',
            cursor: 'pointer'
          }}
        >
          업무 배정
        </button>
        <button
          onClick={() => setActiveTab('userManage')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'userManage' ? '#1a73e8' : '#f1f3f4',
            color: activeTab === 'userManage' ? 'white' : '#666',
            border: 'none',
            borderRadius: '0 8px 8px 0',
            cursor: 'pointer'
          }}
        >
          사용자 관리
        </button>
      </div>

      {activeTab === 'jobManage' && <JobManage />}
      {activeTab === 'jobAssign' && <JobAssign />}
      {activeTab === 'userManage' && <UserManage />}
    </div>
  );
}

export default TeamLeadWork; 