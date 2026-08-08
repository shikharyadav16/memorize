import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Overlay from '../components/Overlay';
import PassageDisplay from '../components/PassageDisplay';
import WritingArea from '../components/WritingArea';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5000/api';

export default function MainPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  // Flow states: 'IDLE' | 'READING' | 'WRITING' | 'EVALUATING'
  const [gameState, setGameState] = useState('IDLE');
  const [passage, setPassage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startPractice = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/passages/random`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load passage.');
      }

      setPassage(data.text);
      setGameState('READING');
    } catch (err) {
      setError(err.message);
      setGameState('IDLE');
    } finally {
      setLoading(false);
    }
  };

  const handleReadingComplete = () => {
    setGameState('WRITING');
  };

  const handleWritingSubmit = async (userText) => {
    setGameState('EVALUATING');
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/evaluate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          original: passage,
          userText: userText || '',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Evaluation failed.');

      // Navigate to evaluation page with results
      navigate('/evaluation', {
        state: {
          original: passage,
          userText: userText || '',
          score: data.score,
          feedback: data.feedback,
        },
      });
    } catch (err) {
      console.error('Evaluation error:', err);
      // Fallback navigation with local score calculation if API fails
      navigate('/evaluation', {
        state: {
          original: passage,
          userText: userText || '',
          score: 0,
          feedback: 'Error evaluating score with AI. Please check server logs and Groq API key configuration.',
        },
      });
    }
  };

  if (gameState === 'EVALUATING') {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Analyzing your recall with Groq AI...</p>
      </div>
    );
  }

  return (
    <main className="main-page">
      {error && (
        <div className="toast" style={{ background: 'var(--red-600)' }}>
          <i className="ph ph-warning-circle"></i>
          {error}
          <button
            onClick={() => setError('')}
            style={{ color: 'white', marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>
      )}

      {gameState === 'IDLE' && (
        <Overlay onStart={startPractice} isLoading={loading} />
      )}

      {gameState === 'READING' && (
        <div style={{ width: '100%', maxWidth: 720 }}>
          <PassageDisplay text={passage} onTimerComplete={handleReadingComplete} />
        </div>
      )}

      {gameState === 'WRITING' && (
        <div style={{ width: '100%', maxWidth: 720 }}>
          <WritingArea
            disabled={false}
            active={true}
            onSubmit={handleWritingSubmit}
          />
        </div>
      )}
    </main>
  );
}
