import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
let commit=process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA;
if(!commit){try{commit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}catch{commit='local-unversioned';}}
writeFileSync('public/review-revision.json',JSON.stringify({commit})+'\n');
