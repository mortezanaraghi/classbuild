import { Routes, Route } from 'react-router-dom';
import { SpeechHome } from './SpeechHome';
import { PracticeSession } from './PracticeSession';

export function SpeechApp() {
  return (
    <Routes>
      <Route index element={<SpeechHome />} />
      <Route path="practice/:categoryId" element={<PracticeSession />} />
    </Routes>
  );
}
