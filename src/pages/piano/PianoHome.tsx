import { useNavigate } from 'react-router-dom';
import { SONGS } from '../../data/piano/songs';
import { SongCard } from '../../components/piano/SongCard';

export function PianoHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <div className="px-6 pt-10 pb-6 text-center">
        <div className="text-5xl mb-4">🎹</div>
        <h1 className="text-3xl font-bold text-white">Piano</h1>
        <p className="text-white/50 mt-2 text-sm max-w-xs mx-auto">
          Learn to play Hans Zimmer songs — from complete beginner to confident player.
        </p>
      </div>

      {/* How it works */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
          {[
            { icon: '👁', step: '1. Watch', desc: 'See the keys light up' },
            { icon: '🎯', step: '2. Learn', desc: 'Press one note at a time' },
            { icon: '🎹', step: '3. Play', desc: 'Play it start to finish' },
          ].map(item => (
            <div key={item.step} className="bg-white/5 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="text-xs font-semibold text-white/80">{item.step}</div>
              <div className="text-[10px] text-white/40 mt-0.5">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Songs */}
      <div className="px-4 pb-10">
        <h2 className="text-xs uppercase tracking-wider text-white/30 font-semibold mb-4 px-2">
          Choose a song
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {SONGS.map(song => (
            <SongCard
              key={song.id}
              song={song}
              onClick={() => navigate(`/piano/song/${song.id}`)}
            />
          ))}
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-8 max-w-lg mx-auto bg-white/5 rounded-xl p-4">
          <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-2">
            Computer keyboard shortcuts
          </p>
          <div className="space-y-1 text-xs text-white/30 font-mono">
            <div>Lower octave (C3–B3): <span className="text-white/50">Z X C V B N M</span></div>
            <div>Upper octave (C4–B4): <span className="text-white/50">Q W E R T Y U</span></div>
            <div>Black keys: <span className="text-white/50">S D · G H J · 2 3 · 5 6 7</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
