import { useState, useRef, useCallback } from 'react';

// SpeechRecognition is not in TypeScript's DOM lib; use any for the browser API
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechAPI = any;

function getAPI(): SpeechAPI | null {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechAPI>(null);
  const finalRef = useRef('');

  const supported = !!getAPI();

  const start = useCallback(() => {
    const API = getAPI();
    if (!API) return;

    finalRef.current = '';
    setTranscript('');
    setError(null);

    const rec: SpeechAPI = new API();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    recRef.current = rec;

    rec.onresult = (e: SpeechAPI) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) {
          finalRef.current += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }
      setTranscript((finalRef.current + interim).trim());
    };

    rec.onstart = () => setIsRecording(true);
    rec.onend = () => setIsRecording(false);

    rec.onerror = (e: SpeechAPI) => {
      setIsRecording(false);
      if (e.error === 'not-allowed') {
        setError('Microphone access denied. Allow it in your browser settings.');
      } else if (e.error !== 'no-speech' && e.error !== 'aborted') {
        setError('Recognition error — please try again.');
      }
    };

    rec.start();
  }, []);

  const stop = useCallback(() => {
    recRef.current?.stop();
    recRef.current = null;
  }, []);

  const reset = useCallback(() => {
    stop();
    finalRef.current = '';
    setTranscript('');
    setError(null);
  }, [stop]);

  return { transcript, isRecording, supported, error, start, stop, reset };
}
