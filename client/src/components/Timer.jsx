import { useEffect, useState } from 'react';

export default function Timer({ duration, label, icon, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onComplete) onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const percentage = (timeLeft / duration) * 100;
  const isWarning = timeLeft <= 5;

  return (
    <div className="timer-wrapper">
      <div className="timer-bar">
        <span className="timer-label">
          <i className={`ph ${icon}`}></i>
          {label}
        </span>
        <span className={`timer-countdown ${isWarning ? 'warning' : ''}`}>
          0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
        </span>
      </div>
      <div className="timer-progress">
        <div
          className={`timer-progress-fill ${isWarning ? 'warning' : ''}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
