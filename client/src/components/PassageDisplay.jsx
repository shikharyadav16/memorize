import Timer from './Timer';

export default function PassageDisplay({ text, onTimerComplete }) {
  return (
    <div className="game-container">
      <Timer
        duration={30}
        label="Memorize Passage"
        icon="ph-eye"
        onComplete={onTimerComplete}
      />
      <div
        className="passage-card"
        onContextMenu={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
      >
        <p className="passage-text">{text}</p>
      </div>
    </div>
  );
}
