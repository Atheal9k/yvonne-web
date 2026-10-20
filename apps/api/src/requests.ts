import { randomUUID } from 'node:crypto'
import { appendFile, mkdir, unlink, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Router } from 'express'
import multer from 'multer'
import { z } from 'zod'

export const requests = Router()
const storageDirectory = process.env.STUDIO_DATA_DIR
  ? resolve(process.env.STUDIO_DATA_DIR)
  : fileURLToPath(new URL('../data/', import.meta.url))
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 15,
    fieldSize: 12_000,
  },
})

const common = {
  name: z.string().trim().min(2, 'Please add your name.').max(100),
  email: z.email('Please add a valid email address.').max(254),
  message: z.string().trim().max(3000).optional().default(''),
  consent: z.literal('yes', {
    error: 'Please agree to the use of your details for this enquiry.',
  }),
  website: z.string().max(0, 'Unable to accept this request.').optional(),
}

const schema = z.discriminatedUnion('type', [
  z.object({
    ...common,
    type: z.literal('portrait'),
    kind: z.enum(['couple', 'family', 'pet']),
    format: z.enum(['digital', 'print']),
    size: z.enum(['A5', 'A4', 'A3']),
    subjects: z.enum(['1', '2', '3', '4', '5+']),
  }),
  z.object({
    ...common,
    type: z.literal('event'),
    occasion: z.enum([
      'Wedding',
      'Brand or corporate event',
      'Birthday or celebration',
      'Community event',
      'Something else',
    ]),
    date: z.iso.date().refine((value) => {
      const today = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Australia/Melbourne',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date())
      return value >= today
    }, 'Please choose today or a future event date.'),
    location: z
      .string()
      .trim()
      .min(2, 'Please add your venue or suburb.')
      .max(200),
    guests: z.enum(['Under 50', '50–100', '100–150', '150+', 'Still planning']),
  }),
])

// Small, bounded in-memory throttle for the single-server starter deployment.
const attempts = new Map<string, { count: number; until: number }>()
requests.use((req, res, next) => {
  const now = Date.now()
  for (const [key, value] of attempts)
    if (value.until <= now) attempts.delete(key)
  const key = req.ip ?? 'unknown'
  const attempt = attempts.get(key) ?? { count: 0, until: now + 10 * 60 * 1000 }
  if (attempt.count >= 12 || (attempts.size >= 5000 && !attempts.has(key))) {
    res.setHeader(
      'Retry-After',
      String(Math.max(1, Math.ceil((attempt.until - now) / 1000))),
    )
    res
      .status(429)
      .json({
        error: 'A few too many requests. Please try again in a little while.',
      })
    return
  }
  attempt.count++
  attempts.set(key, attempt)
  next()
})

function imageExtension(file: Express.Multer.File) {
  const bytes = file.buffer
  if (
    file.mimetype === 'image/jpeg' &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  )
    return 'jpg'
  if (
    file.mimetype === 'image/png' &&
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return 'png'
  if (
    file.mimetype === 'image/webp' &&
    bytes.subarray(0, 4).toString() === 'RIFF' &&
    bytes.subarray(8, 12).toString() === 'WEBP'
  )
    return 'webp'
  return null
}

requests.post('/', upload.single('photo'), async (req, res) => {
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    res
      .status(400)
      .json({
        error: parsed.error.issues[0]?.message ?? 'Please check your details.',
      })
    return
  }
  const extension = req.file ? imageExtension(req.file) : null
  if (req.file && (!extension || parsed.data.type !== 'portrait')) {
    res
      .status(400)
      .json({
        error:
          'Please upload a valid JPG, PNG or WebP portrait reference photo.',
      })
    return
  }

  const reference = `YS-${randomUUID().toUpperCase()}`
  const photo = req.file ? `${reference}.${extension}` : null
  await mkdir(storageDirectory, { recursive: true })
  if (req.file && photo) {
    await mkdir(join(storageDirectory, 'references'), { recursive: true })
    await writeFile(
      join(storageDirectory, 'references', photo),
      req.file.buffer,
      { flag: 'wx', mode: 0o600 },
    )
  }

  const details = { ...parsed.data }
  delete details.website
  try {
    await appendFile(
      join(storageDirectory, 'requests.jsonl'),
      JSON.stringify({
        reference,
        createdAt: new Date().toISOString(),
        status: 'new',
        ...details,
        photo,
      }) + '\n',
      { mode: 0o600 },
    )
  } catch (error) {
    if (photo)
      await unlink(join(storageDirectory, 'references', photo)).catch(
        () => undefined,
      )
    throw error
  }
  res
    .status(201)
    .json({ reference, status: 'received', paymentRequired: false })
})
