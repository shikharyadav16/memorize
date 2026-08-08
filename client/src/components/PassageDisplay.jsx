import Timer from './Timer';

export default function PassageDisplay({ text, onTimerComplete }) {
  return (
    <div className="game-container">
      <Timer
        duration={2}
        label="Memorize Passage"
        icon="ph-eye"
        onComplete={onTimerComplete}
      />
      <div className="passage-card">
        <p className="passage-text">{text}</p>
      </div>
    </div>
  );
}
