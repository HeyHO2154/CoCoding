import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';  // react-icons 설치 필요

interface User {
  userId: string;
  name: string;
  role: string;
}

// role 한글 변환을 위한 매핑
const roleToKorean: { [key: string]: string } = {
  'PROJECT_LEAD': '프로젝트 리드',
  'BACKEND_LEAD': '백엔드 리드',  
  'FRONTEND_LEAD': '프론트엔드 리드',
  'BACKEND_DEVELOPER': '백엔드 개발자',
  'FRONTEND_DEVELOPER': '프론트엔드 개발자',
  'JUNIOR_DEVELOPER': '주니어 개발자'
};

// role별 배경색 매핑
const roleBadgeColors: { [key: string]: { bg: string; text: string } } = {
  'PROJECT_LEAD': { bg: '#e30e0e', text: 'white' },        // 빨강색
  'FRONTEND_LEAD': { bg: '#1976D2', text: 'white' },       // 진한 파랑
  'BACKEND_LEAD': { bg: '#2E7D32', text: 'white' },        // 진한 녹색
  'FRONTEND_DEVELOPER': { bg: '#90CAF9', text: 'black' },  // 연한 파랑
  'BACKEND_DEVELOPER': { bg: '#A5D6A7', text: 'black' },   // 연한 녹색
  'JUNIOR_DEVELOPER': { bg: '#FFD700', text: 'black' }     // 노란색
};

// 스타일 객체
const styles = {
  logoutButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    color: '#666',
    border: '1px solid #ddd',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#f44336',
      color: 'white',
      border: '1px solid #f44336'
    }
  } as React.CSSProperties,
  // hover 스타일을 위한 CSS-in-JS
  '@global': {
    '.logout-button:hover': {
      backgroundColor: '#f44336 !important',
      color: 'white !important',
      border: '1px solid #f44336 !important'
    }
  }
};

// 네비게이션 버튼 스타일
const navButtonStyle = (isActive: boolean): React.CSSProperties => ({
  padding: '10px 25px',
  backgroundColor: isActive ? '#ffffff' : 'transparent',
  color: isActive ? '#1a73e8' : '#666',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: isActive ? '600' : '500',
  fontSize: '1rem',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  boxShadow: isActive ? '0 2px 8px rgba(26, 115, 232, 0.15)' : 'none',

});

function TopBar() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <h1 style={{ margin: 0, cursor: 'pointer' }} onClick={() => navigate('/')}>
          💻 CoCoding
        </h1>
        {user && (
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            backgroundColor: '#f1f3f4',
            padding: '5px',
            borderRadius: '16px'
          }}>
            <button
              onClick={() => navigate('/')}
              style={navButtonStyle(location.pathname === '/')}
            >
              <span role="img" aria-label="project">💻</span>
              프로젝트
            </button>
            <button
              onClick={() => navigate('/work')}
              style={navButtonStyle(location.pathname === '/work')}
            >
              <span role="img" aria-label="task">📋</span>
              업무관리
            </button>
            <button
              onClick={() => alert('준비 중입니다.')}
              style={navButtonStyle(false)}
            >
              <span role="img" aria-label="status">📊</span>
              업무현황
            </button>
            <button
              onClick={() => alert('준비 중입니다.')}
              style={navButtonStyle(false)}
            >
              <span role="img" aria-label="profile">👤</span>
              내 정보
            </button>
          </div>
        )}
      </div>
      <div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {user.role && (
                <span style={{
                  padding: '6px 10px',
                  borderRadius: '10px',
                  fontSize: '1em',
                  backgroundColor: roleBadgeColors[user.role]?.bg || '#gray',
                  color: roleBadgeColors[user.role]?.text || 'black',
                  fontWeight: '500',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {roleToKorean[user.role]}
                </span>
              )}
              <span style={{ fontWeight: '500' }}>{user.name}님 환영합니다,</span>  
            </div>
            <button
              onClick={handleLogout}
              className="logout-button"
              style={styles.logoutButton}
            >
              <FiLogOut size={20} />
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
