export default null
const { xmlParse } = require('xslt-processor')
const { respondCacheFirst } = require('./caches')

const loadXml = async xmlPath => {
  const xmlRes = await fetch(xmlPath)
  const xmlText = (await xmlRes.text()).split('\n').map(line => line.trim()).join('')
  return xmlParse(xmlText)
}

module.exports = { loadXml }
