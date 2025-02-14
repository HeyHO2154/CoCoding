import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  userId: string;
  name: string;
  role: string;
  createdAt: string;
  lastLogin: string;
}

const roleOptions = [
  'PROJECT_LEAD',
  'BACKEND_LEAD',
  'FRONTEND_LEAD',
  'BACKEND_DEVELOPER',
  'FRONTEND_DEVELOPER',
  'JUNIOR_DEVELOPER'
];

function UserManage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    userId: '',
    password: '',
    name: '',
    role: 'JUNIOR_DEVELOPER'
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      });
      
      if (response.ok) {
        alert('사용자가 추가되었습니다.');
        setShowAddUserModal(false);
        setNewUser({ userId: '', password: '', name: '', role: 'JUNIOR_DEVELOPER' });
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      alert('사용자 추가에 실패했습니다.');
    }
  };

  const handleUpdateUser = async (userId: string, updatedData: Partial<User>) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        alert('사용자 정보가 업데이트되었습니다.');
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('사용자 정보 업데이트에 실패했습니다.');
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
        <h2>사용자 관리</h2>
        <button
          onClick={() => setShowAddUserModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          새 사용자 추가
        </button>
      </div>

      {/* 사용자 목록 테이블 */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={tableHeaderStyle}>ID</th>
            <th style={tableHeaderStyle}>이름</th>
            <th style={tableHeaderStyle}>역할</th>
            <th style={tableHeaderStyle}>가입일</th>
            <th style={tableHeaderStyle}>최근 로그인</th>
            <th style={tableHeaderStyle}>작업</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userId} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tableCellStyle}>{user.userId}</td>
              <td style={tableCellStyle}>{user.name}</td>
              <td style={tableCellStyle}>
                <select
                  value={user.role}
                  onChange={(e) => handleUpdateUser(user.userId, { role: e.target.value })}
                  style={{
                    padding: '5px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                >
                  {roleOptions.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </td>
              <td style={tableCellStyle}>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td style={tableCellStyle}>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '-'}</td>
              <td style={tableCellStyle}>
                <button
                  onClick={() => handleUpdateUser(user.userId, { role: user.role })}
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 새 사용자 추가 모달 */}
      {showAddUserModal && (
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
            <h3>새 사용자 추가</h3>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="아이디"
                value={newUser.userId}
                onChange={(e) => setNewUser({...newUser, userId: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="password"
                placeholder="비밀번호"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="이름"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                style={inputStyle}
              >
                {roleOptions.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowAddUserModal(false)}
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
                onClick={handleAddUser}
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

export default UserManage;
