import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage/Coding";
import Login from "./pages/Login/Login";

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
        <Route path="/" element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
