import { useState, useEffect } from 'react';

const NUM_BARS = 22;

interface WaveformProps {
  isActive: boolean;
}

export function Waveform({ isActive }: WaveformProps) {
  const [heights, setHeights] = useState<number[]>(() => Array(NUM_BARS).fill(0.08));

  useEffect(() => {
    if (!isActive) {
      setHeights(Array(NUM_BARS).fill(0.08));
      return;
    }
    const id = setInterval(() => {
      setHeights(Array.from({ length: NUM_BARS }, () => 0.05 + Math.random() * 0.92));
    }, 90);
    return () => clearInterval(id);
  }, [isActive]);

  return (
    <div className="flex items-center justify-center gap-0.5 h-12" aria-hidden="true">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full transition-all duration-90 ${
            isActive ? 'bg-red-400' : 'bg-white/12'
          }`}
          style={{ height: `${Math.max(h * 100, 6)}%` }}
        />
      ))}
    </div>
  );
}
