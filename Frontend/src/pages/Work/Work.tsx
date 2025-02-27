import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectLeadWork from './ProjectLeadWork';
import TeamLeadWork from './TeamLeadWork';
import DeveloperWork from './DeveloperWork';

function Work() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [navigate, user]);

  if (!user) return null;

  // 역할에 따라 다른 컴포넌트 렌더링
  switch (user.role) {
    case 'PROJECT_LEAD':
      return <ProjectLeadWork />;
    case 'BACKEND_LEAD':
    case 'FRONTEND_LEAD':
      return <TeamLeadWork />;
    case 'BACKEND_DEVELOPER':
    case 'FRONTEND_DEVELOPER':
    case 'JUNIOR_DEVELOPER':
      return <DeveloperWork />;
    default:
      return <div>Invalid role</div>;
  }
}

export default Work;
