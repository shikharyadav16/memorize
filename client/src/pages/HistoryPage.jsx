import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5000/api';

export default function HistoryPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/submissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load history.');

        setSubmissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  if (!token) {
    return (
      <div className="history-page">
        <div className="admin-container" style={{ textAlign: 'center', paddingTop: 64 }}>
          <i className="ph ph-lock-key" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: 16 }}></i>
          <h2 className="admin-title">Authentication Required</h2>
          <p className="admin-subtitle" style={{ marginBottom: 24 }}>
            Please sign in to view your submission history and recall progress.
          </p>
          <Link to="/login" className="btn-primary">
            <i className="ph ph-sign-in"></i> Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  const getScoreBadgeClass = (s) => {
    if (s >= 8) return 'score-badge-high';
    if (s >= 5) return 'score-badge-mid';
    return 'score-badge-low';
  };

  const handleCardClick = (sub) => {
    navigate('/evaluation', {
      state: {
        original: sub.originalText,
        userText: sub.userText,
        score: sub.score,
        feedback: sub.feedback,
      },
    });
  };

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="admin-header">
          <h1 className="admin-title">Recall Submission History</h1>
          <p className="admin-subtitle">
            Review past memorization attempts, scores out of 10, and AI evaluation feedback.
          </p>
        </div>

        {error && (
          <div className="toast" style={{ background: 'var(--red-600)' }}>
            <i className="ph ph-warning-circle"></i>
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading your submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="admin-empty">
            <i className="ph ph-clock-counter-clockwise"></i>
            No submissions recorded yet. Practice a passage to save your first attempt!
          </div>
        ) : (
          <div className="history-list">
            {submissions.map((sub) => (
              <div
                key={sub._id}
                className="history-card"
                onClick={() => handleCardClick(sub)}
              >
                <div className="history-card-header">
                  <div className={`history-score-badge ${getScoreBadgeClass(sub.score)}`}>
                    {sub.score}/10
                  </div>
                  <span className="history-date">
                    <i className="ph ph-calendar-blank"></i>
                    {new Date(sub.createdAt).toLocaleDateString()} at{' '}
                    {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="history-card-body">
                  <div className="history-snippet">
                    <strong>Original Passage:</strong> "{sub.originalText}"
                  </div>
                  <div className="history-snippet user-snippet">
                    <strong>Your Recall:</strong> "{sub.userText || '(No response)'}"
                  </div>
                </div>

                <div className="history-card-footer">
                  <span className="history-view-link">
                    View Full Evaluation <i className="ph ph-arrow-right"></i>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
