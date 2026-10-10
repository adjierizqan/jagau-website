import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

// All on-screen records are invented demonstration values, never operational data.
// Product structure and semantics: data/workspace.ts + approved public captures.
const ink='#182322', muted='#71807b', line='#e2e7e3';
const ease=Easing.bezier(.16,1,.3,1);
const at=(f:number,start:number,duration=24)=>interpolate(f,[start,start+duration],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease});
function Reveal({start,children,style={}}:{start:number;children:React.ReactNode;style?:React.CSSProperties}){
 const f=useCurrentFrame();const p=at(f,start);return <div style={{opacity:p,translate:`0 ${(1-p)*24}px`,...style}}>{children}</div>;
}
function Label({children}:{children:React.ReactNode}){return <div style={{fontSize:16,letterSpacing:2,textTransform:'uppercase',color:muted,fontWeight:600}}>{children}</div>}
function Pointer({x,y,click}:{x:number;y:number;click:boolean}){return <div style={{position:'absolute',left:x,top:y,pointerEvents:'none',filter:'drop-shadow(0 3px 4px #0003)'}}><svg width="40" height="48" viewBox="0 0 40 48"><path d="M4 3 L31 26 L19 28 L14 41 Z" fill={click?'#007d5d':'#202725'} stroke="white" strokeWidth="3"/></svg></div>}
function Frame({title,accent,nav,active,children}:{title:string;accent:string;nav:string[];active:number;children:React.ReactNode}){
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <div style={{position:'absolute',left:280,top:262,width:1360,height:686,border:'1px solid #cad1cc',borderRadius:20,overflow:'hidden',background:'#f7f9f7',boxShadow:'0 42px 80px #162a2224',opacity:at(f,Math.round(.55*fps)),transform:`perspective(2400px) rotateX(${interpolate(f,[18,90],[8,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease})}deg) translateY(${(1-at(f,18,40))*80}px)`}}>
 <div style={{height:44,background:'#edf0ec',borderBottom:`1px solid ${line}`,display:'flex',alignItems:'center',padding:'0 20px',gap:8}}><i style={{width:10,height:10,borderRadius:10,background:'#e2a199'}}/><i style={{width:10,height:10,borderRadius:10,background:'#dec38c'}}/><i style={{width:10,height:10,borderRadius:10,background:'#9abd9d'}}/><span style={{margin:'auto',fontSize:13,color:'#77847e',letterSpacing:1}}>JAGAU / {title.toUpperCase()} · ILLUSTRATIVE DEMO</span></div>
 <aside style={{position:'absolute',top:44,bottom:0,left:0,width:210,padding:24,background:title==='SuhuLog'?'#123e5a':'white',color:title==='SuhuLog'?'white':ink,borderRight:`1px solid ${line}`}}>
 <Reveal start={30}><div style={{fontSize:25,fontWeight:700,letterSpacing:-1}}>{title}</div><div style={{fontSize:12,opacity:.6,marginTop:7}}>Demo workspace</div></Reveal>
 <div style={{marginTop:52}}>{nav.map((n,i)=><Reveal key={n} start={42+i*6}><div style={{padding:'13px 12px',margin:'5px -10px',fontSize:17,borderRadius:7,background:active===i?accent+'16':'transparent',color:active===i?(title==='SuhuLog'?'white':accent):undefined,borderLeft:active===i?`3px solid ${accent}`:'3px solid transparent',fontWeight:active===i?650:400}}><span style={{opacity:.5,marginRight:13,fontSize:14}}>◇</span>{n}</div></Reveal>)}</div>
 <span style={{position:'absolute',bottom:24,fontSize:12,opacity:.6}}>DEMO / NO LIVE DATA</span></aside>
 <div style={{position:'absolute',left:258,right:38,top:81,bottom:30}}>{children}</div></div>
}
function Stage({name,kicker,title,subtitle,children}:{name:string;kicker:string;title:string;subtitle:string;children:React.ReactNode}){
 const f=useCurrentFrame(); return <AbsoluteFill style={{background:'#e9eae3',fontFamily:'Arial, sans-serif',color:ink,overflow:'hidden'}}>
 <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 25%,#fafaf5 0%,#e9eae3 72%)'}}/>
 <div style={{position:'absolute',left:104,top:62,fontSize:24,letterSpacing:5,fontWeight:700}}>JAGAU<span style={{fontWeight:400,letterSpacing:1,marginLeft:24,color:muted,fontSize:15}}>SOFTWARE STUDIES</span></div>
 <div style={{position:'absolute',right:104,top:68,fontSize:15,letterSpacing:2,color:muted}}>{name} / 2026</div>
 <Reveal start={0} style={{position:'absolute',left:282,top:127}}><Label>{kicker}</Label><h1 style={{fontSize:63,lineHeight:1.1,fontWeight:500,letterSpacing:-3,margin:'15px 0 0'}}>{title}</h1></Reveal>
 {children}
 <div style={{position:'absolute',bottom:52,left:282,right:282,display:'flex',justifyContent:'space-between',fontSize:18,color:muted}}><span>{subtitle}</span><span>Reconstructed UI · synthetic demonstration</span></div>
 <div style={{position:'absolute',bottom:0,height:3,background:'#8c9c91',width:`${f/479*100}%`}}/>
 </AbsoluteFill>;
}
const panel:React.CSSProperties={background:'white',border:`1px solid ${line}`,borderRadius:10,padding:24};

