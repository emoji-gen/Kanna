'use strict'

const log = require('fancy-log')
const http = require('http')

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/health' || req.url === '/healthcheck') {
    res.writeHead(200)
    res.end('OK')
  } else {
    res.writeHead(404)
    res.end('Not Found')
  }
})

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

const port = process.env.PORT || 5000
server.listen(port, '0.0.0.0', function () {
  log(`Listining: http://0.0.0.0:${port}`)
})

// ----------------------------------------------------------------------------

const { CronJob } = require('cron')
const deleteOldMessages = require('./tasks/delete_old_messages')

const job = new CronJob('15 00 * * *', async () => {
  try {
    await deleteOldMessages()
  } catch (e) {
    log.error(e)
  }
}, null, true, 'Asia/Tokyo')
