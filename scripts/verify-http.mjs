import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base='http://127.0.0.1:4321';
const source=JSON.parse(await readFile(new URL('../src/data/source-inventory.json',import.meta.url),'utf8'));
let pages=0;
for(const route of [...source.pages.map(p=>p.path),'/thank-you','/client-support','/ai-services','/post/protect-business-email-microsoft-365-google-workspace']){
  const response=await fetch(base+route);
  assert.equal(response.status,200,route);
  assert.match(response.headers.get('x-robots-tag')||'',/noindex/,`${route}: HTTP indexing guard`);
  const text=await response.text();
  assert.match(text,/<meta name="robots" content="noindex/,`${route}: HTML indexing guard`);
  assert.equal((text.match(/<h1[\s>]/g)||[]).length,1,`${route}: H1`);
  pages++;
}
for(const [from,to] of [['/search-lp','/contact'],['/home-1','/'],['/contact/','/contact'],['/post/windows11-upgrade-essential/','/post/windows11-upgrade-essential']]){
  const response=await fetch(base+from+'?review=1&source=test',{redirect:'manual'});
  assert.equal(response.status,301,`${from}: permanent redirect`);
  assert.equal(response.headers.get('location'),to+'?review=1&source=test',`${from}: target + query`);
}
assert.equal((await fetch(base+'/this-review-page-does-not-exist')).status,404,'Unknown page stays404');
for(const method of ['POST','PUT','DELETE'])assert.equal((await fetch(base+'/contact',{method})).status,405,`${method}: submissions/writes rejected`);
const video=await fetch(base+'/videos/techsavvy-introduction.mp4',{headers:{Range:'bytes=0-31'}});
assert.equal(video.status,206,'Video supports range playback');
assert.equal((await video.arrayBuffer()).byteLength,32,'Correct video range length');
const home=await (await fetch(base)).text();
assert.match(home,/<a[^>]+aria-current="page"[^>]*>Home<\/a>/,'Home active navigation');
const about=await (await fetch(base+'/about-it-support')).text();
assert.match(about,/<a[^>]+aria-current="page"[^>]*>About<\/a>/,'About active navigation');
console.log(`PASS: ${pages} served pages, noindex headers, redirects/query strings, 404, rejected writes, video range, active navigation.`);
