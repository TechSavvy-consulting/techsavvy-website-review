import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT || 4321);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'application/javascript; charset=utf-8', '.json':'application/json', '.xml':'application/xml; charset=utf-8', '.avif':'image/avif', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.mp4':'video/mp4', '.txt':'text/plain; charset=utf-8', '.woff2':'font/woff2' };
const aliases = { '/search-lp':'/contact', '/home-1':'/' };

const server = http.createServer(async (req, res) => {
  res.setHeader('X-Robots-Tag','noindex, nofollow, noarchive');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
  res.setHeader('Cache-Control','no-store');
  if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405, {Allow:'GET, HEAD'}).end('Review site: submissions are disabled.');return;}
  try {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    const pathname = decodeURIComponent(url.pathname);
    const normalized = pathname.replace(/\/$/,'') || '/';
    if (aliases[normalized]) {res.writeHead(301,{Location:aliases[normalized]+url.search}).end();return;}
    if (pathname !== '/' && pathname.endsWith('/')) {res.writeHead(301,{Location:normalized+url.search}).end();return;}
    const candidates = pathname==='/'?['index.html']:[pathname.slice(1), pathname.slice(1)+'.html', path.join(pathname.slice(1),'index.html')];
    let file;
    for(const candidate of candidates){const resolved=path.resolve(root,candidate);if(!resolved.startsWith(root+path.sep))continue;try{const info=await stat(resolved);if(info.isFile()){file=resolved;break;}}catch{}}
    if(!file){file=path.join(root,'404.html');res.statusCode=404;}
    const body=await readFile(file);
    const type=types[path.extname(file)] || 'application/octet-stream';
    res.setHeader('Content-Type',type);
    if(req.headers.range && type==='video/mp4'){
      const match=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
      if(match){const start=Number(match[1]);const end=match[2]?Math.min(Number(match[2]),body.length-1):body.length-1;if(start<=end&&start<body.length){res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${body.length}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});res.end(req.method==='HEAD'?undefined:body.subarray(start,end+1));return;}}
      res.writeHead(416,{'Content-Range':`bytes */${body.length}`}).end();return;
    }
    res.setHeader('Content-Length',body.length);
    if(type==='video/mp4')res.setHeader('Accept-Ranges','bytes');
    res.end(req.method==='HEAD'?undefined:body);
  }catch{res.writeHead(400).end('Invalid request.');}
});
server.listen(port,'127.0.0.1',()=>console.log(`TechSavvy review: http://127.0.0.1:${port} (local only; no live-site changes)`));
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is already in use. Set PORT to another local port.`:error.message);process.exitCode=1;});
