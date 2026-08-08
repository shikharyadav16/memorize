export default function Overlay({ onStart, isLoading }) {
  return (
    <div className="overlay-card">
      <div className="overlay-icon">
        <i className="ph ph-brain"></i>
      </div>
      <h1 className="overlay-title">Ready to Test Your Memory?</h1>
      <p className="overlay-subtitle">
        You will have 25 seconds to read and memorize the passage, followed by 30 seconds to write it down as accurately as possible.
      </p>
      <button className="btn-primary" onClick={onStart} disabled={isLoading}>
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
    </div>
  );
}
