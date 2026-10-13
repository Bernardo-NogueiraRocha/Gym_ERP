'use client';

import { useState, useEffect } from 'react';

export function RestTimer({ initialSeconds = 60, onComplete }: { initialSeconds: number; onComplete?: () => void }) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (timeLeft === 0 && onComplete) onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, onComplete]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins}:${remainderSecs < 10 ? '0' : ''}${remainderSecs}`;
  };

  return (
    <div className="flex flex-col items-center p-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg">
      <span className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Rest Timer</span>
      <div className="text-4xl font-mono font-bold text-emerald-400 mb-3">
        {formatTime(timeLeft)}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsActive(!isActive)}
          className="px-3 py-1 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition"
        >
          {isActive ? 'Pause' : 'Resume'}
        </button>
        <button
          onClick={() => setTimeLeft((prev) => prev + 30)}
          className="px-3 py-1 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition"
        >
          +30s
        </button>
      </div>
    </div>
  );
}