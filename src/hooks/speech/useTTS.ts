import { useState, useRef, useCallback } from 'react';

// Module-level singleton so voices are loaded only once
let _voicePromise: Promise<SpeechSynthesisVoice[]> | null = null;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (_voicePromise) return _voicePromise;
  _voicePromise = new Promise(resolve => {
    const v = window.speechSynthesis.getVoices();
    if (v.length > 0) { resolve(v); return; }
    window.speechSynthesis.addEventListener(
      'voiceschanged',
      () => resolve(window.speechSynthesis.getVoices()),
      { once: true }
    );
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1500);
  });
  return _voicePromise;
}

export function useTTS() {
  const [wordIndex, setWordIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(async (text: string, rate = 0.88, onEnd?: () => void) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const voices = await loadVoices();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = rate;
    utt.lang = 'en-US';

    const enVoice =
      voices.find(v => v.lang === 'en-US' && v.localService) ??
      voices.find(v => v.lang === 'en-US') ??
      voices.find(v => v.lang.startsWith('en') && v.localService) ??
      voices.find(v => v.lang.startsWith('en')) ??
      null;
    if (enVoice) utt.voice = enVoice;

    // Compute character start position for each word
    const words = text.split(/\s+/);
    const startChars: number[] = [];
    let pos = 0;
    words.forEach(w => { startChars.push(pos); pos += w.length + 1; });

    uttRef.current = utt;
    setWordIndex(-1);
    setIsPlaying(true);

    utt.onboundary = (e: SpeechSynthesisEvent) => {
      if (e.name === 'word') {
        let idx = 0;
        for (let i = 0; i < startChars.length; i++) {
          if (startChars[i] <= e.charIndex) idx = i;
          else break;
        }
        setWordIndex(idx);
      }
    };

    // Chrome tab-focus bug: speech pauses when tab loses focus
    const resume = setInterval(() => {
      if (!window.speechSynthesis.speaking) clearInterval(resume);
      else if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    }, 250);

    utt.onend = () => {
      clearInterval(resume);
      setWordIndex(-1);
      setIsPlaying(false);
      onEnd?.();
    };
    utt.onerror = () => {
      clearInterval(resume);
      setWordIndex(-1);
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utt);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setWordIndex(-1);
    setIsPlaying(false);
  }, []);

  return { speak, stop, wordIndex, isPlaying };
}
