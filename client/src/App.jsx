import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('memorize_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('memorize_theme', theme);
  }, [theme]);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <NavLink to="/" className="nav-brand" onClick={closeMenu}>
          <i className="ph ph-brain"></i>
          MemoRize
        </NavLink>

        <div className="mobile-header-actions">
          <button
            className="theme-toggle-btn mobile-theme-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label="Toggle theme"
          >
            <i className={`ph ${theme === 'light' ? 'ph-moon' : 'ph-sun'}`}></i>
          </button>

          <button
            className="mobile-hamburger-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <i className={`ph ${menuOpen ? 'ph-x' : 'ph-list'}`}></i>
          </button>
        </div>

        <div className={`nav-right ${menuOpen ? 'mobile-menu-open' : ''}`}>
          <div className="nav-links">
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="ph ph-play-circle" style={{ marginRight: 4 }}></i>
              Practice
            </NavLink>
            {user && (
              <NavLink
                to="/history"
                onClick={closeMenu}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <i className="ph ph-clock-counter-clockwise" style={{ marginRight: 4 }}></i>
                History
              </NavLink>
            )}
          </div>

          <div className="nav-auth-section">
            {user ? (
              <div className="user-nav-badge">
                <span className="user-name">
                  <i className="ph ph-user"></i>
                  {user.name}
                </span>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="nav-btn-logout"
                  title="Sign Out"
                >
                  <i className="ph ph-sign-out"></i>
                  <span className="mobile-logout-text">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="auth-nav-buttons">
                <NavLink to="/login" onClick={closeMenu} className="nav-link">
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={closeMenu}
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.8125rem' }}
                >
                  Sign Up
                </NavLink>
              </div>
            )}

            <button
              className="theme-toggle-btn desktop-theme-btn"
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
