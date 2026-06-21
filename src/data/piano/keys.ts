export const WHITE_KEYS = [
  { note: 'C3', label: 'C', kbd: 'Z' },
  { note: 'D3', label: 'D', kbd: 'X' },
  { note: 'E3', label: 'E', kbd: 'C' },
  { note: 'F3', label: 'F', kbd: 'V' },
  { note: 'G3', label: 'G', kbd: 'B' },
  { note: 'A3', label: 'A', kbd: 'N' },
  { note: 'B3', label: 'B', kbd: 'M' },
  { note: 'C4', label: 'C', kbd: 'Q' },
  { note: 'D4', label: 'D', kbd: 'W' },
  { note: 'E4', label: 'E', kbd: 'E' },
  { note: 'F4', label: 'F', kbd: 'R' },
  { note: 'G4', label: 'G', kbd: 'T' },
  { note: 'A4', label: 'A', kbd: 'Y' },
  { note: 'B4', label: 'B', kbd: 'U' },
];

// boundary = index of the white key to the right of this black key
export const BLACK_KEYS = [
  { note: 'C#3', boundary: 1, kbd: 'S' },
  { note: 'D#3', boundary: 2, kbd: 'D' },
  { note: 'F#3', boundary: 4, kbd: 'G' },
  { note: 'G#3', boundary: 5, kbd: 'H' },
  { note: 'A#3', boundary: 6, kbd: 'J' },
  { note: 'C#4', boundary: 8, kbd: '2' },
  { note: 'D#4', boundary: 9, kbd: '3' },
  { note: 'F#4', boundary: 11, kbd: '5' },
  { note: 'G#4', boundary: 12, kbd: '6' },
  { note: 'A#4', boundary: 13, kbd: '7' },
];

export const KEY_TO_NOTE: Record<string, string> = {};
WHITE_KEYS.forEach(k => { KEY_TO_NOTE[k.kbd.toLowerCase()] = k.note; });
BLACK_KEYS.forEach(k => { KEY_TO_NOTE[k.kbd.toLowerCase()] = k.note; });

export const NOTE_TO_KBD: Record<string, string> = {};
WHITE_KEYS.forEach(k => { NOTE_TO_KBD[k.note] = k.kbd; });
BLACK_KEYS.forEach(k => { NOTE_TO_KBD[k.note] = k.kbd; });
