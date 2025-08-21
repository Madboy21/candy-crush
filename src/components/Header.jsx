export default function Header({ nickname, setNickname, saveName, playing }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <h1 className="text-2xl font-bold">GemsTown Match‑3</h1>
      <div className="flex items-center gap-2">
        <input className="input" placeholder="Your nickname" value={nickname} disabled={playing} onChange={(e) => setNickname(e.target.value)} maxLength={20} />
        <button className="btn" disabled={playing} onClick={saveName}>Save</button>
      </div>
    </div>
  );
}
