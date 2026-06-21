import { useState, useEffect, useRef } from 'react';

interface AudioButtonProps {
  text: string;
  lang?: string;
  className?: string;
  size?: 'sm' | 'md';
}

// Resolve voices, waiting for voiceschanged if needed (Chrome loads async)
function getVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise(resolve => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) return resolve(voices);
    const handler = () => resolve(window.speechSynthesis.getVoices());
    window.speechSynthesis.addEventListener('voiceschanged', handler, { once: true });
    // Safety timeout — resolve even if event never fires
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
  });
}

export function AudioButton({ text, lang = 'tr-TR', className = '', size = 'md' }: AudioButtonProps) {
  const [playing, setPlaying] = useState(false);
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Pre-warm voice list on mount so first click is instant
  useEffect(() => { getVoices(); }, []);

  const speak = async () => {
    if (!window.speechSynthesis) return;

    // Stop if already playing
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    const voices = await getVoices();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    utt.rate = 0.82;

    // Prefer an exact Turkish voice; fall back to any tr- voice; then no voice (browser uses lang)
    const trVoice =
      voices.find(v => v.lang === lang) ??
      voices.find(v => v.lang.startsWith('tr')) ??
      null;
    if (trVoice) utt.voice = trVoice;

    uttRef.current = utt;

    // Set playing immediately — onstart is unreliable in Chrome
    setPlaying(true);

    utt.onend = () => setPlaying(false);
    utt.onerror = () => setPlaying(false);

    window.speechSynthesis.speak(utt);

    // Chrome bug: speech can get paused when tab loses focus briefly; resume it
    const resume = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(resume);
        setPlaying(false);
      } else if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 200);

    utt.onend = () => { clearInterval(resume); setPlaying(false); };
    utt.onerror = () => { clearInterval(resume); setPlaying(false); };
  };

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const btnSize = size === 'sm' ? 'p-1' : 'p-1.5';

  return (
    <button
      onClick={speak}
      title={playing ? 'Stop' : 'Pronounce in Turkish'}
      className={`${btnSize} rounded-full transition-all ${
        playing
          ? 'bg-red-500/20 text-red-400'
          : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
      } ${className}`}
    >
      {playing ? (
        <svg className={iconSize} fill="currentColor" viewBox="0 0 20 20">
          <rect x="5" y="4" width="3" height="12" rx="1" />
          <rect x="12" y="4" width="3" height="12" rx="1" />
        </svg>
      ) : (
        <svg className={iconSize} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
        </svg>
      )}
    </button>
  );
}
