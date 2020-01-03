const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const { Server } = require('http')
const request = require('request')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('static'))
app.set('views', './views')
app.set('view engine', 'ejs')

// Gyazo
const showGyazoRawImage = (req, res) => {
  request.get(`https://gyazo.com/${req.params.gyazoId}/raw`, {
    method: 'GET',
    encoding: null
  }, (err, _res, body) => {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': _res.headers['content-type'],
      'Cache-Control': 'public, max-age=31536000'
    })
    res.send(body)
  })
}

const server = new Server(app)
// app.get('/a', (req, res) => { return res.json({ hello: 'world' }) })
// http://localhost:4005/gyazo/3221f9b7a16b056d80db62c04e4ddb66
app.get('/gyazo/:gyazoId', showGyazoRawImage)
app.get('/', (req, res) => { res.render('index', {}) })

export { app, server }
