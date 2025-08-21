import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { startGame, submitScore, getLeaderboard, makeSocket } from "../lib/api.js";

const GRID=8,TYPES=6,TILE=56,SCORE_PER_TILE=10,DURATION=120;

export default function Game({ onPlayingChange }){
  const containerRef = useRef(null), phaserRef=useRef(null), timerRef=useRef(null), tokenRef=useRef(null), socketRef=useRef(null);
  const [timeLeft,setTimeLeft]=useState(0), [score,setScore]=useState(0), [playing,setPlaying]=useState(false), [starting,setStarting]=useState(false), [leaderboard,setLeaderboard]=useState([]);

  useEffect(()=>{
    socketRef.current=makeSocket();
    socketRef.current.on('leaderboard:today', setLeaderboard);
    return ()=>socketRef.current.disconnect();
  },[]);

  useEffect(()=>{ getLeaderboard().then(setLeaderboard); },[]);

  async function begin(){
    if(starting||playing) return;
    setStarting(true); setScore(0); clearInterval(timerRef.current);

    try{
      const data=await startGame();
      if(!data?.ok||!data?.token){ alert(data?.error||"Start failed"); setStarting(false); return; }
      tokenRef.current=data.token; setTimeLeft(DURATION); setPlaying(true); onPlayingChange?.(true);

      timerRef.current=setInterval(()=>{ setTimeLeft(t=>{ if(t<=1){ clearInterval(timerRef.current); endGame(); return 0;} return t-1; }); },1000);

      if(phaserRef.current){
        const scene=phaserRef.current.scene.keys.Match3Scene;
        scene?.resetBoard?.();
      }else{
        const config={ type:Phaser.AUTO, parent:containerRef.current, width:GRID*TILE, height:GRID*TILE, backgroundColor:"#0f172a", scene:[makeScene(setScore)], scale:{mode:Phaser.Scale.FIT, autoCenter:Phaser.Scale.CENTER_BOTH} };
        phaserRef.current=new Phaser.Game(config);
      }
    }catch(e){ console.error(e); alert("Game start error"); }
    finally{ setStarting(false); }
  }

  async function endGame(){
    if(!playing) return; setPlaying(false); onPlayingChange?.(false); clearInterval(timerRef.current);
    try{
      const token=tokenRef.current; tokenRef.current=null;
      if(!token) return;
      await submitScore(token,score);
      const updated=await getLeaderboard(); setLeaderboard(updated);
    }catch(e){ console.error(e); }
  }

  useEffect(()=>{ return ()=>{ clearInterval(timerRef.current); if(phaserRef.current){ phaserRef.current.destroy(true); phaserRef.current=null; } }; },[]);

  return(
    <div className="card flex flex-col gap-3">
      <div className="flex justify-between"><div>Time Left: <b>{timeLeft}s</b></div><div>Score: <b>{score}</b></div></div>
      <div ref={containerRef} className="rounded-2xl overflow-hidden border border-slate-700 w-[448px] h-[448px]" />
      <div className="flex gap-2">{!playing?<button className="btn" onClick={begin} disabled={starting}>{starting?"Starting...":"Start 2-min Round"}</button>:<button className="btn" onClick={endGame}>End Round & Submit</button>}</div>
      <div className="mt-3"><h3 className="text-sm font-bold mb-1">Leaderboard (Today)</h3>
        <ul className="text-xs max-h-48 overflow-auto">{leaderboard.map((u,i)=><li key={u.uid}>{i+1}. {u.nickname} - {u.points}</li>)}</ul>
      </div>
    </div>
  );
}
