import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { allPosts, featuredPosts } from '../src/data/blog.ts';

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
let linkCount=0, formCount=0, referenceCount=0;
for(const route of routes){
  const file=route==='/'?path.join(dist,'index.html'):path.join(dist,route.slice(1)+(pagesPreview&&route!=='/404'?'/index.html':'.html'));
  const html=await readFile(file,'utf8');
  assert.match(html,/<html[^>]+lang="en"/i,`${route}: document language`);
  assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,`${route}: one H1`);
  assert.match(html,/<meta name="robots" content="noindex,nofollow,noarchive"/i,`${route}: indexing guard`);
  assert.match(html,/<meta name="techsavvy-revision" content="7"/i,`${route}: current revision`);
  assert.doesNotMatch(html,/<a\b[^>]*href="\/it-collaboration(?:[\/#?"])/i,`${route}: no links to retired Co-managed page`);
  assert.doesNotMatch(html,/co-managed/i,`${route}: retired Co-managed advertising removed`);
  assert.ok(!/virtual CIO|Tech Mentor Technologies|emergency-support-note/i.test(html),`${route}: retired terminology and footer strip`);
  const footer=html.match(/<footer class="site-footer"[\s\S]*?<\/footer>/)?.[0]||'';
  assert.ok(!/Client support &amp; downloads/i.test(footer),`${route}: removed footer download link`);
  assert.doesNotMatch(html,/Design preview only|Forms disabled|REVIEW SITE|Explore all services/i,`${route}: retired visible preview wording and services link`);
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
  for(const note of html.matchAll(/<div class="article-note">\s*<strong>Further reading<\/strong>([\s\S]*?)<\/div>/g)){
    for(const link of note[1].matchAll(/<a\b([^>]+)>/g)){
      referenceCount++;
      assert.match(link[1],/\btarget="_blank"/,`${route}: reference opens in a new tab`);
      assert.match(link[1],/\brel="noopener noreferrer"/,`${route}: reference isolates the new tab`);
      assert.match(link[1],/\baria-label="[^"]+opens in a new tab/,`${route}: accessible new-tab notice`);
    }
  }
  for(const match of html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)){
    formCount++;
    assert.match(match[1],/action="https:\/\/formspree\.io\/f\/mvkkkwyn"/i,`${route}: verified Formspree endpoint only`);
    assert.match(match[1],/method="POST"/i,`${route}: POST submission`);
    assert.match(match[2],/name="_gotcha"/,`${route}: spam honeypot`);
    assert.match(match[2],/name="email"[^>]*required/,`${route}: required email`);
    assert.match(match[2],/name="message"[^>]*required/,`${route}: required message`);
    assert.match(match[2],/data-form-status/,`${route}: submission feedback`);
    assert.match(match[2],/data-form-error/,`${route}: accessible failure feedback`);
    assert.doesNotMatch(match[2],/<button[^>]+disabled/i,`${route}: enabled submit`);
    assert.doesNotMatch(match[2],/type="file"/i,`${route}: no sensitive file uploads`);
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
const htmlFor=async route=>readFile(path.join(dist,route+(pagesPreview?'/index.html':'.html')),'utf8');
const faq=await htmlFor('tulsa-it-faq');
assert.doesNotMatch(faq.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1]||'',/<details\b/,'FAQ answers always visible');
assert.equal((faq.match(/class="faq-answer-card"/g)||[]).length,11,'Eleven visible FAQ answers');
const home=await readFile(path.join(dist,'index.html'),'utf8');
assert.match(home,/Kyle and his team are exceptional\./,'Chris original opening restored');
assert.match(home,/You can’t do better for your IT needs than TechSavvy\./,'Chris final recommendation preserved with approved brand spelling');
assert.doesNotMatch(home,/Tech Savvy/,'Chris brand spelling standardized');
assert.doesNotMatch(home,/On the rare occasion/,'Only requested sentence omitted');
assert.match(home,/href="\/tulsa-it-faq#support-hours"/,'Support asterisk points to existing FAQ explanation');
assert.match(faq,/id="support-hours"/,'Support explanation target exists');
assert.doesNotMatch(home,/Scoped and priced separately by project/,'Homepage project qualifier removed');
const blog=await htmlFor('blog');
const cardPaths=html=>[...html.matchAll(/<a href="([^"]+)" class="blog-card-image"/g)].map(match=>match[1]);
assert.equal(allPosts.length,6,'Six articles including the retained archive');
assert.deepEqual(cardPaths(home),featuredPosts.map(post=>post.path),'Homepage has exactly the newest three articles in order');
assert.deepEqual(cardPaths(blog),allPosts.map(post=>post.path),'Blog index has every article in publication order');
assert.equal(featuredPosts.filter(post=>post.path.includes('practical-ai-workflows')||post.path.includes('it-plan-business-growth')).length,2,'Both new articles featured');
assert.equal(featuredPosts.some(post=>post.date.startsWith('2025-08-07')),false,'August 7 posts retained on archive, not homepage');
const about=await htmlFor('about-it-support');
assert.match(about,/Mentor Technologies in 1998/,'Correct founding business');
assert.match(about,/35\+ states/,'Approved geographic history');
assert.match(about,/kyle-hearn-slate.webp/,'Neutral-gray portrait with subtle slate accent used');
assert.match(about,/Achieved August 2026/,'Fortinet month and year only');
assert.match(about,/Completed June 2026/,'HIPAA month and year only');
assert.match(about,/Completed August 2026/,'Google AI month and year only');
assert.doesNotMatch(about,/Valid through|One-year validity|August 10, 2026|June 5, 2026/i,'Certificate days and validity removed');
assert.doesNotMatch(about,/Computers, servers, networks, cloud services and mobile devices are considered together/,'Removed repetitive About sentence');
const ai=await htmlFor('ai-services');
assert.doesNotMatch(ai,/human review/i,'AI positioning no longer centers human review');
assert.match(ai,/Your existing tools/,'AI hero emphasizes existing tools');
const faqHeadings=[];
for(const route of ['outsourced-managed-it','proactive-it','offsite-backup-recovery','it-support-business-tulsa','ai-services']){
  const html=await htmlFor(route);
  const heading=route==='ai-services'
    ? html.match(/A few useful answers<\/span><h2[^>]*>([\s\S]*?)<\/h2>/)?.[1]
    : html.match(/class="container service-page-faq"[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1];
  assert.ok(heading,`${route}: FAQ introduction exists`);
  faqHeadings.push(heading);
}
assert.equal(new Set(faqHeadings).size,5,'Each remaining service FAQ has a distinct introduction');
assert.doesNotMatch(await htmlFor('english-privacy-policy'),/hosted on GitHub|hosted on Cloudflare/i,'Hosting disclosure does not misstate the pending migration');
const carouselSource=await readFile(path.join(root,'src/components/Testimonials.astro'),'utf8');
assert.match(carouselSource,/sync\(\);\}, 3000\)/,'Three-second browsing interval');
for(const control of ['data-playback','data-next','data-previous','prefers-reduced-motion','focusPaused','document.hidden'])assert.ok(carouselSource.includes(control),`Carousel retains ${control}`);
const support=await htmlFor('client-support');
for(const url of ['https://downloads.level.io/level.msi','https://builds.level.io/stable/level-darwin-bundle-amd64.pkg','https://builds.level.io/stable/level-darwin-bundle-arm64.pkg','https://builds.level.io/stable/level-linux-amd64','https://builds.level.io/stable/level-linux-arm64'])assert.ok(support.includes(url),`Official support download: ${url}`);
assert.doesNotMatch(support,/LEVEL_API_KEY|LEVEL_INSTALL_KEY|levelInstallKey/i,'No enrollment secrets in support page');
for(const route of ['it-support-for-small-business-tulsa','it-collaboration']){
  const retired=await htmlFor(route);
  assert.match(retired,/http-equiv="refresh"/,`${route}: GitHub-compatible redirect`);
  assert.match(retired,/<link rel="canonical" href="https:\/\/www.techsavvy.consulting\/outsourced-managed-it"/,`${route}: canonical points to replacement`);
}
const privacy=await htmlFor('english-privacy-policy');
const privacyMain=privacy.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1]||'';
assert.doesNotMatch(privacyMain,/write to TechSavvy|5840 S Memorial/i,'Privacy postal contact option removed');
assert.match(home,/blog-it-growth-plan-v2.webp/,'New distinct growth-planning illustration used');
for(const [route,html] of [['home',home],['contact',await htmlFor('contact')]]){
  assert.doesNotMatch(html,/Formspree processes this form/i,`${route}: processor sentence removed`);
  const direct=html.match(/class="form-direct-contact"[\s\S]*?<\/div>/)?.[0]||'';
  assert.match(direct,/english-privacy-policy/,`${route}: privacy link in direct-contact row`);
  assert.match(direct,/mailto:sales@techsavvy.consulting/,`${route}: direct email retained`);
}
assert.match(await htmlFor('ai-services'),/priced per project|priced for each project|project-based/i,'AI project pricing distinction');
assert.ok(referenceCount>0,'Further reading links were verified');
assert.ok(files.some(x=>x.endsWith('techsavvy-introduction.mp4')),'Video is included');
assert.equal(files.some(x=>/-original\./.test(x)),false,'Original oversized assets stay outside public output');
if(pagesPreview){
  assert.ok(files.includes(path.join(dist,'404.html')),'GitHub Pages custom 404 exists');
  assert.ok(files.includes(path.join(dist,'.nojekyll')),'GitHub Pages static artifact marker exists');
  assert.equal(files.some(x=>path.basename(x)==='CNAME'),false,'Custom domain is managed in GitHub Pages settings, not a CNAME file');
}
console.log(`PASS: ${routes.length} pages, ${linkCount} local links/assets, ${formCount} configured Formspree forms; no optional tracking scripts.`);
console.log('PASS: revision 7 copy, retired-page redirects/no links, simplified credentials, distinct blog image, contact/privacy layout, three-second carousel and retained form/support workflows.');
console.log(`PASS: expected origin ${expectedOrigin}, root base /, unchanged production canonicals and no obsolete repository-prefix paths.`);
console.log(`PASS: ${referenceCount} Further reading links open safely in a new tab with accessible notices.`);
console.log('Production domain, Wix, DNS and advertising are not changed by this verification.');
