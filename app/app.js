'use strict'

require('dotenv').config()

const _ = process.env,
  express = require('express'),
  app = express(),
  path = require('path'),
  cors = require('cors'),
  helmet = require('helmet'),
  compression = require('compression'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  fs = require('fs-extra'),
  { createStream } = require('rotating-file-stream'),
  { throttle } = require('./lib/middleware'),
  { logFilenameFormat } = require('./lib/fn'),
  {appCorsOption} = require('./lib/checker')

const corsOptions = {
  origin: appCorsOption,
  optionsSuccessStatus: 200,
  methods: ['GET'], // Allow GET only
}

// Create HTTP Server
const server = require('http').createServer(app)

// Some Middlewares
app
  .use(compression())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cors(corsOptions))
  .use(helmet())
  .use(throttle(5 * 1024 * 1024)) // Throttling bandwidth (bytes)
  .disable('x-powered-by')


// Logging
if (process.argv.includes('--log')) {
    fs.ensureDirSync(_.logs || 'logs')
    const appResSend = app.response.send
    app.response.send = function sendOverWrite(body) {
        appResSend.call(this, body)
        this.__custombody__ = body
    }
    morgan.token('datetime', (_req, res) => new Date())
    morgan.token('res-body', (_req, res) => res.__custombody__ || undefined)
    // Console Log All Request and Response
    app.use(
        morgan(
        `[:datetime] :remote-addr - :remote-user ":method :url HTTP/:http-version" (:response-time ms) :status :res[content-length] ":referrer" ":user-agent" (Total :total-time ms)
        :res-body`
        )
    )
    // Log All Request and Response
    app.use(
        morgan(
        `[:datetime] :remote-addr - :remote-user ":method :url HTTP/:http-version" (:response-time ms) :status :res[content-length] ":referrer" ":user-agent" (Total :total-time ms)
        :res-body`,
        {
            stream: createStream(
            (time, index) => logFilenameFormat(time, index, { prefix: 'access', ext: 'log', time: false }),
            {
                interval: '1d',
                path: path.join(__dirname, 'logs'),
            }
            ),
        }
        )
    )
}

/*
 * API Routes
 */
const api_paths = require('./api')
try {
    const path_keys = Object.keys(api_paths)
    path_keys.forEach((_newRoute) => {
        const api_path = `/api/${_newRoute}`
        console.log(`Using ${api_path}`)
        app.use(`${api_path}`, api_paths[_newRoute])
    })
} catch (e) {
    console.error(`Error Adding API Path:`, JSON.stringify(e))
}


// Bad Requests
app.use((req, res) => {
  console.error('Invalid Endpoint:', JSON.stringify({ url: req.url, method: req.method }))
  return res.status(404).json({ detail: 'Invalid Endpoint' })
})

// Error Response
app.use((req, res) => {
  console.error(
    'Server Error:',
    JSON.stringify({
      url: req.url,
      method: req.method,
    })
  )
  return res.status(500).json({ detail: 'Server Error' })
})

// Start Server
server.listen(_.PORT, () => {
    console.log('#'.repeat(50))
    console.info(`Server is up and running on *:${_.PORT}`)
    console.log('#'.repeat(50))
})
