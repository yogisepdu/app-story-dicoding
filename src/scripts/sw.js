import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import CONFIG from "./config";

// Do precaching
precacheAndRoute(self.__WB_MANIFEST);
console.log("✅ Precache manifest injected.");

// Runtime caching
registerRoute(
  ({ url }) =>
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: "google-fonts",
  })
);

registerRoute(
  ({ url }) => {
    return (
      url.origin === "https://cdnjs.cloudflare.com" ||
      url.origin.includes("fontawesome")
    );
  },
  new CacheFirst({
    cacheName: "fontawesome",
  })
);
registerRoute(
  ({ url }) => {
    return url.origin === "https://ui-avatars.com";
  },
  new CacheFirst({
    cacheName: "avatars-api",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return baseUrl.origin === url.origin && request.destination !== "image";
  },
  new NetworkFirst({
    cacheName: "citycare-api",
  })
);
registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return baseUrl.origin === url.origin && request.destination === "image";
  },
  new StaleWhileRevalidate({
    cacheName: "citycare-api-images",
  })
);
registerRoute(
  ({ url }) => url.hostname.includes("tile.openstreetmap.org"),
  new CacheFirst({
    cacheName: "osm-tiles",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

self.addEventListener("push", (event) => {
  console.log("Service worker push event received.");

  let payload = {
    title: "Ada Notifikasi Baru!",
    body: "Klik untuk membuka aplikasi.",
    url: "/",
    options: {
      icon: "favicon.png",
      badge: "favicon.png",
    },
  };

  if (event.data) {
    try {
      const data = event.data.json();
      console.log("Push event data JSON:", data);

      payload.title = data.title || payload.title;
      payload.body =
        (data.options && data.options.body) || data.body || payload.body;
      payload.url = data.url || payload.url;

      payload.options = {
        ...payload.options,
        ...(data.options || {}),
      };
    } catch (e) {
      const textData = event.data.text();
      console.warn("Payload bukan JSON, menggunakan teks biasa atau default.");
      console.log("Payload teks:", textData);

      payload.body = textData || payload.body;
    }
  }

  const options = {
    ...payload.options,
    body: payload.body,
    data: payload.url,
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
