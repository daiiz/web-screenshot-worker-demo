// selfをServiceWorkerGlobalScopeにするためのおまじない
export default null
declare var self: ServiceWorkerGlobalScope

const { xsltProcess, xmlParse } = require('xslt-processor')
const cacheName = 'web-screenshot'
console.log('serviceworker.js')

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())

self.addEventListener('fetch', event => {
  const req = event.request
  const { pathname, origin, host } = new URL(req.url)
  // fall back to network
  if (req.method !== 'GET') return

  // XSLT (Transform XML to SVG)
  if (pathname.startsWith('/web-screenshot/') && pathname.endsWith('.xml')) {
    event.respondWith((async function () {
      // fetch the xml content
      const xmlRes = await fetch(pathname)
      let xmlText = (await xmlRes.text()).split('\n').map(line => line.trim()).join('')
      xmlText = xmlText.replace(/<external-images>.*<\/external-images>/ig, '')
      const xmlObject = xmlParse(xmlText)
      const rootNode = xmlObject.childNodes[0]
      let foundSrcUrl = false
      if (rootNode.nodeName === 'web-screenshot') {
        for (const node of rootNode.childNodes) {
          if (node.nodeName === 'background-image') {
            const attr = node.attributes.find(attr => attr.nodeName === 'src')
            if (attr && attr.nodeValue) {
              foundSrcUrl = true
              attr.nodeValue = await convertToDataUrl(attr.nodeValue)
            }
          }
        }
      }
      if (!foundSrcUrl) return fetch(pathname)

      // fetch xsl content
      const xslPathname = '/web-screenshot.xsl'
      const xslRes = await respondCacheFirst(cacheName, xslPathname)
      const xslText = await xslRes.text()
      const xslObject = xmlParse(xslText)

      // generate svg string
      const outSvgText = xsltProcess(xmlObject, xslObject)
      const blob = new Blob([outSvgText], { type: 'image/svg+xml' })
      const headers = new Headers()
      headers.append('X-Xml-Path', pathname)
      headers.append('X-Xsl-Path', xslPathname)
      return new Response(blob, { status: 200, statusText: 'OK', headers })
    })())
  } else if (pathname.startsWith('/svg-drawing/') && pathname.endsWith('.xml')) {
    event.respondWith((async function () {
      // fetch the xml content
      const xmlRes = await fetch(pathname)
      const xmlText = (await xmlRes.text()).split('\n').map(line => line.trim()).join('')
      const xmlObject = xmlParse(xmlText)
      // fetch xsl content
      const xslPathname = '/svg-drawing.xsl'
      const xslRes = await respondCacheFirst(cacheName, xslPathname)
      const xslText = await xslRes.text()
      const xslObject = xmlParse(xslText)
      // generate svg string
      const outSvgText = xsltProcess(xmlObject, xslObject)
      const blob = new Blob([outSvgText], { type: 'image/svg+xml' })
      const headers = new Headers()
      headers.append('X-Xml-Path', pathname)
      headers.append('X-Xsl-Path', xslPathname)
      return new Response(blob, { status: 200, statusText: 'OK', headers })
    })())
  }

  // fall back to network
  return
})

const respondCacheFirst = async (key, url) => {
  url = url.split('?').shift()
  const cache = await caches.open(key)
  const res = await cache.match(url)
  if (res) {
    fetchAndupdateCache(key, url)
    return res
  }
  const remoteRes = await fetchAndupdateCache(key, url)
  return remoteRes
}

const fetchAndupdateCache = async (key, url) => {
  if (!navigator.onLine) return
  const res = await fetch(url, { mode: 'cors', credentials: 'include' })
  const cache = await caches.open(key)
  await cache.put(url, res.clone())
  return res
}

const convertToDataUrl = async srcUrl => {
  const createDataUrl = (arrayBuffer, dataURIScheme) => {
    const byteArray = new Uint8Array(arrayBuffer)
    return dataURIScheme + btoa(byteArray.reduce((data, byte) => {
      return data + String.fromCharCode(byte)
    }, ''))
  }
  try {
    const res = await respondCacheFirst(cacheName, srcUrl)
    const _res = res.clone()
    const buf = await _res.arrayBuffer()
    const blob = await res.blob()
    return createDataUrl(buf, `data:${blob.type || 'image/png'};base64,`)
  } catch (err) {
    console.error(err)
    return srcUrl
  }
}
