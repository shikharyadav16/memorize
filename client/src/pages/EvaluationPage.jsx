import { useLocation, useNavigate } from 'react-router-dom';

export default function EvaluationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const { original = '', userText = '', score = 0, feedback = '' } = state;

  const getScoreClass = (s) => {
    if (s >= 8) return 'score-high';
    if (s >= 5) return 'score-mid';
    return 'score-low';
  };

  return (
    <div className="eval-page">
      <div className="eval-container">
        <div className="eval-header">
          <div className={`eval-score-ring ${getScoreClass(score)}`}>
            <span className="eval-score-value">
              {score}
              <span className="eval-score-suffix">/10</span>
            </span>
          </div>
          <h1 className="eval-title">
            {score >= 8 ? 'Outstanding Memory!' : score >= 5 ? 'Good Effort!' : 'Keep Practicing!'}
          </h1>
          {feedback && <p className="eval-feedback">{feedback}</p>}
        </div>

        <div className="eval-grid">
          <div className="eval-card">
            <div className="eval-card-header">
              <i className="ph ph-file-text"></i>
              Original Passage
            </div>
            <div className="eval-card-body">{original || 'N/A'}</div>
          </div>

          <div className="eval-card">
            <div className="eval-card-header">
              <i className="ph ph-user-focus"></i>
              Your Recalled Passage
            </div>
            <div className="eval-card-body">
              {userText ? (
                userText
              ) : (
                <span style={{ color: 'var(--gray-400)', fontStyle: 'italic' }}>
                  No text submitted.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="eval-actions">
          <button className="btn-primary" onClick={() => navigate('/')}>
            <i className="ph ph-arrow-right"></i>
            Solve Next Passage
          </button>
        </div>
      </div>
    </div>
  );
}
