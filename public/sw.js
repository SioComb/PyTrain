const CACHE_NAME = "pytrain-pwa-v20";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./data/basic-1.js",
  "./data/basic-2.js",
  "./data/practical-1.js",
  "./data/practical-2.js",
  "./data/scope-fix.js",
  "./data/level-scope-audit.js",
  "./data/choice-display-fix.js",
  "./data/stats-dashboard.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

function repairIndexHtml(html) {
  const scripts = '<script src="./data/scope-fix.js"></script><script src="./data/level-scope-audit.js"></script><script src="./data/choice-display-fix.js"></script><script src="./data/stats-dashboard.js"></script>';
  return html
    .replace('id="rankSymbol"', 'id="RankSymbol"')
    .replace('id="rankTitle"', 'id="RankTitle"')
    .replace('id="rankDetail"', 'id="RankDetail"')
    .replace(
      /<script src="\.\/data\/scope-fix\.js"><\/script>(?:<script src="\.\/data\/(?:level-scope-audit|choice-display-fix|stats-dashboard)\.js"><\/script>)*/,
      scripts
    )
    .replace(
      'register("./sw.js",{scope:"./"})',
      'register("./sw.js",{scope:"./",updateViaCache:"none"})'
    )
    .replace(
      /ホーム画面アプリとして起動中です(?:（v\d+）)?。/,
      "ホーム画面アプリとして起動中です（v20）。"
    );
}

async function fetchFresh(request) {
  return fetch(request, { cache: "no-store" });
}

async function cacheFreshAsset(cache, url) {
  const response = await fetchFresh(url);
  if (!response.ok) throw new Error(`Precache failed: ${url} (${response.status})`);

  if (url === "./" || url === "./index.html") {
    const html = repairIndexHtml(await response.text());
    const headers = new Headers(response.headers);
    headers.delete("content-length");
    await cache.put(url, new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers
    }));
    return;
  }

  await cache.put(url, response);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(APP_SHELL.map((url) => cacheFreshAsset(cache, url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();

    const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    await Promise.all(clients.map(async (client) => {
      if (typeof client.navigate !== "function") return;
      try {
        await client.navigate(client.url);
      } catch (error) {
        console.warn("PyTrain client reload failed:", error);
      }
    }));
  })());
});

async function networkFirstIndex(request) {
  try {
    const response = await fetchFresh(request);
    if (!response.ok) throw new Error(`Navigation failed: ${response.status}`);

    const html = repairIndexHtml(await response.text());
    const headers = new Headers(response.headers);
    headers.delete("content-length");
    const repaired = new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers
    });

    const cache = await caches.open(CACHE_NAME);
    await cache.put("./index.html", repaired.clone());
    await cache.put("./", repaired.clone());
    return repaired;
  } catch (error) {
    return (await caches.match("./index.html")) || (await caches.match("./")) || Response.error();
  }
}

async function networkFirstAsset(request) {
  try {
    const response = await fetchFresh(request);
    if (!response || response.status !== 200 || response.type === "opaque") return response;
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
    return response;
  } catch (error) {
    return (await caches.match(request)) || Response.error();
  }
}

async function cacheFirstImage(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  return networkFirstAsset(request);
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstIndex(request));
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.destination === "image") {
    event.respondWith(cacheFirstImage(request));
  } else {
    event.respondWith(networkFirstAsset(request));
  }
});