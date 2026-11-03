/*
	Cache Service Worker template by mrc 2019
	mostly based in:
	https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/basic/service-worker.js
	https://github.com/chriscoyier/Simple-Offline-Site/blob/master/js/service-worker.js
	https://gist.github.com/kosamari/7c5d1e8449b2fbc97d372675f16b566e

	Note for GitHub Pages:
	there can be an unexpected behaviour (cache not updating) when site is accessed from
	https://user.github.io/repo/ (without index.html) in some browsers (Firefox)
	use absolute paths if hosted in GitHub Pages in order to avoid it
	also invoke sw with an absolute path:
	navigator.serviceWorker.register('/repo/_cache_service_worker.js', {scope: '/repo/'})
*/

var PRECACHE_ID='smash64-online-patcher';
var PRECACHE_VERSION='v261c';
var PRECACHE_URLS=[
	`/assets/javascripts/crc.js`,
	`/assets/javascripts/FileSaver.js`,
	`/assets/javascripts/formats/aps.js`,
	`/assets/javascripts/formats/bps.js`,
	`/assets/javascripts/formats/ips.js`,
	`/assets/javascripts/formats/pmsr.js`,
	`/assets/javascripts/formats/ppf.js`,
	`/assets/javascripts/formats/rup.js`,
	`/assets/javascripts/formats/ups.js`,
	`/assets/javascripts/formats/vcdiff.js`,
	`/assets/javascripts/formats/zip.js`,
	`/assets/javascripts/locale.js`,
	`/assets/javascripts/MarcFile.js`,
	`/assets/javascripts/MarcFileN64.js`,
	`/assets/javascripts/RomPatcher.js`,
	`/assets/javascripts/worker_apply.js`,
	`/assets/javascripts/worker_crc.js`,
	`/assets/javascripts/worker_create.js`,
	`/assets/javascripts/zip.js/inflate.js`,
	`/assets/javascripts/zip.js/z-worker.js`,
	`/assets/javascripts/zip.js/zip.js`,
];

// install event (fired when sw is first installed): opens a new cache
self.addEventListener('install', evt => {
	evt.waitUntil(
		caches.open('precache-'+PRECACHE_ID+'-'+PRECACHE_VERSION)
			.then(cache => cache.addAll(PRECACHE_URLS))
			.then(self.skipWaiting())
	);
});

// activate event (fired when sw is has been successfully installed): cleans up old outdated caches
self.addEventListener('activate', evt => {
	evt.waitUntil(
		caches.keys().then(cacheNames => {
			return cacheNames.filter(cacheName => (cacheName.startsWith('precache-'+PRECACHE_ID+'-') && !cacheName.endsWith('-'+PRECACHE_VERSION)));
		}).then(cachesToDelete => {
			return Promise.all(cachesToDelete.map(cacheToDelete => {
				console.log('delete '+cacheToDelete);
				return caches.delete(cacheToDelete);
			}));
		}).then(() => self.clients.claim())
	);
});

// fetch event (fired when requesting a resource): returns cached resource when possible
self.addEventListener('fetch', evt => {
	if(evt.request.url.startsWith(self.location.origin)){ //skip cross-origin requests
		evt.respondWith(
			caches.match(evt.request).then(cachedResource => {
				if (cachedResource) {
					return cachedResource;
				}else{
					return fetch(evt.request);
				}
			})
		);
	}
});
