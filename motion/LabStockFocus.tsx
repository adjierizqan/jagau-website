import React from 'react';
import {AbsoluteFill,Easing,interpolate,useCurrentFrame} from 'remotion';
// Alternate editorial direction: macro UI, authored layers; no raster screenshot.
export function LabStockFocus(){
 const f=useCurrentFrame();const p=(start:number,duration=28)=>interpolate(f,[start,start+duration],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.16,1,.3,1)});
 const phase=f<170?0:f<320?1:2;
 return <AbsoluteFill style={{background:'#172c23',color:'#f0f2e9',fontFamily:'Arial,sans-serif'}}>
 <div style={{position:'absolute',left:110,top:74,fontSize:25,letterSpacing:5}}>JAGAU <span style={{fontSize:14,letterSpacing:2,color:'#94aa9c',marginLeft:24}}>SOFTWARE STUDIES / LABSTOCK</span></div>
 <div style={{position:'absolute',left:112,top:262,width:590}}><div style={{fontSize:18,letterSpacing:3,color:'#a7baab'}}>0{phase+1} / {['SOURCE','LEDGER','REPORT'][phase]}</div><h1 style={{fontSize:91,letterSpacing:-5,lineHeight:1.02,fontWeight:500,margin:'25px 0'}}>{['Start with the source.','Keep every movement.','Report from one record.'][phase]}</h1><p style={{fontSize:26,lineHeight:1.6,color:'#b3c3b6',maxWidth:480}}>Workbook, sheet and row identity stay connected.</p></div>
 <div style={{position:'absolute',left:795,top:190,width:980,height:676,background:'#f5f7f2',borderRadius:19,color:'#1e3027',boxShadow:'0 50px 70px #0005',transform:`perspective(2300px) rotateY(${-8*(1-p(0,90))}deg) translateY(${45*(1-p(0,60))}px)`}}>
 <div style={{padding:'24px 32px',borderBottom:'1px solid #d6dfd4',fontSize:17,display:'flex',justifyContent:'space-between'}}><b>LabStock</b><span style={{color:'#78877a'}}>ILUSTRASI / DATA DEMO</span></div>
 <div style={{padding:42}}><div style={{fontSize:16,letterSpacing:2,color:'#6f8072'}}>OPERASIONAL / {phase===2?'LAPORAN':'MUTASI'}</div><div style={{fontSize:44,letterSpacing:-2,marginTop:17}}>Kapas alkohol</div>
 <div style={{display:'flex',gap:22,marginTop:35}}>{[['MASUK',12],['KELUAR',2],['SALDO',10]].map(([label,n],i)=><div key={label} style={{flex:1,padding:25,border:'1px solid #d6dfd4',borderRadius:10,background:'#fff',opacity:p(30+i*12),translate:`0 ${30*(1-p(30+i*12))}px`}}><div style={{fontSize:14,color:'#708174',letterSpacing:2}}>{label}</div><div style={{fontSize:58,marginTop:15,fontVariantNumeric:'tabular-nums'}}>{Math.round(Number(n)*p(45+i*12,50))}</div></div>)}</div>
 <div style={{marginTop:30,fontSize:18,borderTop:'1px solid #d6dfd4'}}>{['demo.xlsx','Sheet 1','Row 8'].map((v,i)=><div key={v} style={{display:'flex',justifyContent:'space-between',padding:'20px 5px',borderBottom:'1px solid #d6dfd4',opacity:p(110+i*18)}}><span style={{color:'#7b8a7f'}}>{['Workbook','Sheet','Source row'][i]}</span><span>{v}</span></div>)}</div>
 </div></div>
 <div style={{position:'absolute',left:1150,top:780,padding:'30px 40px',border:'1px solid #a8cbb2',borderRadius:12,background:'#e5efdc',color:'#24412e',boxShadow:'0 25px 45px #0003',fontSize:24,opacity:p(230),translate:`0 ${35*(1-p(230))}px`}}>{phase===2?'Ledger → laporan → Excel':'Source identity preserved ↗'}</div>
 <div style={{position:'absolute',left:112,bottom:78,fontSize:16,color:'#8fa697'}}>Reconstructed UI · synthetic demonstration · 16 seconds</div>
 </AbsoluteFill>
}