export function LabStockFilm(){
 const f=useCurrentFrame();const {fps}=useVideoConfig();const report=f>=10*fps;
 const pointerX=interpolate(f,[155,187,274,298],[920,98,98,94],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease});
 const pointerY=interpolate(f,[155,187,274,298],[410,249,249,350],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease});
 return <Stage name="01 / LABSTOCK" kicker="Inventory / source → ledger → report" title="Every movement keeps its origin." subtitle="One record. From workbook to report.">
 <Frame title="LabStock" accent="#00845e" nav={['Hari ini','Stok','Mutasi','Amprah','Laporan']} active={report?4:f>188?2:1}>
 <Reveal start={48}><div style={{display:'flex',alignItems:'end',justifyContent:'space-between'}}><div><Label>{report?'Laporan / sumber yang sama':'Operasional / stok'}</Label><h2 style={{fontSize:34,fontWeight:550,letterSpacing:-1,margin:'13px 0 10px'}}>{report?'Laporan bulanan':'Persediaan laboratorium'}</h2></div><span style={{fontSize:14,color:'#00845e',padding:'11px 16px',border:'1px solid #b8dfce',borderRadius:6}}>{report?'Excel ↗':'Workbook demo.xlsx'}</span></div></Reveal>
 <div style={{display:'flex',gap:16,marginTop:17}}>
 <Reveal start={60} style={{...panel,flex:1}}><Label>Barang demo</Label><div style={{fontSize:40,marginTop:12,fontVariantNumeric:'tabular-nums'}}>{Math.round(at(f,65,45)*22)}<span style={{fontSize:15,color:muted,marginLeft:12}}>item</span></div></Reveal>
 <Reveal start={68} style={{...panel,flex:1}}><Label>Identitas sumber</Label><div style={{fontSize:21,marginTop:24}}>Workbook · Sheet · Row</div></Reveal>
 <Reveal start={76} style={{...panel,flex:1}}><Label>Riwayat</Label><div style={{fontSize:21,marginTop:24,color:'#00845e'}}>Tetap tersimpan ↗</div></Reveal>
 </div>
 <Reveal start={94} style={{...panel,marginTop:18,padding:'0 22px'}}><div style={{display:'grid',gridTemplateColumns:'2.4fr 1fr 1fr 1.3fr',padding:'18px 0',fontSize:13,letterSpacing:1,color:muted}}><span>BARANG DEMO</span><span>MASUK</span><span>KELUAR</span><span>SUMBER</span></div>
 {['Kapas alkohol','Kertas termal','Cleaning solution'].map((s,i)=><Reveal key={s} start={105+i*12}><div style={{display:'grid',gridTemplateColumns:'2.4fr 1fr 1fr 1.3fr',padding:'19px 0',fontSize:19,borderTop:`1px solid ${line}`,background:i===0&&f>188?'#eff8f2':'white',color:i===0&&f>188?'#006b4d':ink}}><span>{s}</span><span>{[12,16,5][i]}</span><span>{[2,4,0][i]}</span><span style={{fontFamily:'monospace',fontSize:16}}>Sheet 1 / {i+8}</span></div></Reveal>)}
 </Reveal>
 <Reveal start={200} style={{position:'absolute',right:-12,bottom:0,width:640,padding:22,background:'#163d31',color:'white',borderRadius:10,boxShadow:'0 18px 38px #14372730',transform:`translateX(${(1-at(f,200))*45}px)`}}><div style={{fontSize:13,letterSpacing:2,color:'#a2ccb6'}}>SOURCE IDENTITY</div><div style={{fontSize:23,marginTop:12,display:'flex',justifyContent:'space-between'}}><span>demo.xlsx</span><span style={{color:'#8db39e'}}>→</span><span>Sheet 1</span><span style={{color:'#8db39e'}}>→</span><span>Row 8</span></div><div style={{fontSize:15,color:'#c1d7ca',marginTop:13}}>{report?'Laporan & ekspor memakai ledger yang sama.':'Mutasi tetap terhubung ke baris sumber.'}</div></Reveal>
 </Frame>
 <div style={{position:'absolute',left:304,top:307,opacity:at(f,150)*(1-at(f,330))}}><Pointer x={pointerX} y={pointerY} click={(f>184&&f<198)||(f>296&&f<310)}/></div>
 <Reveal start={390} style={{position:'absolute',right:128,top:204,color:'#007955',fontSize:19}}>Import → ledger → report ✓</Reveal>
 </Stage>;
}

