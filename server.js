// Lightweight zero-dependency static web server for Hacktivators
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Only these files/folders are public (keeps server.js, README, SQL, tests private)
const PUBLIC_FILES = new Set(['/index.html', '/app-bundle.js']);
const PUBLIC_DIRS = ['/assets/'];

function send(res, code, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(code, { 'Content-Type': type });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let reqPath;
  try {
    reqPath = decodeURIComponent(req.url.split('?')[0]); // malformed URLs no longer crash the server
  } catch {
    return send(res, 400, '400 Bad Request');
  }
  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.normalize(path.join(ROOT, reqPath));
  const insideRoot = filePath === ROOT || filePath.startsWith(ROOT + path.sep);
  const allowed = PUBLIC_FILES.has(reqPath) || PUBLIC_DIRS.some((d) => reqPath.startsWith(d));
  if (!insideRoot || !allowed) return send(res, 404, '404 Not Found');

  fs.readFile(filePath, (err, content) => {
    if (err) {
      return err.code === 'ENOENT' || err.code === 'EISDIR'
        ? send(res, 404, '404 Not Found')
        : send(res, 500, `Server Error: ${err.code}`);
    }
    const type = MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Hacktivators Event Server is running!`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
