/* global caches self URL fetch */

const BASE_PATH = 'BASE_PATH'.split('/').filter(Boolean)
const assets = ['root2.html', 'root.html', 'index.html', 'app.js', 'style.css']

const assetCacheKey = assets.join('-')
const imageCacheKey = 'image'

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(assetCacheKey).then(cache => cache.addAll(assets))
    )
})

self.addEventListener('activate', event => {
    const whiteList = [assetCacheKey, imageCacheKey]

    event.waitUntil(
        // get the currently cached files, remove the one that are out of date
        caches.keys().then(cacheKeys => {
            Promise.all(
                cacheKeys.map(
                    key => !whiteList.includes(key) && caches.delete(key)
                )
            )
        })
    )
})

const cacheFirstStrategy = async request => {
    const resFromCache = await caches.match(request)

    if (resFromCache) return resFromCache

    const resFromFetch = await fetch(request.clone())

    const cache = await caches.open(imageCacheKey)

    cache.put(request, resFromFetch.clone())

    return resFromFetch
}

self.addEventListener('fetch', event => {
    const requestURL = new URL(event.request.url)

    const a = BASE_PATH

    if (assets.includes(requestURL.pathname))
        // cached as asset
        event.respondWith(caches.match(event.request))
    else if (requestURL.pathname.match(/\.(png|jpg|gif)$/))
        // image, serve from cache if exists
        event.respondWith(cacheFirstStrategy(event.request))
})
