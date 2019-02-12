workbox.skipWaiting();
workbox.clientsClaim();
workbox.setConfig({
  debug: true
});

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
  workbox.strategies.cacheFirst({
    cacheName: 'google-static',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 4,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  new RegExp('https://api.overwatchleague.com/(?:live-match|v2/standings|schedule)(.*)'),
  workbox.strategies.networkFirst({
    cacheName: 'overwatch-short-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 10,
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  new RegExp('https://api.overwatchleague.com/(?:maps|v2/teams)(.*)'),
  workbox.strategies.cacheFirst({
    cacheName: 'overwatch-long-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 10,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
);

workbox.precaching.precacheAndRoute(self.__precacheManifest);
