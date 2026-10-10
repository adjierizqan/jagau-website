import sharp from 'sharp';
import {spawnSync} from 'node:child_process';
import {mkdirSync, readFileSync, writeFileSync, statSync} from 'node:fs';
import {createHash} from 'node:crypto';
mkdirSync('public/motion',{recursive:true});
const media=[];
for(const [id,slug] of [['LabStock','labstock'],['SuhuLog','suhulog'],['BDRS','bdrs'],['LabStockFocus','labstock-focus']]){
 for(const args of [ ['render','motion/index.tsx',id,`public/motion/${slug}.mp4`,'--codec=h264','--crf=22','--concurrency=2'], ['still','motion/index.tsx',id,`public/motion/${slug}.png`,'--frame=330'] ]){
  const r=spawnSync('npx',['--no-install','remotion',...args],{stdio:'inherit'});if(r.status!==0)process.exit(r.status??1);
 }
 await sharp(`public/motion/${slug}.png`).resize(1280).jpeg({quality:85}).toFile(`public/motion/${slug}.jpg`);
 const file=`public/motion/${slug}.mp4`;
 media.push({id,file,bytes:statSync(file).size,sha256:createHash('sha256').update(readFileSync(file)).digest('hex'),width:1920,height:1080,fps:30,frames:480});
}
writeFileSync('public/motion/manifest.json',JSON.stringify(media,null,2));
