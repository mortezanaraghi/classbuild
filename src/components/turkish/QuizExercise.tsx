import { useState } from 'react';
import type { Exercise } from '../../data/turkish/types';

interface QuizExerciseProps {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export function QuizExercise({ exercise, onAnswer }: QuizExerciseProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [revealed, setRevealed] = useState(false);

  const isCorrect = (val: string) =>
    val.trim().toLowerCase() === exercise.answer.trim().toLowerCase();

  const handleSelect = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    setRevealed(true);
    setTimeout(() => onAnswer(isCorrect(opt)), 800);
  };

  const handleSubmit = () => {
    if (revealed) return;
    setRevealed(true);
    setTimeout(() => onAnswer(isCorrect(input)), 800);
  };

  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
      <div className="text-sm text-white/50 uppercase tracking-wide">
        {exercise.type === 'multiple-choice' ? 'Multiple Choice' : 'Fill in the Blank'}
      </div>

      <div className="text-lg text-white font-medium leading-relaxed">
        {exercise.prompt}
        {exercise.promptTurkish && (
          <div className="text-base text-amber-300 mt-1 font-normal">{exercise.promptTurkish}</div>
        )}
      </div>

      {exercise.type === 'multiple-choice' && exercise.options && (
        <div className="grid grid-cols-1 gap-2">
          {exercise.options.map(opt => {
            const picked = selected === opt;
            const correct = isCorrect(opt);
            let style = 'border-white/10 text-white/80 hover:border-white/30 hover:bg-white/5';
            if (revealed && correct) style = 'border-green-500 bg-green-500/20 text-green-300';
            else if (revealed && picked && !correct) style = 'border-red-500 bg-red-500/20 text-red-300';
            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`text-left px-4 py-3 rounded-xl border transition-all text-sm ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {exercise.type === 'fill-blank' && (
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Type your answer…"
            disabled={revealed}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30"
          />
          {!revealed && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2.5 bg-red-700 hover:bg-red-600 text-white text-sm rounded-xl transition-colors"
            >
              Check
            </button>
          )}
        </div>
      )}

      {revealed && exercise.explanation && (
        <div className={`text-sm rounded-xl px-4 py-3 ${
          isCorrect(selected ?? input)
            ? 'bg-green-500/10 text-green-300 border border-green-500/20'
            : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
        }`}>
          {isCorrect(selected ?? input) ? '✓ Correct! ' : `✗ Answer: ${exercise.answer}. `}
          {exercise.explanation}
        </div>
      )}
    </div>
  );
}
