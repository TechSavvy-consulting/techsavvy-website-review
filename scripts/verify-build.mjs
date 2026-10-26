import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const pagesPreview=process.argv.includes('--pages');
const prefix='/';
const expectedOrigin=pagesPreview?'https://websitenew.techsavvy.consulting':'https://www.techsavvy.consulting';
const dist=path.join(root,pagesPreview?'dist-pages':'dist');
const inventory=JSON.parse(await readFile(path.join(root,'src/data/source-inventory.json'),'utf8'));
const files=[];
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())await walk(full);else files.push(full);}}
await walk(dist);
const generatedRoutes=files.filter(file=>file.endsWith('.html')).map(file=>{const relative=path.relative(dist,file).split(path.sep).join('/');return relative==='index.html'?'/':'/'+relative.replace(/\/index\.html$|\.html$/,'');});
const routes=[...new Set([...inventory.pages.map(p=>p.path),'/thank-you','/404',...generatedRoutes])];
let linkCount=0, formCount=0;
for(const route of routes){
  const file=route==='/'?path.join(dist,'index.html'):path.join(dist,route.slice(1)+(pagesPreview&&route!=='/404'?'/index.html':'.html'));
  const html=await readFile(file,'utf8');
  assert.match(html,/<html[^>]+lang="en"/i,`${route}: document language`);
  assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,`${route}: one H1`);
  assert.match(html,/<meta name="robots" content="noindex,nofollow,noarchive"/i,`${route}: indexing guard`);
  assert.match(html,/<meta name="description" content="[^"]+"/i,`${route}: description`);
  assert.match(html,/<title>[^<]+<\/title>/i,`${route}: title`);
  assert.match(html,/<link rel="canonical" href="https:\/\/www\.techsavvy\.consulting/i,`${route}: canonical`);
  const previewUrl=html.match(/<meta property="og:url" content="([^"]+)"/i)?.[1];
  assert.ok(previewUrl,`${route}: preview URL metadata`);
  assert.equal(new URL(previewUrl).origin,expectedOrigin,`${route}: expected preview origin`);
  assert.equal(new URL(previewUrl).pathname,route,`${route}: root-base preview path`);
  const previewImage=html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1];
  assert.ok(previewImage,`${route}: preview image metadata`);
  assert.equal(new URL(previewImage).origin,expectedOrigin,`${route}: preview image origin`);
  assert.doesNotMatch(html,/techsavvy-consulting\.github\.io|\/techsavvy-website-review(?:[/?#"']|$)/i,`${route}: no obsolete GitHub project URL or base`);
  assert.doesNotMatch(html,/<(?:script|iframe)[^>]+(?:googletagmanager|google-analytics|doubleclick|facebook\.net|youtube\.com\/embed)/i,`${route}: no optional tracking/embed`);
  for(const match of html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)){
    formCount++;
    assert.doesNotMatch(match[1],/\b(action|data-netlify)\s*=/i,`${route}: no submission backend`);
    assert.match(match[2],/submissions are disabled/i,`${route}: review notice`);
    assert.match(match[2],/<button[^>]+disabled/i,`${route}: disabled submit`);
  }
  for(const match of html.matchAll(/(?:href|src|poster)="(\/(?!\/)[^"]*)"/g)){
    const url=new URL(match[1],'https://review.local');
    assert.ok(url.pathname.startsWith(prefix),`${route}: local URL remains inside preview base: ${url.pathname}`);
    const target='/'+decodeURIComponent(url.pathname.slice(prefix.length));
    if(target==='/search-lp'||target==='/home-1')continue;
    const base=path.join(dist,target==='/'?'index.html':target.slice(1));
    let found=false;
    for(const candidate of [base,base+'.html',path.join(base,'index.html')]){try{if((await stat(candidate)).isFile()){found=true;break;}}catch{}}
    assert.ok(found,`${route}: missing internal target ${target}`);
    linkCount++;
  }
  for(const image of html.matchAll(/<img\b([^>]+)>/g))assert.match(image[1],/\balt=/,`${route}: image alt`);
}
assert.equal(formCount,2,'Expected home callback + contact form');
assert.ok(files.some(x=>x.endsWith('techsavvy-introduction.mp4')),'Video is included');
assert.equal(files.some(x=>/-original\./.test(x)),false,'Original oversized assets stay outside public output');
if(pagesPreview){
  assert.ok(files.includes(path.join(dist,'404.html')),'GitHub Pages custom 404 exists');
  assert.ok(files.includes(path.join(dist,'.nojekyll')),'GitHub Pages static artifact marker exists');
  assert.equal(files.some(x=>path.basename(x)==='CNAME'),false,'Custom domain is managed in GitHub Pages settings, not a CNAME file');
}
console.log(`PASS: ${routes.length} pages, ${linkCount} local links/assets, ${formCount} disabled review forms; no optional tracking scripts.`);
console.log(`PASS: expected origin ${expectedOrigin}, root base /, unchanged production canonicals and no obsolete repository-prefix paths.`);
console.log('Production domain, Wix, DNS and advertising are not changed by this verification.');
