import { io } from 'socket.io-client';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function createSession(nickname) {
  const res = await fetch(`${baseURL}/api/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ nickname })
  });
  return res.json();
}

export async function startGame() {
  const res = await fetch(`${baseURL}/api/game/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });
  return res.json();
}

export async function submitScore(token, score) {
  const res = await fetch(`${baseURL}/api/game/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ token, score })
  });
  return res.json();
}

export async function getLeaderboard() {
  const res = await fetch(`${baseURL}/api/leaderboard/today`, { credentials: 'include' });
  return res.json();
}

export function makeSocket() {
  return io(baseURL, { withCredentials: true });
}