export function SuhuLogFilm(){
 const f=useCurrentFrame();const corrected=f>=260;const path='M20 170 L115 135 L210 155 L305 84 L400 119 L495 62 L590 104 L685 48 L780 85';
 return <Stage name="02 / SUHULOG" kicker="Monitoring / reading → correction → record" title="A correction adds to the story." subtitle="The effective reading changes. History stays.">
 <Frame title="SuhuLog" accent="#1877a4" nav={['Dashboard','Catat suhu','Monitoring','Laporan']} active={f<140?1:2}>
 <Reveal start={45}><Label>Titik demo 01 / pagi</Label><h2 style={{fontSize:34,fontWeight:550,letterSpacing:-1,margin:'13px 0 23px'}}>Monitoring suhu</h2></Reveal>
 <div style={{display:'flex',gap:18}}><Reveal start={63} style={{...panel,width:245}}><Label>Pencatatan demo</Label><div style={{fontSize:52,color:'#145f85',margin:'13px 0 6px',fontVariantNumeric:'tabular-nums'}}>{(corrected?4.6:interpolate(f,[66,106],[0,4.8],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})).toFixed(1)}<span style={{fontSize:24}}> °C</span></div><span style={{fontSize:14,color:muted}}>{corrected?'Nilai efektif · dikoreksi':'Nilai awal · tersimpan'}</span></Reveal>
 <Reveal start={77} style={{...panel,flex:1}}><Label>Riwayat koreksi</Label><div style={{fontSize:21,marginTop:17}}>Nilai sebelumnya tetap tercatat.</div><div style={{fontSize:15,color:muted,marginTop:12}}>Contoh pembacaan sintetis · bukan batas klinis</div></Reveal></div>
 <Reveal start={98} style={{...panel,marginTop:18,height:238,position:'relative'}}><Label>Kurva pembacaan / data ilustratif</Label><svg width="100%" height="178" viewBox="0 0 820 210" style={{overflow:'visible'}}>
 {[40,100,160].map(y=><line key={y} x1="20" y1={y} x2="800" y2={y} stroke="#e8eef1"/>)}
 <path d={path} fill="none" stroke="#237da6" strokeWidth="4" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-at(f,118,88)}/>
 <circle cx="780" cy="85" r={6*at(f,204)} fill="#237da6"/>
 </svg>
 <Reveal start={235} style={{position:'absolute',right:24,top:49,padding:'13px 20px',background:'#123e5a',color:'white',borderRadius:7,fontSize:18}}>{corrected?'4.8 → 4.6 °C':'Koreksi pembacaan'}</Reveal>
 </Reveal>
 <Reveal start={281} style={{position:'absolute',bottom:-13,right:-16,left:100,...panel,padding:'20px 25px',boxShadow:'0 16px 32px #123e5a18',display:'flex',alignItems:'center',gap:24}}><span style={{fontSize:25,color:'#227694'}}>↳</span><div><div style={{fontSize:18}}>4.8 °C <span style={{fontSize:14,color:muted}}> · nilai awal dipertahankan</span></div><div style={{fontSize:18,marginTop:8,color:'#145f85'}}>4.6 °C <span style={{fontSize:14}}> · koreksi baru menjadi efektif</span></div></div><span style={{marginLeft:'auto',fontSize:13,color:muted}}>DEMO / AUDIT TRAIL</span></Reveal>
 <div style={{position:'absolute',opacity:at(f,210)*(1-at(f,280)),right:interpolate(f,[215,242],[280,72],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease}),top:interpolate(f,[215,242],[270,319],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease})}}><Pointer x={0} y={0} click={f>253}/></div>
 </Frame><Reveal start={370} style={{position:'absolute',right:128,top:204,color:'#145f85',fontSize:19}}>Reading → history → export ✓</Reveal></Stage>;
}

