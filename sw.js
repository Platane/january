/* global caches self URL fetch */

const assets = ['/january', '/january/index.html', '/january/354ec555.js', '/january/ae762217.css'];

const hostname = 'platane.github.io';

const assetCacheKey = assets.join('-');
const imageCacheKey = 'image';
const dataCacheKey = 'data';
const pageCacheKey = 'page';

self.addEventListener('install', event => {
    event.waitUntil(caches.open(assetCacheKey).then(cache => cache.addAll(assets)));
});

self.addEventListener('activate', event => {
    const whiteList = [assetCacheKey, imageCacheKey];

    event.waitUntil(
    // get the currently cached files, remove the one that are out of date
    caches.keys().then(cacheKeys => {
        Promise.all(cacheKeys.map(key => !whiteList.includes(key) && caches.delete(key)));
    }));
});

const cacheFirstStrategy = cacheName => async request => {
    const resFromCache = await caches.match(request);

    if (resFromCache) return resFromCache;

    const resFromFetch = await fetch(request.clone());

    const cache = await caches.open(cacheName);

    cache.put(request, resFromFetch.clone());

    return resFromFetch;
};

const networkFirstStrategy = cacheName => request => fetch(request.clone()).then(async resFromFetch => {
    const cache = await caches.open(cacheName);

    cache.put(request, resFromFetch.clone());

    return resFromFetch;
}).catch(async err => {
    const resFromCache = await caches.match(request);

    return resFromCache || Promise.reject(err);
});

self.addEventListener('fetch', event => {
    const requestURL = new URL(event.request.url);

    if (hostname === requestURL.hostname) {
        if (assets.includes(requestURL.pathname))
            // cached as asset
            event.respondWith(caches.match(event.request));else if (requestURL.pathname.match(/\.(png|jpg|gif|webp|svg)$/))
            // image, serve from cache if exists
            event.respondWith(cacheFirstStrategy(imageCacheKey)(event.request));else if (requestURL.pathname.match(/\/data\/(\w+)\/top\.json$/))
            // short term caching data ( change at every new post )
            event.respondWith(networkFirstStrategy(dataCacheKey)(event.request));else if (requestURL.pathname.match(/\/data\/(\w+)\/(\w+)\.json$/))
            // long term caching data
            event.respondWith(networkFirstStrategy(dataCacheKey)(event.request));else
            // short term caching data ( change at every new post )
            event.respondWith(networkFirstStrategy(pageCacheKey)(event.request));
    }
});