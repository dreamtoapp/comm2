if (!self.define) {
  let s,
    a = {};
  const e = (e, i) => (
    (e = new URL(e + '.js', i).href),
    a[e] ||
      new Promise((a) => {
        if ('document' in self) {
          const s = document.createElement('script');
          (s.src = e), (s.onload = a), document.head.appendChild(s);
        } else (s = e), importScripts(e), a();
      }).then(() => {
        let s = a[e];
        if (!s) throw new Error(`Module ${e} didn’t register its module`);
        return s;
      })
  );
  self.define = (i, n) => {
    const c = s || ('document' in self ? document.currentScript.src : '') || location.href;
    if (a[c]) return;
    let t = {};
    const r = (s) => e(s, c),
      x = { module: { uri: c }, exports: t, require: r };
    a[c] = Promise.all(i.map((s) => x[s] || r(s))).then((s) => (n(...s), t));
  };
}
define(['./workbox-3c9d0171'], function (s) {
  'use strict';
  importScripts(),
    self.skipWaiting(),
    s.clientsClaim(),
    s.precacheAndRoute(
      [
        { url: '/_next/static/chunks/139-d1b6e03f79d5efc5.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/1504-d633837491116564.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/1652a8c9.f44f952cb65059ec.js', revision: 'f44f952cb65059ec' },
        {
          url: '/_next/static/chunks/1a685741-48308bc82ebbf56a.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        { url: '/_next/static/chunks/2452-41aa4fcb3fdf9c00.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/2872-acdfde49025444f1.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/3125-2869118e2c3a1b23.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/3247-b7f75f213831fda2.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/3547-bde5a67c1b6e13e1.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/3604-5d5a7b9dcc100d2c.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/3614-56e7aea15f02806a.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/4252-5c7a8b4491801f45.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/4426-270a8258f31bd1a9.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        {
          url: '/_next/static/chunks/452e1f16-bb2282847ca91173.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        { url: '/_next/static/chunks/4700-2a4c155ee757f265.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/4785-2afa89b59ea4f827.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/4897-09118f3a23af6e2f.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/4999.f4bcef962972f566.js', revision: 'f4bcef962972f566' },
        { url: '/_next/static/chunks/5302-e971d40c026c711e.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/6574-58209cadaf2dfb06.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/7272-6f5f1df91a856c1d.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/7291-4e494437f8b857f0.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/7391-00d34276d1cf8d94.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/7436-e13261e5c886173b.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/7920-bc74ce7079a9b80a.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/8267-653d01073dc6f276.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/836-750233c1dbfa26fb.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/8409-ddf5f73f8211087b.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/8514-ba45562d4a81faea.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/8526.6fd255f08f23644e.js', revision: '6fd255f08f23644e' },
        { url: '/_next/static/chunks/8559-2921d42cf90ad1ae.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/8610.ccbb55c591f8a1c6.js', revision: 'ccbb55c591f8a1c6' },
        { url: '/_next/static/chunks/9140-9652ffcfbbc8d834.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/9201-df175ddfc9d84537.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/9289-ce45748dc1f77593.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        {
          url: '/_next/static/chunks/931527f8-f706ffa1b823e50d.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        { url: '/_next/static/chunks/9475-fb4c3d4f016b7372.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        { url: '/_next/static/chunks/9781.b50bee3181029a22.js', revision: 'b50bee3181029a22' },
        { url: '/_next/static/chunks/983-2838e9ee55669885.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        {
          url: '/_next/static/chunks/app/(e-comm)/about/page-2403f2eecc18eb86.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/(e-comm)/cart/page-a5b4b2b3d9067937.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/(e-comm)/checkout/page-c407e9c89c41dbe1.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/(e-comm)/contact/page-247b985f42d3ecc8.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/(e-comm)/happyorder/page-8a23c2701d63e550.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/(e-comm)/layout-d9eaa118a576f17a.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/(e-comm)/loading-9802ec50ec29e1a1.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/(e-comm)/offers/page-26ce6575cca3d1b8.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/(e-comm)/page-aed3ef79ea7d466f.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-9882d422089e52db.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/dashboard/(dashboard)/page-8f5d17339067fe71.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/dashboard/clientnews/page-43f8fb677de74f1c.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/dashboard/clientsubmission/page-ffd86664723e0c09.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/dashboard/drivers/page-8050c85f9ca362ec.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/dashboard/layout-08563a2f5408c0b0.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/dashboard/porductmangment/itemdetail/%5Bid%5D/page-94602fd44676a220.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/dashboard/porductmangment/page-c58cab55dad9027a.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/dashboard/products/page-324e43f266c607c8.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/dashboard/promotions/page-2f0d0c8c0ae43ef2.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/dashboard/promotions/showalloffers/page-7e10661815d72098.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/dashboard/rulesandcondtions/page-e95dece2209ebd2f.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/dashboard/setting/page-4a961ccd6e980128.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/dashboard/shifts/page-36c9ab5ac9b1087e.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/dashboard/ship-order/%5Bid%5D/page-587e18e4d7b98e31.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/dashboard/show-invoice/%5Binvoiceid%5D/page-fd47a38df78a860a.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/dashboard/suppliers/page-6f05fc5d6068477b.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/dashboard/users/page-1ad1c6e0b32fd44c.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/driver-trip/driver/page-1b91d621721d6e41.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/driver-trip/page-b7644ee73673ee1f.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/khalidnadish/add/page-9d0f0a12d6f6e7f2.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/khalidnadish/page-1845d5d5ba5f9827.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/layout-0d3a241dc9d9bc2d.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/app/underconstraction/page-6a352cd6a8b72dbd.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/b6343bc1-6bea77aecce4dc3a.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        { url: '/_next/static/chunks/c132bf7d.2ce17e7a0532128e.js', revision: '2ce17e7a0532128e' },
        {
          url: '/_next/static/chunks/e2cc9d4a-9bc97d273cdffeab.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/eeb5748c-d2e561a93c9fba3b.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/framework-c62348b5cd8eb574.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/main-app-884eb2d074ece4ec.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        { url: '/_next/static/chunks/main-ea5ee824e575b15b.js', revision: 'xax-9Qa0s9pAibE97yLJz' },
        {
          url: '/_next/static/chunks/pages/_app-54c02b7cec3ed285.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/pages/_error-e1ecc9ae3e170583.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-568905e28171dbd1.js',
          revision: 'xax-9Qa0s9pAibE97yLJz',
        },
        { url: '/_next/static/css/9c4b54664c08fbfb.css', revision: '9c4b54664c08fbfb' },
        { url: '/_next/static/css/a93684e8c61f4a91.css', revision: 'a93684e8c61f4a91' },
        {
          url: '/_next/static/xax-9Qa0s9pAibE97yLJz/_buildManifest.js',
          revision: 'f399cf8b30a93593de68d3be1f794d83',
        },
        {
          url: '/_next/static/xax-9Qa0s9pAibE97yLJz/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/apple-icon.png', revision: '01eb64438dc888fbc627514d596a31c3' },
        { url: '/assets/logo.png', revision: 'bb50ab589b78d1bb1c13bca7de302329' },
        { url: '/assets/pdflogo.jpg', revision: '435ab4c629cca6ae612aa236a8f0878f' },
        { url: '/assets/pwa-image.png', revision: '4761dce737e6407c27c01b21f221ebc2' },
        { url: '/company/eidoffer.webp', revision: 'a87355ba6fb59aa0edd8035adb91eaf5' },
        { url: '/company/nofa.webp', revision: 'ca957e3081b06ddd3b8c7de583c0e597' },
        { url: '/company/ramadanoffer.webp', revision: 'b7aa32fc1f265ed46eb5413f4458f249' },
        { url: '/company/safa.webp', revision: 'f0dd11ba66faca8e3d440a95e770f131' },
        { url: '/fallback/pdflogo.jpg', revision: '435ab4c629cca6ae612aa236a8f0878f' },
        { url: '/file.svg', revision: 'd09f95206c3fa0bb9bd9fefabfd0ea71' },
        { url: '/globe.svg', revision: '2aaafa6a49b6563925fe440891e32717' },
        { url: '/icon.png', revision: '668a643215960f8b0a7cb26656f16a01' },
        { url: '/icon.svg', revision: 'c1186b1fb81f85d761c3f0a3b1ec3130' },
        { url: '/icons/icon-192x192.png', revision: 'a1e57cd30184ae016c2a01ac8c86eb44' },
        { url: '/icons/icon-512x512.png', revision: 'f6c0f0cc34a305fbc60a7d33d72aee34' },
        { url: '/manifest.json', revision: '2d044a5254126efb98db2769a5c7566d' },
        { url: '/next.svg', revision: '8e061864f388b47f33a1c3780831193e' },
        { url: '/vercel.svg', revision: 'c0af2f507b369b085b35ef4bbe3bcf1e' },
        { url: '/window.svg', revision: 'a2760511c65806022ad20adf74370ff3' },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
    ),
    s.cleanupOutdatedCaches(),
    s.registerRoute(
      '/',
      new s.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: function (s) {
              return _ref.apply(this, arguments);
            },
          },
        ],
      }),
      'GET',
    ),
    s.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new s.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [new s.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
      }),
      'GET',
    ),
    s.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new s.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [new s.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET',
    ),
    s.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new s.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [new s.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET',
    ),
    s.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new s.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [new s.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 })],
      }),
      'GET',
    ),
    s.registerRoute(
      /\/_next\/static.+\.js$/i,
      new s.CacheFirst({
        cacheName: 'next-static-js-assets',
        plugins: [new s.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    s.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new s.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [new s.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    s.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new s.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new s.RangeRequestsPlugin(),
          new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    s.registerRoute(
      /\.(?:mp4|webm)$/i,
      new s.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new s.RangeRequestsPlugin(),
          new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    s.registerRoute(
      /\.(?:js)$/i,
      new s.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [new s.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    s.registerRoute(
      /\.(?:css|less)$/i,
      new s.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    s.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new s.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    s.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new s.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    s.registerRoute(
      function (s) {
        var a = s.sameOrigin,
          e = s.url.pathname;
        return !(!a || e.startsWith('/api/auth/callback') || !e.startsWith('/api/'));
      },
      new s.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [new s.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    s.registerRoute(
      function (s) {
        var a = s.request,
          e = s.url.pathname,
          i = s.sameOrigin;
        return (
          '1' === a.headers.get('RSC') &&
          '1' === a.headers.get('Next-Router-Prefetch') &&
          i &&
          !e.startsWith('/api/')
        );
      },
      new s.NetworkFirst({
        cacheName: 'pages-rsc-prefetch',
        plugins: [new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    s.registerRoute(
      function (s) {
        var a = s.request,
          e = s.url.pathname,
          i = s.sameOrigin;
        return '1' === a.headers.get('RSC') && i && !e.startsWith('/api/');
      },
      new s.NetworkFirst({
        cacheName: 'pages-rsc',
        plugins: [new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    s.registerRoute(
      function (s) {
        var a = s.url.pathname;
        return s.sameOrigin && !a.startsWith('/api/');
      },
      new s.NetworkFirst({
        cacheName: 'pages',
        plugins: [new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    s.registerRoute(
      function (s) {
        return !s.sameOrigin;
      },
      new s.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
      }),
      'GET',
    );
});
