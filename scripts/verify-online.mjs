import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { posts } from '../src/data/blog.ts';
import { defaultSocialImage, defaultSocialImageAlt, socialImageForPost } from '../src/utils/social-image.ts';

const base = new URL('https://websitenew.techsavvy.consulting/');
const inventory = JSON.parse(await readFile(new URL('../src/data/source-inventory.json', import.meta.url), 'utf8'));
const routes = [...new Set([...inventory.pages.map(page => page.path), '/thank-you', '/client-support', '/ai-services', '/managed-it-tulsa', ...posts.map(post=>post.path)])];
const assets = new Set();
const shareAssets = new Set();
const decodeHtml=value=>value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi,entity=>{
  const named={'&amp;':'&','&quot;':'"','&apos;':"'",'&lt;':'<','&gt;':'>'};
  return named[entity] ?? String.fromCodePoint(entity[2].toLowerCase()==='x'?parseInt(entity.slice(3,-1),16):parseInt(entity.slice(2,-1),10));
});
const metaContent=(html,key)=>decodeHtml(html.match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`,'i'))?.[1]||'');
const assertSharing=(html,route)=>{
  const post=posts.find(post=>post.path===route);
  const image=post?socialImageForPost(post):{path:defaultSocialImage,alt:defaultSocialImageAlt};
  const url=new URL(image.path,base).href;
  assert.equal(metaContent(html,'og:image'),url,`${route}: correct sharing image`);
  assert.equal(metaContent(html,'og:image:alt'),image.alt,`${route}: sharing image description`);
  assert.equal(metaContent(html,'og:image:width'),'1200',`${route}: sharing width`);
  assert.equal(metaContent(html,'og:image:height'),'630',`${route}: sharing height`);
  assert.equal(metaContent(html,'og:image:type'),'image/jpeg',`${route}: sharing type`);
  assert.equal(metaContent(html,'twitter:card'),'summary_large_image',`${route}: large-image card`);
  assert.equal(metaContent(html,'twitter:title'),metaContent(html,'og:title'),`${route}: consistent social titles`);
  assert.equal(metaContent(html,'twitter:description'),metaContent(html,'og:description'),`${route}: consistent social descriptions`);
  assert.equal(metaContent(html,'twitter:image'),url,`${route}: Twitter image`);
  assert.equal(metaContent(html,'twitter:image:alt'),image.alt,`${route}: Twitter image description`);
  const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));
  assert.equal(schemas.filter(schema=>schema['@type']==='LocalBusiness').length,1,`${route}: one business entity`);
  assert.equal(schemas.find(schema=>schema['@type']==='LocalBusiness')?.['@id'],'https://www.techsavvy.consulting/#organization',`${route}: stable business entity`);
  assert.equal(schemas.find(schema=>schema['@type']==='LocalBusiness')?.image,new URL(defaultSocialImage,base).href,`${route}: business schema brand image`);
  if(post)assert.equal(schemas.find(schema=>schema['@type']==='BlogPosting')?.image,url,`${route}: article schema image`);
  shareAssets.add(url);
  assets.add(url);
};
assert.equal(new Set(posts.map(post=>socialImageForPost(post).path)).size,posts.length,'Distinct image for every article');
for (const route of routes) {
  const url = new URL(route === '/' ? './' : `${route.slice(1)}/`, base);
  const response = await fetch(url);
  assert.equal(response.status, 200, `${route}: online response`);
  assert.equal(new URL(response.url).origin, base.origin, `${route}: stays on GitHub preview`);
  assert.equal(new URL(response.url).pathname, url.pathname, `${route}: expected root-base route`);
  const html = await response.text();
  assert.match(html, /<meta name="robots" content="noindex,nofollow,noarchive"/i, `${route}: noindex`);
  assert.match(html, /<meta name="techsavvy-revision" content="10"/, `${route}: current revision`);
  assert.doesNotMatch(html, /Design preview only|Forms disabled|REVIEW SITE/i, `${route}: removed visual preview notices`);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${route}: one H1`);
  for(const form of html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)){
    assert.match(form[1],/action="https:\/\/formspree\.io\/f\/mvkkkwyn"/,`${route}: verified form endpoint`);
    const submit=form[2].match(/<button\b[^>]*type="submit"[^>]*>([\s\S]*?)<\/button>/i)?.[1];
    assert.ok(submit,`${route}: submit button exists`);
    assert.doesNotMatch(submit,/↗|<svg\b|aria-hidden/i,`${route}: submit arrow removed`);
    assert.equal(decodeHtml(submit.replace(/<[^>]+>/g,'').trim()),route==='/'?'Request a callback':'Send message',`${route}: approved submit label`);
  }
  if(route==='/')assert.equal(decodeHtml(html.match(/<title>([^<]+)<\/title>/)?.[1]||''),'TechSavvy Consulting | Managed IT & Cybersecurity in Tulsa','Approved homepage title');
  if(route==='/'||route==='/contact')assert.match(html,/Number of users <span class="optional"[^>]*>\(optional\)<\/span>/,`${route}: latest approved label online`);
  if(route==='/proactive-it'){
    for(const text of ['Monthly IT checkups','Weekly updates, tested first','monthly security checks','Weekly updates, monthly IT checkups and ongoing monitoring','Daily monitoring and follow-through'])assert.ok(html.includes(text),`${route}: ${text}`);
    assert.doesNotMatch(html,/quarterly checkups|Quarterly IT checkups|inform our everyday care/i,`${route}: old wording removed`);
  }
  if(route==='/offsite-backup-recovery'){
    for(const text of ['When something goes wrong, your business keeps going.','so recovery is a plan, not a scramble.','Local and offsite copies of your data','Backups monitored by our team','A recovery plan built around your business','Backup protection is part of your managed IT relationship. We design it, run it and check it, so your data is there when you need it.','We start with what matters most','Local backups make everyday restores quick.','Monitored by our team','Tested restores','A recovery plan for your business','including HIPAA where it applies.','A true backup keeps separate, recoverable versions over time','During planning we agree on which systems matter most','Can you review the backups we already have?','then give you a clear, practical recommendation.','How confident are you in your backups?','If you’re not sure your data could be restored today, let’s find out together.'])assert.ok(html.includes(text),`${route}: ${text}`);
    assert.match(html,/<a class="button button-white" href="\/contact">Talk with us about your backups <svg/,`${route}: approved CTA and destination`);
    assert.equal((html.match(/<path d="M4 13l2-5h3"/g)||[]).length,2,`${route}: two new backup-drive icons`);
  }
  if(route==='/ai-services'){
    assert.match(html,/We connect AI with the tools you already use/,`${route}: new process explanation`);
    assert.match(html,/Start with what matters to your business\./,`${route}: new first step`);
  }
  if(route==='/blog')assert.doesNotMatch(html,/All articles, newest first\./,`${route}: removed explanatory note`);
  if(route==='/'){
    const cards=[...html.matchAll(/<article\b[^>]*class="service-card"[^>]*>([\s\S]*?)<\/article>/g)].map(match=>match[1]);
    assert.equal(cards.length,6,'Six homepage service cards online');
    for(const card of cards)assert.doesNotMatch(card,/Learn more|class="text-link"|aria-label="Explore |<button\b/,'Redundant service-card CTAs removed online');
  }
  assertSharing(html,route);
  assert.doesNotMatch(html, /techsavvy-consulting\.github\.io|\/techsavvy-website-review(?:[/?#"']|$)/i, `${route}: no obsolete GitHub project URL or base`);
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.techsavvy\.consulting/i, `${route}: production canonical retained`);
  const previewUrl = html.match(/<meta property="og:url" content="([^"]+)"/i)?.[1];
  assert.ok(previewUrl, `${route}: preview URL metadata`);
  assert.equal(new URL(previewUrl).origin, base.origin, `${route}: preview metadata origin`);
  assert.equal(new URL(previewUrl).pathname, route, `${route}: preview metadata root base`);
  for (const match of html.matchAll(/(?:href|src|poster)="(\/(?!\/)[^"]*)"/g)) {
    const target = new URL(match[1].replaceAll('&amp;', '&'), base);
    assert.ok(target.pathname.startsWith(base.pathname), `${route}: no root-path escape ${target.pathname}`);
    if (/\.[a-z\d]+$/i.test(target.pathname)) assets.add(target.href);
  }
}
assert.equal(shareAssets.size,posts.length+1,'Brand image and every article share image online');
for (const asset of assets) {
  const response = await fetch(asset, { method: 'HEAD' });
  assert.equal(response.status, 200, `Asset: ${asset}`);
  assert.equal(new URL(response.url).origin, base.origin, `Asset stays on test arena: ${asset}`);
  if(shareAssets.has(asset))assert.match(response.headers.get('content-type')||'',/^image\/jpeg(?:;|$)/i,`Share asset served as JPEG: ${asset}`);
}
const missing = await fetch(new URL('this-review-page-does-not-exist/', base));
assert.equal(missing.status, 404, 'Unknown online page is a real 404');
const missingHtml=await missing.text();
assert.match(missingHtml, /Let’s get you/, 'Custom 404 serves helpful navigation');
assert.match(missingHtml, /<meta name="robots" content="noindex,nofollow,noarchive"/i, 'Custom 404 noindex retained');
assert.match(missingHtml, /<meta name="techsavvy-revision" content="10"/, 'Custom 404 current revision');
assertSharing(missingHtml,'/404');
console.log(`PASS: ${routes.length} online pages, ${assets.size} assets including ${shareAssets.size} JPEG share images, revision 10, simplified service cards, retained title/buttons/social metadata, noindex, configured forms and real custom 404.`);
