import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = path.join(root, 'assets', 'originals');
const output = path.join(root, 'public', 'images');
await mkdir(output, { recursive: true });
const images = [
  ['kyle-server-room-original.png', 'kyle-server-room.webp', 1802, 86],
  ['kyle-hearn-original.png', 'kyle-hearn.webp', 1000, 87],
  ['techsavvy-logo-original.png', 'techsavvy-logo.webp', 608, 95],
  ['blog-windows11-original.jpg', 'blog-windows11.webp', 1200, 84],
  ['blog-switching-original.png', 'blog-switching.webp', 1200, 84],
  ['blog-provider-original.png', 'blog-provider.webp', 1200, 84],
  ['emerge-logo-original.png', 'emerge-logo.webp', 400, 91],
  ['home-video-poster-original.jpg', 'home-video-poster.webp', 900, 83],
];
for (const [input, name, width, quality] of images) {
  const info = await sharp(path.join(source, input)).rotate().resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(path.join(output, name));
  console.log(`${name}: ${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB`);
}
