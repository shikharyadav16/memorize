import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5000/api';

export default function AdminPage() {
  const { user, token, adminLogin } = useAuth();
  const [passages, setPassages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  // Admin login form state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const fetchPassages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/passages`);
      if (!res.ok) throw new Error('Failed to fetch passages');
      const data = await res.json();
      setPassages(data);
    } catch (err) {
      showToast('Error loading passages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      fetchPassages();
    }
  }, [user]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');
    setLoggingIn(true);
    try {
      await adminLogin(adminEmail, adminPassword);
    } catch (err) {
      setAdminError(err.message);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/passages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!res.ok) throw new Error('Failed to save');

      const newPassage = await res.json();
      setPassages([newPassage, ...passages]);
      setText('');
      showToast('Passage saved successfully!');
    } catch (err) {
      showToast('Error saving passage.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/passages/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete');
      setPassages(passages.filter((p) => p._id !== id));
      showToast('Passage deleted.');
    } catch (err) {
      showToast('Error deleting passage.');
    }
  };

  // If user is NOT an admin, render the Admin Login Form
  if (!user || !user.isAdmin) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon" style={{ background: 'var(--red-50)' }}>
              <i className="ph ph-shield-check" style={{ color: 'var(--red-500)' }}></i>
            </div>
            <h1 className="auth-title">Admin Authentication</h1>
            <p className="auth-subtitle">Please sign in with administrator credentials to manage passages</p>
          </div>

          {adminError && (
            <div className="auth-error">
              <i className="ph ph-warning-circle"></i>
              {adminError}
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="admin@example.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary auth-btn" disabled={loggingIn}>
              {loggingIn ? (
                <>
                  <i className="ph ph-spinner animate-spin"></i> Authenticating...
                </>
              ) : (
                <>
                  <i className="ph ph-key"></i> Authenticate Admin
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        {toast && (
          <div className="toast">
            <i className="ph ph-check-circle"></i>
            {toast}
          </div>
        )}

        <div className="admin-header">
          <h1 className="admin-title">Passage Manager (Admin)</h1>
          <p className="admin-subtitle">
            Authenticated as <strong>{user.email}</strong>. Add and manage memorization passages.
          </p>
        </div>

        <form className="admin-form" onSubmit={handleSave}>
          <textarea
            className="admin-textarea"
            placeholder="Type or paste a new passage here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
          />
          <div className="admin-form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || !text.trim()}
            >
              {submitting ? (
                <>
                  <i className="ph ph-spinner animate-spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="ph ph-plus"></i> Save Passage
                </>
              )}
            </button>
          </div>
        </form>

        <h2 className="admin-section-title">
          Saved Passages ({passages.length})
        </h2>

        {loading ? (
          <div className="loading-container" style={{ padding: '24px 0' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : passages.length === 0 ? (
          <div className="admin-empty">
            <i className="ph ph-tray"></i>
            No passages in database yet. Add one above!
          </div>
        ) : (
          <div className="admin-list">
            {passages.map((p) => (
              <div key={p._id} className="admin-item">
                <div style={{ flex: 1 }}>
                  <p className="admin-item-text">{p.text}</p>
                  <span className="admin-item-meta">
                    Added {new Date(p.createdAt).toLocaleDateString()} &bull;{' '}
                    {p.text.split(/\s+/).length} words
                  </span>
                </div>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(p._id)}
                  title="Delete passage"
                >
                  <i className="ph ph-trash"></i>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
