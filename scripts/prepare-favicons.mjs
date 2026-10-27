import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
// Existing standalone brand mark, not a generated/redrawn approximation.
const source = await readFile(path.join(root, 'assets/originals/techsavvy-head-icon-original.png'));
const sizes = [16, 32, 48, 64, 128, 256];
const images = await Promise.all(sizes.map(size => sharp(source).rotate().resize(size, size, { fit: 'contain', background: '#ffffff' }).flatten({ background: '#ffffff' }).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((bytes, i) => {
  const start = 6 + 16 * i;
  header[start] = sizes[i] === 256 ? 0 : sizes[i];
  header[start + 1] = header[start];
  header.writeUInt16LE(1, start + 4);
  header.writeUInt16LE(32, start + 6);
  header.writeUInt32LE(bytes.length, start + 8);
  header.writeUInt32LE(offset, start + 12);
  offset += bytes.length;
});
await writeFile(path.join(root, 'public/favicon.ico'), Buffer.concat([header, ...images]));
await writeFile(path.join(root, 'public/favicon-32.png'), images[1]);
await sharp(source).rotate().resize(156, 156, { fit: 'contain', background: '#ffffff' }).extend({ top: 12, bottom: 12, left: 12, right: 12, background: '#ffffff' }).flatten({ background: '#ffffff' }).png().toFile(path.join(root, 'public/apple-touch-icon.png'));
// Preserve the existing SVG URL for browsers that cached that icon location.
await writeFile(path.join(root, 'public/favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="white"/><image href="data:image/png;base64,${source.toString('base64')}" x="2" y="1" width="96" height="98" preserveAspectRatio="xMidYMid meet"/></svg>\n`);
console.log('Created head-only multi-size ICO, 32px PNG, 180px Apple icon and compatible SVG from existing brand artwork.');
