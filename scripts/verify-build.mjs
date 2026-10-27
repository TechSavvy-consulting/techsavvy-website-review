import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { allPosts, featuredPosts } from '../src/data/blog.ts';
import { defaultSocialImage, defaultSocialImageAlt, socialImageForPost } from '../src/utils/social-image.ts';
import { deploymentConfig, robotsForRoute } from '../src/utils/deployment.ts';
import { introductionTranscript } from '../src/data/introduction-transcript.ts';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const pagesPreview=process.argv.includes('--pages');
const cloudflarePreview=process.argv.includes('--cloudflare');
const production=process.argv.includes('--production');
assert.ok([pagesPreview,cloudflarePreview,production].filter(Boolean).length<=1,'Choose one artifact target');
const buildEnv={...process.env,PREVIEW_PLATFORM:pagesPreview?'github-pages':cloudflarePreview?'cloudflare-workers':production?'cloudflare-production':'local'};
const deployment=deploymentConfig(buildEnv);
const prefix='/';
const expectedOrigin=deployment.site;
const dist=path.resolve(root,deployment.outDir);
const inventory=JSON.parse(await readFile(path.join(root,'src/data/source-inventory.json'),'utf8'));
const files=[];
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())await walk(full);else files.push(full);}}
await walk(dist);
const generatedRoutes=files.filter(file=>file.endsWith('.html')).map(file=>{const relative=path.relative(dist,file).split(path.sep).join('/');return relative==='index.html'?'/':'/'+relative.replace(/\/index\.html$|\.html$/,'');});
const routes=[...new Set([...inventory.pages.map(p=>p.path),'/thank-you','/404',...generatedRoutes])];
const shareImages=new Set();
const decodeHtml=value=>value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi,entity=>{
  const named={'&amp;':'&','&quot;':'"','&apos;':"'",'&lt;':'<','&gt;':'>'};
  return named[entity] ?? String.fromCodePoint(entity[2].toLowerCase()==='x'?parseInt(entity.slice(3,-1),16):parseInt(entity.slice(2,-1),10));
});
const metaContent=(html,key)=>decodeHtml(html.match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`,'i'))?.[1]||'');
assert.equal(new Set(allPosts.map(post=>socialImageForPost(post).path)).size,allPosts.length,'Each article has its own stable sharing image');
let linkCount=0, formCount=0, referenceCount=0;
for(const route of routes){
  const file=route==='/'?path.join(dist,'index.html'):path.join(dist,route.slice(1)+(pagesPreview&&route!=='/404'?'/index.html':'.html'));
  const html=await readFile(file,'utf8');
  assert.match(html,/<html[^>]+lang="en"/i,`${route}: document language`);
  assert.match(html,/<link rel="icon" href="\/favicon.ico"/,`${route}: head-only ICO icon`);
  assert.match(html,/<link rel="apple-touch-icon" href="\/apple-touch-icon.png"/,`${route}: head-only Apple icon`);
  assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,`${route}: one H1`);
  assert.equal(metaContent(html,'robots'),robotsForRoute(route,buildEnv),`${route}: target-specific indexing guard`);
  assert.match(html,/<meta name="techsavvy-revision" content="10"/i,`${route}: current revision`);
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
  const post=allPosts.find(post=>post.path===route);
  const expectedImage=post?socialImageForPost(post):{path:defaultSocialImage,alt:defaultSocialImageAlt};
  assert.equal(previewImage,new URL(expectedImage.path,expectedOrigin).href,`${route}: correct branded or article-specific image`);
  assert.equal(metaContent(html,'og:image:alt'),expectedImage.alt,`${route}: accurate sharing image description`);
  assert.equal(metaContent(html,'og:image:width'),'1200',`${route}: sharing image width metadata`);
  assert.equal(metaContent(html,'og:image:height'),'630',`${route}: sharing image height metadata`);
  assert.equal(metaContent(html,'og:image:type'),'image/jpeg',`${route}: sharing image type metadata`);
  assert.equal(metaContent(html,'twitter:card'),'summary_large_image',`${route}: large-image social card`);
  assert.equal(metaContent(html,'twitter:title'),metaContent(html,'og:title'),`${route}: consistent social titles`);
  assert.equal(metaContent(html,'twitter:description'),metaContent(html,'og:description'),`${route}: consistent social descriptions`);
  assert.equal(metaContent(html,'twitter:image'),previewImage,`${route}: consistent social images`);
  assert.equal(metaContent(html,'twitter:image:alt'),expectedImage.alt,`${route}: Twitter image description`);
  shareImages.add(expectedImage.path);
  const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));
  assert.equal(schemas.filter(schema=>schema['@type']==='LocalBusiness').length,1,`${route}: one business schema`);
  assert.equal(schemas.some(schema=>schema['@type']==='ProfessionalService'),false,`${route}: deprecated business type removed`);
  assert.equal(schemas.find(schema=>schema['@type']==='LocalBusiness')?.['@id'],'https://www.techsavvy.consulting/#organization',`${route}: stable business identity`);
  assert.equal(schemas.find(schema=>schema['@type']==='LocalBusiness')?.image,new URL(defaultSocialImage,expectedOrigin).href,`${route}: business schema always uses brand image`);
  if(post){
    assert.equal(schemas.find(schema=>schema['@type']==='BlogPosting')?.image,previewImage,`${route}: article schema uses article image`);
    assert.equal(schemas.find(schema=>schema['@type']==='BlogPosting')?.publisher?.['@id'],'https://www.techsavvy.consulting/#organization',`${route}: publisher references existing business`);
  }
  assert.doesNotMatch(html,/techsavvy-consulting\.github\.io|\/techsavvy-website-review(?:[/?#"']|$)/i,`${route}: no obsolete GitHub project URL or base`);
  assert.doesNotMatch(html,/<(?:script|iframe)[^>]+(?:googletagmanager|google-analytics|doubleclick|facebook\.net|cloudflareinsights|data-cf-beacon|youtube\.com\/embed)/i,`${route}: no optional tracking/embed in artifact; live browser check also required`);
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
    const submit=match[2].match(/<button\b[^>]*type="submit"[^>]*>([\s\S]*?)<\/button>/i)?.[1];
    assert.ok(submit,`${route}: submit button exists`);
    assert.doesNotMatch(submit,/↗|<svg\b|aria-hidden/i,`${route}: submit button has no decorative arrow`);
    assert.equal(decodeHtml(submit.replace(/<[^>]+>/g,'').trim()),route==='/'?'Request a callback':'Send message',`${route}: approved submit label`);
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
assert.equal(shareImages.size,allPosts.length+1,'One default brand image and six article images');
for(const imagePath of shareImages){
  const metadata=await sharp(path.join(dist,imagePath.slice(1))).metadata();
  assert.equal(metadata.format,'jpeg',`${imagePath}: actual JPEG format`);
  assert.equal(metadata.width,1200,`${imagePath}: actual 1200px width`);
  assert.equal(metadata.height,630,`${imagePath}: actual 630px height`);
}
assert.equal(formCount,3,'Expected home callback + contact + paid landing form');
const htmlFor=async route=>readFile(path.join(dist,route+(pagesPreview?'/index.html':'.html')),'utf8');
const faq=await htmlFor('tulsa-it-faq');
assert.doesNotMatch(faq.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1]||'',/<details\b/,'FAQ answers always visible');
assert.equal((faq.match(/class="faq-answer-card"/g)||[]).length,12,'Twelve visible FAQ answers');
assert.match(faq,/Do you offer hourly or one-time support\?/,'Approved hourly-support question');
assert.ok(faq.includes('For existing managed clients, we also offer hourly assistance and separately priced projects—including additional staff support, AI services and other work outside the managed agreement.'),'Existing managed-client exception is explicit');
const home=await readFile(path.join(dist,'index.html'),'utf8');
const homepageServices=[...home.matchAll(/<article\b[^>]*class="service-card"[^>]*>([\s\S]*?)<\/article>/g)].map(match=>match[1]);
assert.equal(homepageServices.length,6,'All six homepage service cards retained');
for(const card of homepageServices){
  assert.match(card,/<h3\b[^>]*>\s*<a\b/,'Service heading link retained');
  assert.match(card,/<p\b/,'Service description retained');
  assert.doesNotMatch(card,/Learn more|class="text-link"|aria-label="Explore |<button\b/,'No redundant service-card CTA');
}
assert.equal(decodeHtml(home.match(/<title>([^<]+)<\/title>/)?.[1]||''),'TechSavvy Consulting | Managed IT & Cybersecurity in Tulsa','Approved homepage search/browser title');
assert.match(home.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]||'',/^Your IT department\.<br\b[^>]*><em\b[^>]*>Your growth partner\.<\/em>$/,'Visible homepage headline unchanged');
assert.match(home,/Kyle and his team are exceptional\./,'Chris original opening restored');
assert.match(home,/You can’t do better for your IT needs than TechSavvy\./,'Chris final recommendation preserved with approved brand spelling');
assert.doesNotMatch(home,/Tech Savvy/,'Chris brand spelling standardized');
assert.doesNotMatch(home,/On the rare occasion/,'Only requested sentence omitted');
assert.match(home,/href="\/tulsa-it-faq#support-hours"/,'Support asterisk points to existing FAQ explanation');
assert.match(faq,/id="support-hours"/,'Support explanation target exists');
assert.doesNotMatch(home,/Scoped and priced separately by project/,'Homepage project qualifier removed');
const blog=await htmlFor('blog');
assert.doesNotMatch(blog,/All articles, newest first\.|Cards show original publication dates; refreshed articles/,'Removed blog explanation');
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
assert.match(ai,/We connect AI with the tools you already use to simplify everyday work/,'AI process introduction clarified');
assert.match(ai,/Start with what matters to your business\./,'AI first step clarified');
assert.doesNotMatch(ai,/We bring the technical help\.|Find a useful starting point\./,'Superseded AI process copy removed');
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
const proactive=await htmlFor('proactive-it');
assert.doesNotMatch(proactive,/quarterly checkups|Quarterly IT checkups|inform our everyday care/i,'Proactive quarterly and unclear security copy removed');
for(const text of ['Monthly IT checkups','Weekly updates, tested first','monthly security checks','Weekly updates, monthly IT checkups and ongoing monitoring','Daily monitoring and follow-through'])assert.ok(proactive.includes(text),`Proactive service cadence: ${text}`);
const backup=await htmlFor('offsite-backup-recovery');
for(const text of [
  'When something goes wrong, your business keeps going.',
  'Hardware fails. Files get deleted. Ransomware happens. We protect the data your business depends on, monitor your backups and test restores, so recovery is a plan, not a scramble.',
  'Local and offsite copies of your data','Backups monitored by our team','A recovery plan built around your business',
  'Backup protection and recovery','Protect your data. Plan your recovery.',
  'Backup protection is part of your managed IT relationship. We design it, run it and check it, so your data is there when you need it.',
  'We start with what matters most','We work with you to identify your critical systems and data, then set backup schedules, retention and responsibilities around them.',
  'Local and offsite copies','Local backups make everyday restores quick. Offsite copies protect you from hardware failure, ransomware, fire and theft.',
  'Monitored by our team','We review backup results, investigate warnings and failures, and resolve problems before they put your data at risk.',
  'Tested restores','We test restores and recovery steps, document the results and fix any gaps before you ever need them.',
  'A recovery plan for your business','Together we decide which systems come back first, so your people can get back to work with as little downtime as possible.',
  'Security and retention','Encryption, access controls, separated storage and retention settings that fit your data and your compliance needs, including HIPAA where it applies.',
  'Is cloud sync the same as a backup?','No. Services like OneDrive, Google Drive and Dropbox sync changes to every device, including accidental deletions and files encrypted by ransomware. A true backup keeps separate, recoverable versions over time, with retention, access controls and tested restores.',
  'How quickly could we recover?','It depends on what fails. A deleted file can usually be restored quickly; rebuilding a failed server takes longer. During planning we agree on which systems matter most and test recovery against those priorities, so you know what to expect before anything goes wrong.',
  'Can you review the backups we already have?','Yes. We’ll look at what’s covered, recent backup results, retention and whether restores have actually been tested, then give you a clear, practical recommendation.',
  'How confident are you in your backups?','If you’re not sure your data could be restored today, let’s find out together.',
])assert.ok(backup.includes(text),`Approved backup copy: ${text}`);
assert.match(backup,/<a class="button button-white" href="\/contact">Talk with us about your backups <svg/,'Backup CTA retains Contact destination and arrow');
assert.equal((backup.match(/<path d="M4 13l2-5h3"/g)||[]).length,2,'Both requested Backup hero icons use the backup-drive symbol');
assert.equal((backup.match(/<details class="faq-item">/g)||[]).length,3,'Backup retains three collapsible FAQs');
assert.match(proactive,/<a class="button button-white" href="\/contact">Let’s talk about your IT <svg/,'Other service CTAs retain their default label');
assert.doesNotMatch(backup,/Business-led recovery priorities|IT that supports your next step\.|Your people\. Your systems\. Your goals\.|Connect everyday IT care with the priorities|Balance recovery speed, storage locations/,'Generic backup copy removed');
const hostedOnCloudflare=process.env.SITE_HOSTING==='cloudflare';
assert.match(await htmlFor('english-privacy-policy'),hostedOnCloudflare?/Cloudflare provides website hosting and delivery for this website/:/Cloudflare is the selected hosting and delivery provider for the planned production launch/,'Privacy matches the actual build hosting target');
assert.match(await htmlFor('accessibility-statement'),hostedOnCloudflare?/The website is hosted on Cloudflare/:/Production hosting is planned on Cloudflare/,'Accessibility matches the actual build hosting target');
const carouselSource=await readFile(path.join(root,'src/components/Testimonials.astro'),'utf8');
assert.match(carouselSource,/sync\(\);\}, 8000\)/,'Eight-second browsing interval');
for(const control of ['data-playback','data-next','data-previous','prefers-reduced-motion',':focus-visible','document.hidden'])assert.ok(carouselSource.includes(control),`Carousel retains ${control}`);
assert.doesNotMatch(carouselSource,/\bhovered\b|\bfocusPaused\b|addEventListener\('mouse(?:enter|leave)'/,'No hidden hover/focus suspension state');
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
  assert.match(html,/Number of users <span class="optional"[^>]*>\(optional\)<\/span>/,`${route}: final approved user-count label`);
  assert.doesNotMatch(html,/Approximate number of users|#device users|# computer\/device users/,`${route}: superseded field labels absent`);
  assert.doesNotMatch(html,/Formspree processes this form/i,`${route}: processor sentence removed`);
  const direct=html.match(/class="form-direct-contact"[\s\S]*?<\/div>/)?.[0]||'';
  assert.match(direct,/english-privacy-policy/,`${route}: privacy link in direct-contact row`);
  assert.match(direct,/mailto:sales@techsavvy.consulting/,`${route}: direct email retained`);
}
for(const route of ['english-privacy-policy','accessibility-statement']){
  const html=await htmlFor(route);
  const main=html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1]||'';
  assert.doesNotMatch(main,/\bWix\b|\bGitHub\b/i,`${route}: no obsolete hosting provider references`);
}
const landing=await htmlFor('managed-it-tulsa');
const thankYou=await htmlFor('thank-you');
assert.match(thankYou,/Thanks for reaching out\./,'Warm thank-you headline');
assert.match(thankYou,/We’re glad you did\./,'Approved welcoming message');
assert.match(thankYou,/data-submission-confirmation[^>]*hidden/,'Direct visits do not falsely confirm a submission');
assert.match(thankYou,/kyle-hearn-neutral.webp/,'Existing approved portrait reused');
assert.doesNotMatch(thankYou,/confirmed on the contact form itself/,'Obsolete confirmation explanation removed');
assert.match(thankYou,/Return to our homepage/,'Useful home link');
assert.match(thankYou,/href="tel:\+19184002424"/,'Clickable direct-contact fallback');
for(const route of ['/','contact','managed-it-tulsa']) {
  const html=route==='/'?home:await htmlFor(route);
  assert.match(html,/data-success-url="\/thank-you"/,`${route}: same-site successful-submission destination`);
}
assert.match(landing,/<link rel="canonical" href="https:\/\/www\.techsavvy\.consulting\/managed-it-tulsa"/, 'Paid landing preserves its production canonical');
assert.doesNotMatch(landing,/<iframe\b|https?:\/\/[^"'<>\s]*(?:wixstatic|filesusr|parastorage|wix\.com)/i,'Paid landing no longer depends on Wix embeds or assets');
const landingForm=landing.match(/<form\b[^>]*>([\s\S]*?)<\/form>/)?.[1]||'';
assert.match(landingForm,/name="form-location" value="managed-it-tulsa-form"/,'Paid landing location identifier retained for manual qualification');
assert.doesNotMatch(landingForm,/name="(?:user-count|on-site-servers|preferred-date|preferred-time)"/,'Paid landing preserves its original five inquiry fields');
const sitemap=await readFile(path.join(dist,'sitemap.xml'),'utf8');
assert.match(sitemap,/<loc>https:\/\/www.techsavvy.consulting\/managed-it-tulsa<\/loc>/,'Production sitemap includes ad landing page');
assert.doesNotMatch(sitemap,/websitenew|github|\/thank-you|\/404|\/it-collaboration|\/it-support-for-small-business-tulsa|\/home-1|\/search-lp/,'Sitemap contains production content routes only');
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
console.log('PASS: revision 10 retains the simplified homepage cards, title, form buttons, seven sharing images and schemas.');
console.log('PASS: retired-page redirects/no links, credentials, distinct blog image, contact/privacy layout, eight-second carousel and retained form/support workflows.');
console.log(`PASS: expected origin ${expectedOrigin}, root base /, unchanged production canonicals and no obsolete repository-prefix paths.`);
console.log(`PASS: ${referenceCount} Further reading links open safely in a new tab with accessible notices.`);
console.log('Production domain, Wix, DNS and advertising are not changed by this verification.');
const vtt=await readFile(path.join(dist,'videos/techsavvy-introduction.en.vtt'),'utf8');
assert.ok(vtt.startsWith('WEBVTT'));
const cues=vtt.trim().split(/\r?\n\r?\n/).slice(1).map(block=>block.split(/\r?\n/));
const seconds=value=>value.split(':').reduce((total,part)=>total*60+Number(part),0);
let previousEnd=0;
for(const [timing,...lines] of cues){
  const [start,end]=timing.split(' --> ').map(seconds);
  assert.ok(start>=previousEnd && end>start && end<=82.154,'Caption times fit unchanged video without overlaps');
  assert.ok(lines.length<=2 && lines.every(line=>line.length<=42),'Readable caption lines');
  previousEnd=end;
}
const normalize=value=>value.replace(/[^\p{L}\p{N}]+/gu,' ').trim().toLowerCase();
assert.equal(normalize(cues.flatMap(cue=>cue.slice(1)).join(' ')),normalize(introductionTranscript.join(' ')),'Captions and visible transcript have identical spoken words');
assert.match(home,/<track kind="captions" src="\/videos\/techsavvy-introduction.en.vtt" srclang="en" label="English"/);
assert.match(home,/<details class="video-transcript"[^>]*>/);
assert.doesNotMatch(home,/<details class="video-transcript"[^>]*\bopen\b/,'Transcript starts collapsed');
const ico=await readFile(path.join(dist,'favicon.ico'));
assert.equal(ico.readUInt16LE(2),1,'ICO image type');
assert.equal(ico.readUInt16LE(4),6,'Six icon resolutions');
for(const [index,size] of [16,32,48,64,128,256].entries()){
  const entry=6+index*16;
  assert.equal(ico[entry]||256,size);
  const length=ico.readUInt32LE(entry+8),offset=ico.readUInt32LE(entry+12);
  const frame=await sharp(ico.subarray(offset,offset+length)).metadata();
  assert.equal(frame.width,size); assert.equal(frame.height,size);
}
const apple=await sharp(path.join(dist,'apple-touch-icon.png')).metadata();
assert.equal(apple.width,180); assert.equal(apple.height,180);
console.log(`PASS: head-only icons on every page; ${cues.length} timed captions match the collapsed transcript.`);
