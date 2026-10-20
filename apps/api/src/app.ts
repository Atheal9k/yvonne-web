import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import express from 'express'
import type { ErrorRequestHandler } from 'express'
import multer from 'multer'
import { requests } from './requests.js'

export const app = express()

app.disable('x-powered-by')
app.use(express.json({ limit: '32kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Your backend is connected.' })
})

app.use('/api/requests', requests)

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API route not found' })
})

// Serve the Vite build if it exists.
const webDist = fileURLToPath(new URL('../../web/dist/', import.meta.url))
const webIndex = fileURLToPath(
  new URL('../../web/dist/index.html', import.meta.url),
)

if (existsSync(webIndex)) {
  app.use(express.static(webDist))
  app.get('/{*path}', (_req, res) => {
    res.sendFile(webIndex)
  })
}

const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  _next,
) => {
  if (error instanceof multer.MulterError) {
    res
      .status(400)
      .json({
        error:
          error.code === 'LIMIT_FILE_SIZE'
            ? 'Please choose a photo smaller than 5 MB.'
            : 'Please check your upload and try again.',
      })
    return
  }
  if (
    error instanceof SyntaxError &&
    'status' in error &&
    error.status === 400
  ) {
    res.status(400).json({ error: 'Invalid JSON body' })
    return
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    error.status === 413
  ) {
    res
      .status(413)
      .json({
        error:
          'This request is too large. Please reduce its size and try again.',
      })
    return
  }

  console.error(error)
  res.status(500).json({ error: 'Internal server error' })
}

app.use(errorHandler)