export function BdrsFilm(){
 const f=useCurrentFrame();const states=['Permintaan','Uji silang','Pengeluaran','Hasil fisik'];
 return <Stage name="03 / BDRS" kicker="System of record / distinct events, one case" title="One case. Separate truths." subtitle="An issued unit does not imply a recorded outcome.">
 <Frame title="BDRS" accent="#95283c" nav={['Pelayanan','Persediaan','Laporan','Riwayat']} active={0}>
 <Reveal start={43}><Label>Pelayanan / kasus ilustratif</Label><h2 style={{fontSize:34,fontWeight:550,letterSpacing:-1,margin:'13px 0 20px'}}>Kasus demo 001</h2></Reveal>
 <Reveal start={64} style={{...panel,display:'flex',justifyContent:'space-between',padding:'20px 24px',alignItems:'center'}}><span style={{fontSize:20}}>Pencatatan peristiwa</span><span style={{fontSize:14,color:'#95283c'}}>Tanpa data pasien</span></Reveal>
 <div style={{display:'flex',gap:12,marginTop:24}}>{states.map((s,i)=><Reveal key={s} start={83+i*15} style={{flex:1,...panel,padding:20,borderTop:`3px solid ${f>140+i*43?'#95283c':'#dfe5e1'}`}}><div style={{fontFamily:'monospace',fontSize:15,color:'#aa7a83'}}>0{i+1}</div><div style={{fontSize:21,fontWeight:550,marginTop:27}}>{s}</div><div style={{fontSize:14,color:muted,marginTop:12,lineHeight:1.5}}>{['Kebutuhan dicatat','Per pasangan kantong','Peristiwa tersendiri','Dicatat terpisah'][i]}</div><div style={{marginTop:23,fontSize:13,color:i===3?'#956122':'#95283c'}}>{i===3?'Belum dicatat':f>140+i*43?'Tercatat · demo':'Menunggu'}</div></Reveal>)}</div>
 <Reveal start={222} style={{...panel,marginTop:22,padding:22,display:'flex',justifyContent:'space-between',fontSize:18}}><span>Kantong demo A</span><span>Uji silang <b style={{color:'#25765b',fontWeight:500}}>· kompatibel</b></span><span style={{color:'#95283c'}}>Pengeluaran tercatat</span></Reveal>
 <Reveal start={285} style={{position:'absolute',bottom:0,right:-12,width:670,background:'#542732',color:'#fff',padding:'25px 28px',borderRadius:10,boxShadow:'0 18px 36px #52202d25'}}><div style={{fontSize:13,letterSpacing:2,color:'#d9afb9'}}>PRESERVE THE DISTINCTION</div><div style={{fontSize:27,marginTop:13}}>Dikeluarkan ≠ digunakan</div><div style={{fontSize:16,marginTop:11,color:'#e0c8ce'}}>Hasil fisik dan episode transfusi tetap peristiwa terpisah.</div></Reveal>
 <div style={{position:'absolute',opacity:at(f,170)*(1-at(f,254)),left:interpolate(f,[170,218],[350,655],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease}),top:250}}><Pointer x={0} y={0} click={f>218}/></div>
 </Frame><Reveal start={370} style={{position:'absolute',right:128,top:204,color:'#95283c',fontSize:19}}>Request → pairing → issue → outcome</Reveal></Stage>;
}
