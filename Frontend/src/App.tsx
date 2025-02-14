import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TopBar from './components/TopBar';
import Login from "./pages/Login/Login";
import Coding from "./pages/MainPage/Coding";
import Work from './pages/Work/Work';

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
        <Route element={
          <ProtectedRoute>
            <>
              <TopBar />
              <div style={{ height: 'calc(100vh - 60px)' }}>
                <Routes>
                  <Route path="/" element={<Coding />} />
                  <Route path="/work" element={<Work />} />
                </Routes>
              </div>
            </>
          </ProtectedRoute>
        }>
          <Route path="/" element={<Coding />} />
          <Route path="/work" element={<Work />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
