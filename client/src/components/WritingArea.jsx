import { useState } from 'react';
import Timer from './Timer';

export default function WritingArea({ disabled, active, onSubmit }) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    onSubmit(text);
  };

  return (
    <div className="game-container">
      {active && (
        <Timer
          duration={30}
          label="Recall & Write"
          icon="ph-pencil-line"
          onComplete={handleSubmit}
        />
      )}
      <div className="writing-card">
        <div className="writing-header">
          <span className="writing-label">
            <i className="ph ph-note-pencil"></i>
            Your Recall
          </span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
            {text.trim().split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
        <textarea
          className="writing-textarea"
          placeholder={
            disabled
              ? 'Read the passage carefully above... (writing will unlock when timer completes)'
              : 'Type the passage here as you recall it...'
          }
          disabled={disabled}
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus={active}
        />
        {active && (
          <div className="writing-actions">
            <button className="btn-primary" onClick={handleSubmit}>
              <i className="ph ph-paper-plane-right"></i>
              Submit Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
