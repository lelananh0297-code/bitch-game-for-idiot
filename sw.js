// English Dino Speaking Challenge service worker.
// Cache names are versioned. Whisper model files are NOT handled here: Transformers.js
// stores them itself in Cache Storage ("transformers-cache"), which this worker never deletes.
const V = { shell: 'dino-shell-v2', lib: 'dino-lib-v1' };
const SHELL = ['./', './english_dino_speaking_challenge.html'];
const PAGE = './english_dino_speaking_challenge.html';

self.addEventListener('install', e => {
  // No catch: if a required file is missing the install fails and the page reports it.
  e.waitUntil(caches.open(V.shell).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))));
  self.skipWaiting();
});

self.addEventListener('activate', e => e.waitUntil((async () => {
  const keep = new Set(Object.values(V));
  for (const k of await caches.keys()) if (k.startsWith('dino-') && !keep.has(k)) await caches.delete(k);
  await self.clients.claim();
})()));

async function store(cache, req, res) {
  if (res && res.ok && (res.type === 'basic' || res.type === 'cors')) await (await caches.open(cache)).put(req, res.clone());
  return res;
}

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  if (url.origin === location.origin) {            // game files: stale-while-revalidate
    e.respondWith((async () => {
      const hit = await caches.match(req, { ignoreSearch: true });
      const net = fetch(req).then(r => store(V.shell, req, r)).catch(() => null);
      if (hit) { e.waitUntil(net); return hit; }
      return (await net) || (req.mode === 'navigate' ? caches.match(PAGE) : Response.error());
    })());
  } else if (url.hostname === 'cdn.jsdelivr.net') { // Transformers.js + ONNX WASM: cache-first
    e.respondWith((async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      return store(V.lib, req, await fetch(req));
    })());
  }                                                 // everything else (Hugging Face): untouched
});
