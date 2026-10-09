import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve(process.env.STATIC_ROOT || "out");
const port = Number(process.env.PORT || 4185);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".m4a": "audio/mp4",
  ".mp4": "video/mp4",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain",
};
const server = createServer(async (req, res) => {
  let target;
  try {
    target = resolve(
      root,
      "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname),
    );
  } catch {
    res.writeHead(400);
    res.end();
    return;
  }
  if (target !== root && !target.startsWith(root + sep)) {
    res.writeHead(403);
    res.end();
    return;
  }
  try {
    if ((await stat(target)).isDirectory())
      target = resolve(target, "index.html");
    const content = await readFile(target);
    res.writeHead(200, {
      "content-type": types[extname(target)] || "application/octet-stream",
    });
    res.end(content);
  } catch {
    res.writeHead(404, { "content-type": "text/html" });
    res.end(await readFile(resolve(root, "404.html")));
  }
});
server.listen(port, "127.0.0.1", () => {
  const address = server.address();
  const actualPort = typeof address === "object" && address ? address.port : port;
  console.log(`Static export: http://127.0.0.1:${actualPort}`);
  process.send?.({ type: "ready", port: actualPort, root });
});
