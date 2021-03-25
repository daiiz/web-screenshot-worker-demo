export default null
declare var self: ServiceWorkerGlobalScope

const { xsltProcess, xmlParse } = require('xslt-processor')
const { respondCacheFirst } = require('./caches')
const webScreenshot = require('./web-screenshot')
const svgDrawing = require('./svg-drawing')

const createSvgResponse = async ({ xmlObject, xmlPath, xslPath }) => {
  // fetch xsl content
  const xslRes = await respondCacheFirst(xslPath)
  const xslText = await xslRes.text()
  const xslObject = xmlParse(xslText)
  // generate svg string
  const outSvgText = xsltProcess(xmlObject, xslObject)
  const blob = new Blob([outSvgText], { type: 'image/svg+xml' })
  const headers = new Headers()
  headers.append('X-Xml-Path', xmlPath)
  headers.append('X-Xsl-Path', xslPath)
  return new Response(blob, { status: 200, statusText: 'OK', headers })
}

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())

self.addEventListener('fetch', event => {
  const req = event.request
  const { pathname, origin, host } = new URL(req.url)
  // fall back to network
  if (req.method !== 'GET') return

  // XSLT (Transform XML to SVG)
  if (pathname.startsWith('/web-screenshot/') && pathname.endsWith('.xml')) {
    const shouldConvertToDataUri = req.destination === 'image'
    event.respondWith((async function () {
      return createSvgResponse({
        xmlObject: await webScreenshot.loadXml(pathname, { shouldConvertToDataUri }),
        xmlPath: pathname,
        xslPath: '/web-screenshot.xsl'
      })
    })())
  } else if (pathname.startsWith('/svg-drawing/') && pathname.endsWith('.xml')) {
    event.respondWith((async function () {
      return createSvgResponse({
        xmlObject: await svgDrawing.loadXml(pathname),
        xmlPath: pathname,
        xslPath: '/svg-drawing.xsl'
      })
    })())
  }

  // fall back to network
  return
})
