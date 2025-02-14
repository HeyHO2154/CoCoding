import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TopBar from './components/TopBar';
import Login from "./pages/Login/Login";
import Coding from "./pages/MainPage/Coding";
import Work from './pages/Work/Work';
import Status from './pages/Status/Status';
import MyPage from './pages/Login/MyPage';

// 로그인 상태 체크를 위한 Protected Route 컴포넌트
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('user') !== null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <>
              <TopBar />
              <div style={{ height: 'calc(100vh - 60px)' }}>
                <Routes>
                  <Route path="/" element={<Coding />} />
                  <Route path="/work/*" element={<Work />} />
                  <Route path="/status" element={<Status />} />
                  <Route path="/mypage" element={<MyPage />} />
                </Routes>
              </div>
            </>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
