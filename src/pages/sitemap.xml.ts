import { allPosts } from '../data/blog';
import { servicePages } from '../data/services';

// Production URL inventory prepared for the approved future migration.
// It does not remove preview noindex or submit anything to a search engine.
const paths = [
  '/', '/managed-it-tulsa', '/about-it-support', '/contact', '/blog',
  '/tulsa-it-faq', '/ai-services', '/client-support',
  '/english-privacy-policy', '/accessibility-statement',
  ...servicePages.map(page => page.path),
  ...allPosts.map(post => post.path),
];

export function GET() {
  const urls = [...new Set(paths)].map(path =>
    `  <url><loc>${new URL(path, 'https://www.techsavvy.consulting').href}</loc></url>`
  ).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
