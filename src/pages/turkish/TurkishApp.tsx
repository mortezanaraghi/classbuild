import { Routes, Route } from 'react-router-dom';
import { TurkishHome } from './TurkishHome';
import { LessonView } from './LessonView';

export function TurkishApp() {
  return (
    <Routes>
      <Route index element={<TurkishHome />} />
      <Route path="lesson/:weekId/:dayId" element={<LessonView />} />
    </Routes>
  );
}
