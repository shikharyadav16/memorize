import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainPage from './pages/MainPage';
import EvaluationPage from './pages/EvaluationPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HistoryPage from './pages/HistoryPage';
import './App.css';

function Navbar() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('memorize_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('memorize_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <NavLink to="/" className="nav-brand">
          <i className="ph ph-brain"></i>
          MemoRize
        </NavLink>
        <div className="nav-right">
          <div className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="ph ph-play-circle" style={{ marginRight: 4 }}></i>
              Practice
            </NavLink>
            {user && (
              <NavLink
                to="/history"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <i className="ph ph-clock-counter-clockwise" style={{ marginRight: 4 }}></i>
                History
              </NavLink>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {user ? (
              <div className="user-nav-badge">
                <span className="user-name">
                  <i className="ph ph-user"></i>
                  {user.name}
                </span>
                <button onClick={logout} className="nav-btn-logout" title="Sign Out">
                  <i className="ph ph-sign-out"></i>
                </button>
              </div>
            ) : (
              <div className="auth-nav-buttons">
                <NavLink to="/login" className="nav-link">
                  Sign In
                </NavLink>
                <NavLink to="/signup" className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8125rem' }}>
                  Sign Up
                </NavLink>
              </div>
            )}

            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              aria-label="Toggle theme"
            >
              <i className={`ph ${theme === 'light' ? 'ph-moon' : 'ph-sun'}`}></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/evaluation" element={<EvaluationPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
