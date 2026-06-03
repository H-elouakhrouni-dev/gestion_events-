import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Evenements from './pages/Evenements';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import './index.css';

function AppShell() {
  const [notification, setNotification] = useState(null);
  const { loading } = useAuth();

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  if (loading) {
    return (
      <div className="spinner-container app-loading">
        <div className="spinner" />
        <span className="spinner-text">Chargement de l&apos;application...</span>
      </div>
    );
  }

  return (
    <Router>
      <Navbar onLogout={() => notify('Déconnexion réussie.')} />

      <main className="page-container">
        <Routes>
          <Route path="/login" element={<Login notify={notify} />} />
          <Route path="/register" element={<Register notify={notify} />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Evenements notify={notify} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <Dashboard notify={notify} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {notification && (
        <div
          className={`notification notification-${notification.type === 'error' ? 'error' : 'success'}`}
          role="status"
        >
          <span className="notification-icon">{notification.type === 'success' ? '✓' : '✕'}</span>
          {notification.message}
        </div>
      )}
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
