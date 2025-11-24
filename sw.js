importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

// Cache CSS
workbox.routing.registerRoute(
  new RegExp('sites/default/files/*\.css$'),
  new workbox.strategies.CacheFirst({
    cacheName: 'css',
  })
);

// Cache JS
workbox.routing.registerRoute(
  new RegExp('sites/default/files/*\.js$'),
  new workbox.strategies.CacheFirst({
    cacheName: 'js',
  })
);

// Cache images
workbox.routing.registerRoute(
  new RegExp('sites/default/files/*\.(png|jpg|gif)$'),
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
  })
);

// Cache fonts
workbox.routing.registerRoute(
  new RegExp('\.woff2$'),
  new workbox.strategies.CacheFirst({
    cacheName: 'fonts',
  })
);


if (navigator.doNotTrack !== "1") {
  workbox.googleAnalytics.initialize();
}
