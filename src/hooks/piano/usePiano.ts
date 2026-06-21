import { useRef, useCallback } from 'react';

// Equal-temperament frequency for any note string e.g. 'C4', 'F#3', 'Bb4'
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const ENHARMONIC: Record<string, string> = {
  Db: 'C#', Eb: 'D#', Fb: 'E', Gb: 'F#', Ab: 'G#', Bb: 'A#', Cb: 'B',
};

function noteToFreq(noteStr: string): number {
  const match = noteStr.match(/^([A-Ga-g][b#]?)(\d)$/);
  if (!match) return 440;
  let name = match[1];
  const octave = parseInt(match[2]);
  if (ENHARMONIC[name]) name = ENHARMONIC[name];
  const semitone = NOTE_NAMES.indexOf(name);
  if (semitone < 0) return 440;
  // A4 = 440Hz, MIDI number = (octave+1)*12 + semitone
  const midi = (octave + 1) * 12 + semitone;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Piano-like synthesis: layered harmonics + percussive attack + ADSR
function playPianoNote(
  ctx: AudioContext,
  dest: AudioNode,
  freq: number,
  when: number,
  duration: number,
  velocity = 0.75,
) {
  const masterGain = ctx.createGain();
  masterGain.connect(dest);

  // Harmonics that give piano its character
  const partials: [number, number, OscillatorType][] = [
    [1, 1.00, 'triangle'],
    [2, 0.55, 'sine'],
    [3, 0.30, 'sine'],
    [4, 0.18, 'sine'],
    [5, 0.10, 'sine'],
    [7, 0.05, 'sine'],
  ];

  partials.forEach(([ratio, amp, type]) => {
    const osc = ctx.createOscillator();
    const hGain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq * ratio;
    // Higher harmonics decay faster
    hGain.gain.setValueAtTime(amp * velocity * 0.22, when);
    hGain.gain.exponentialRampToValueAtTime(
      amp * velocity * 0.22 * 0.1,
      when + duration * (ratio === 1 ? 1.4 : 0.6),
    );
    osc.connect(hGain);
    hGain.connect(masterGain);
    osc.start(when);
    osc.stop(when + duration + 1.5);
  });

  // Percussive click (hammer-on-string thump)
  const clickBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.025), ctx.sampleRate);
  const d = clickBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) {
    d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
  }
  const click = ctx.createBufferSource();
  click.buffer = clickBuf;
  const clickGain = ctx.createGain();
  clickGain.gain.value = velocity * 0.12;
  click.connect(clickGain);
  clickGain.connect(masterGain);
  click.start(when);

  // Master ADSR
  masterGain.gain.setValueAtTime(0, when);
  masterGain.gain.linearRampToValueAtTime(1, when + 0.008);
  masterGain.gain.exponentialRampToValueAtTime(0.001, when + duration + 1.2);
}

export function usePiano() {
  const ctxRef = useRef<AudioContext | null>(null);
  const reverbRef = useRef<ConvolverNode | null>(null);
  const dryRef = useRef<GainNode | null>(null);
  const wetRef = useRef<GainNode | null>(null);

  const ensureCtx = useCallback(() => {
    if (ctxRef.current) return ctxRef.current;

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    // Simple reverb via impulse response (short room)
    const len = ctx.sampleRate * 1.5;
    const irBuf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = irBuf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
      }
    }
    const reverb = ctx.createConvolver();
    reverb.buffer = irBuf;
    reverbRef.current = reverb;

    const dry = ctx.createGain();
    dry.gain.value = 0.72;
    const wet = ctx.createGain();
    wet.gain.value = 0.28;

    dry.connect(ctx.destination);
    reverb.connect(wet);
    wet.connect(ctx.destination);

    dryRef.current = dry;
    wetRef.current = wet;

    return ctx;
  }, []);

  const playNote = useCallback((note: string, durationBeats = 1.5, bpm = 90, velocity = 0.75, delaySeconds = 0) => {
    const ctx = ensureCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const secPerBeat = 60 / bpm;
    const durationSec = durationBeats * secPerBeat;
    const when = ctx.currentTime + delaySeconds;
    const freq = noteToFreq(note);
    const dest = dryRef.current ?? ctx.destination;

    playPianoNote(ctx, dest, freq, when, durationSec, velocity);
    if (reverbRef.current && wetRef.current) {
      playPianoNote(ctx, reverbRef.current, freq, when, durationSec, velocity * 0.3);
    }
  }, [ensureCtx]);

  const stopAll = useCallback(() => {
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
      reverbRef.current = null;
      dryRef.current = null;
      wetRef.current = null;
    }
  }, []);

  return { playNote, stopAll, noteToFreq };
}
