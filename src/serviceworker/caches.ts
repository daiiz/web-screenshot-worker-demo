const cacheName = 'web-screenshot'

const fetchAndupdateCache = async (key, url) => {
  if (!navigator.onLine) return
  const res = await fetch(url, { mode: 'cors', credentials: 'include' })
  const cache = await caches.open(key)
  await cache.put(url, res.clone())
  return res
}

const respondCacheFirst = async url => {
  const cache = await caches.open(cacheName)
  const res = await cache.match(url, { ignoreSearch: true })
  if (res) {
    fetchAndupdateCache(cacheName, url)
    return res
  }
  const remoteRes = await fetchAndupdateCache(cacheName, url)
  return remoteRes
}

module.exports = { respondCacheFirst }
