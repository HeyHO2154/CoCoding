import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  userId: string;
  name: string;
  rank: string;
}

function TopBar() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div style={{ 
      padding: "10px 20px",
      borderBottom: "1px solid #eaeaea",
      backgroundColor: "#f8f9fa",
      position: "sticky",
      top: 0,
      width: "100%",
      zIndex: 1000,
      boxSizing: "border-box",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h1 style={{ margin: 0 }}>📂 프로젝트 협업 코딩 툴</h1>
      <div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>{user.name}님 환영합니다</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            로그인
          </button>
        )}
      </div>
    </div>
  );
}

export default TopBar;
