import { useEffect, useState } from 'react';
import { getLeaderboard, makeSocket } from '../lib/api';
export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    let socket;
    (async () => {
      const { ok, board } = await getLeaderboard();
      if (ok) setRows(board);
      socket = makeSocket();
      socket.on('leaderboard:today', (board) => setRows(board));
    })();
    return () => socket && socket.disconnect();
  }, []);
  return (
    <div className="card w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Today’s Top Scores</h2>
        <span className="badge">Live</span>
      </div>
      <div className="max-h-[420px] overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-400">
            <tr><th className="text-left p-2">#</th><th className="text-left p-2">Player</th><th className="text-right p-2">Points</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r._id || i} className={i < 3 ? 'bg-slate-800/70' : ''}>
                <td className="p-2">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                <td className="p-2">{r.nickname || 'Player'}</td>
                <td className="p-2 text-right font-semibold">{r.points}</td>
              </tr>
            ))}
            {rows.length === 0 && (<tr><td colSpan="3" className="p-4 text-center text-slate-400">No scores yet. Be the first!</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
