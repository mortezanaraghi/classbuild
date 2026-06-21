import { Routes, Route } from 'react-router-dom';
import { PianoHome } from './PianoHome';
import { SongLesson } from './SongLesson';

export function PianoApp() {
  return (
    <Routes>
      <Route index element={<PianoHome />} />
      <Route path="song/:id" element={<SongLesson />} />
    </Routes>
  );
}
