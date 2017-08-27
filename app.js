'use strict'

const http = require('http')
const cfenv = require('cfenv')

const appEnv = cfenv.getAppEnv()
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/health' || req.url === '/healthcheck') {
    res.writeHead(200)
    res.end('OK')
  } else {
    res.writeHead(404)
    res.end('Not Found')
  }
})

server.listen(appEnv.port, '0.0.0.0', function () {
  console.log(`server starting on ${appEnv.url}`)
})

// ----------------------------------------------------------------------------

const CronJob = require('cron').CronJob
const deleteOldMessages = require('./tasks/delete_old_messages')

new CronJob('00 15 * * *', async () => {
  await deleteOldMessages()
}, null, true, 'Asia/Tokyo')
