import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import StudyPage from './pages/StudyPage';
import AdminPage from './pages/AdminPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  return isAdmin ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <StudyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
