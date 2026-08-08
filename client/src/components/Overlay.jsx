import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Overlay({ onStart, isLoading }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    onStart();
  };

  return (
    <div className="overlay-card">
      <div className="overlay-icon">
        <i className="ph ph-brain"></i>
      </div>
      <h1 className="overlay-title">Ready to Test Your Memory?</h1>
      <p className="overlay-subtitle">
        You will have 25 seconds to read and memorize the passage, followed by 30 seconds to write it down as accurately as possible.
      </p>

      {user ? (
        <button className="btn-primary" onClick={handleClick} disabled={isLoading}>
          {isLoading ? (
            <>
              <i className="ph ph-spinner animate-spin"></i> Loading Passage...
            </>
          ) : (
            <>
              <i className="ph ph-play"></i> Start Practice
            </>
          )}
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <button className="btn-primary" onClick={() => navigate('/login')}>
            <i className="ph ph-sign-in"></i> Sign In to Practice
          </button>
          <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              style={{ color: 'var(--blue-500)', fontWeight: 500, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
            >
              Sign up here
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
