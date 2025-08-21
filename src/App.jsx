import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Game from './components/Game.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import { createSession } from './lib/api.js';
export default function App() {
  const [nickname, setNickname] = useState(localStorage.getItem('nickname') || 'Guest');
  const [playing, setPlaying] = useState(false);
  useEffect(() => { createSession(nickname); }, []);
  async function saveName() { localStorage.setItem('nickname', nickname); await createSession(nickname); }
  return (
    <div className="max-w-6xl mx-auto p-4">
      <Header nickname={nickname} setNickname={setNickname} saveName={saveName} playing={playing} />
      <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-4">
        <Game onPlayingChange={setPlaying} />
        <Leaderboard />
      </div>
      <p className="mt-4 text-sm text-slate-400">Round length is fixed at 120 seconds. Submit as many scores as you like; daily leaderboard resets at 00:00 Asia/Dhaka.</p>
    </div>
  );
}
