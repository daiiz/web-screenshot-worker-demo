const express = require('express')
const server = require('./lib/server').server

const PORT = process.env.PORT || 4005
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
})
