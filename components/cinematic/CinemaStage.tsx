'use client';
import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring} from 'motion/react';
import {featuredWork} from '@/data/workspace';
import './cinema.css';
export type FilmId='labstock'|'suhulog'|'bdrs';
const films={
 labstock:{name:'LabStock',line:'Every movement keeps its origin.',route:'Workbook → ledger → report',accent:'#158164'},
 suhulog:{name:'SuhuLog',line:'A correction adds to the story.',route:'Reading → correction → record',accent:'#237da6'},
 bdrs:{name:'BDRS',line:'One case. Separate truths.',route:'Request → pairing → outcome',accent:'#95283c'},
};
export function CinemaStage({initial='labstock',onAsk,compact=false}:{initial?:FilmId;onAsk?:(q:string)=>void;compact?:boolean}){
 const [selected,setSelected]=useState<FilmId>(initial);
 const [playing,setPlaying]=useState(false);
 const [failed,setFailed]=useState(false);
 const [visible,setVisible]=useState(false);
 const [started,setStarted]=useState(false);
 const reduced=useReducedMotion();
 const ref=useRef<HTMLDivElement>(null),video=useRef<HTMLVideoElement>(null);
 const x=useMotionValue(0),y=useMotionValue(0),rx=useSpring(x,{stiffness:100,damping:24}),ry=useSpring(y,{stiffness:100,damping:24});
 const film=films[selected],project=featuredWork.find(p=>p.slug===selected)!;
 useEffect(()=>{const node=ref.current;if(!node)return;const obs=new IntersectionObserver(([e])=>setVisible(e.isIntersecting),{threshold:.3});obs.observe(node);return()=>obs.disconnect();},[]);
 useEffect(()=>{const v=video.current;if(!v)return;if(!visible||(reduced&&!started)){v.pause();return;} const connection=(navigator as Navigator & {connection?:{saveData?:boolean}}).connection;if(!started&&!connection?.saveData){v.play().catch(()=>{});}},[visible,reduced,selected,started]);
 useEffect(()=>{const pause=()=>{if(document.hidden)video.current?.pause();};document.addEventListener('visibilitychange',pause);return()=>document.removeEventListener('visibilitychange',pause);},[]);
 function select(id:FilmId){video.current?.pause();setSelected(id);setPlaying(false);setFailed(false);setStarted(false);x.set(0);y.set(0);}
 function toggle(){const v=video.current;if(!v)return;if(v.paused){if(v.ended)v.currentTime=0;v.play().catch(()=>setFailed(true));}else v.pause();}
 return <section className={`cine-stage ${compact?'cine-compact':''}`} aria-label={`${film.name} cinematic presentation`}>
 {!compact&&<div className="cine-heading"><span>SOFTWARE, IN MOTION</span><span>01—03 / FOUNDER WORK</span></div>}
 <div className="cine-perspective" ref={ref} onPointerMove={e=>{if(reduced||e.pointerType!=='mouse')return;const r=e.currentTarget.getBoundingClientRect();x.set(-(e.clientY-r.top-r.height/2)/r.height*5);y.set((e.clientX-r.left-r.width/2)/r.width*7);}} onPointerLeave={()=>{x.set(0);y.set(0);}}>
 <motion.div className="cine-device" style={{rotateX:reduced?0:rx,rotateY:reduced?0:ry}}>
 <AnimatePresence mode="wait" initial={false}><motion.div key={selected} className="cine-film" initial={{opacity:reduced?1:0}} animate={{opacity:1}} exit={{opacity:reduced?1:0}} transition={{duration:.2}}>
 <video ref={video} src={visible||started?`/motion/${selected}.mp4`:undefined} poster={`/motion/${selected}.png`} preload="none" muted playsInline aria-label={`${film.name}: ${film.line} Illustrative reconstructed interface, synthetic data.`} onPlay={()=>{setPlaying(true);setStarted(true);}} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onError={()=>{setFailed(true);setPlaying(false);}} />
 {failed&&<div className="cine-fallback"><strong>{film.name}</strong><p>{film.line}</p><p>Film unavailable. The original public case study remains available below.</p></div>}
 </motion.div></AnimatePresence>
 <div className="cine-transport"><button type="button" onClick={toggle} disabled={failed} aria-label={`${playing?'Pause':'Play'} ${film.name} film`}>{playing?'Ⅱ':'▶'} <span>{playing?'Pause':'Play film'}</span></button><span>16 SEC <i/> ILLUSTRATIVE DEMO</span><a href={`/projects/${selected}/`}>Public case study ↗</a></div>
 </motion.div>
 </div>
 <div className="cine-selector" role="group" aria-label="Choose a software presentation">{(Object.keys(films) as FilmId[]).map((id,i)=><button type="button" key={id} aria-pressed={id===selected} onClick={()=>select(id)}><span>0{i+1}</span><strong>{films[id].name}</strong>{selected===id&&<motion.i layoutId={compact?undefined:'film-marker'} style={{background:film.accent}} transition={{duration:.3}}/>}</button>)}</div>
 <div className="cine-caption"><div><strong>{film.line}</strong><span>{film.route}</span></div>{onAsk&&<button type="button" onClick={()=>onAsk(project.askSuggestion??`Tell me about ${film.name}`)}>Ask about {film.name} ↗</button>}</div>
 </section>;
}
