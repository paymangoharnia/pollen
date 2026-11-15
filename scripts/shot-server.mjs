// Tiny CORS static server for the submission screenshot upload.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";

const root = new URL("../submissions/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const types = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png" };

createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Private-Network", "true");
  if (req.method === "OPTIONS") { res.end(); return; }
  const file = join(root, req.url === "/" ? "screenshot.jpg" : req.url.replace(/^\//, ""));
  try {
    const data = await readFile(file);
    res.setHeader("Content-Type", types[extname(file)] ?? "application/octet-stream");
    res.end(data);
  } catch {
    res.statusCode = 404;
    res.end("not found");
  }
}).listen(4999, "127.0.0.1", () => console.log("serving on http://127.0.0.1:4999"));
