import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = new URL('https://websitenew.techsavvy.consulting/');
const inventory = JSON.parse(await readFile(new URL('../src/data/source-inventory.json', import.meta.url), 'utf8'));
const routes = [...inventory.pages.map(page => page.path), '/thank-you', '/post/protect-business-email-microsoft-365-google-workspace'];
const assets = new Set();
for (const route of routes) {
  const url = new URL(route === '/' ? './' : `${route.slice(1)}/`, base);
  const response = await fetch(url);
  assert.equal(response.status, 200, `${route}: online response`);
  assert.equal(new URL(response.url).origin, base.origin, `${route}: stays on GitHub preview`);
  assert.equal(new URL(response.url).pathname, url.pathname, `${route}: expected root-base route`);
  const html = await response.text();
  assert.match(html, /<meta name="robots" content="noindex,nofollow,noarchive"/i, `${route}: noindex`);
  assert.match(html, /REVIEW SITE/, `${route}: visible preview notice`);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${route}: one H1`);
  assert.doesNotMatch(html, /<form[^>]+\baction\s*=/i, `${route}: no live form action`);
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
for (const asset of assets) {
  const response = await fetch(asset, { method: 'HEAD' });
  assert.equal(response.status, 200, `Asset: ${asset}`);
  assert.equal(new URL(response.url).origin, base.origin, `Asset stays on test arena: ${asset}`);
}
const missing = await fetch(new URL('this-review-page-does-not-exist/', base));
assert.equal(missing.status, 404, 'Unknown online page is a real 404');
assert.match(await missing.text(), /REVIEW SITE/, 'Custom 404 preserves review notice');
console.log(`PASS: ${routes.length} online pages, ${assets.size} assets, test-arena origin/root base, noindex, inactive form actions and real custom 404.`);
