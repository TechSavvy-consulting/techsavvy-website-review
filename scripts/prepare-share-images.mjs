import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { posts } from '../src/data/blog.ts';

// Optimize the approved photographic concept; preserve its original in assets/.
// All existing page images stay unchanged. Only dedicated sharing derivatives
// are written; articles use contain sizing so faces and text are not cropped.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'public/images/share');
await mkdir(output, { recursive: true });
await sharp(path.join(root, 'assets/originals/techsavvy-sharing-tulsa-v8-original.png'))
  .resize(1200, 630, { fit: 'contain', background: '#14324d' })
  .flatten({ background: '#14324d' })
  .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
  .toFile(path.join(output, 'techsavvy-brand-v8.jpg'));
console.log('techsavvy-brand-v8.jpg: 1200 × 630');

for (const post of posts) {
  const name = `${post.path.split('/').at(-1)}.jpg`;
  const result = await sharp(path.join(root, 'public', post.image.slice(1)))
    .resize(1200, 630, { fit: 'contain', background: '#edf4f8' })
    .flatten({ background: '#edf4f8' })
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
    .toFile(path.join(output, name));
  console.log(`${name}: ${result.width} × ${result.height}, ${Math.round(result.size / 1024)} KB`);
}
