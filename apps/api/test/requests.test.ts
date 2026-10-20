import assert from 'node:assert/strict'
import { once } from 'node:events'
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve, sep } from 'node:path'
import { test } from 'node:test'

test('studio request API validates submissions and persists private records', async (suite) => {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), 'yvonne-api-test-'))
  process.env.STUDIO_DATA_DIR = temporaryDirectory
  const { app } = await import('../src/app.js')
  const server = app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const address = server.address()
  assert.ok(address && typeof address !== 'string')
  const base = `http://127.0.0.1:${address.port}`
  const portrait = {
    type: 'portrait',
    name: 'Studio Test',
    email: 'test@example.com',
    consent: 'yes',
    kind: 'family',
    format: 'print',
    size: 'A4',
    subjects: '3',
    message: 'A little family keepsake.',
  }
  const event = {
    type: 'event',
    name: 'Event Test',
    email: 'organiser@example.com',
    consent: 'yes',
    occasion: 'Wedding',
    date: '2099-12-10',
    location: 'Melbourne',
    guests: '50–100',
    message: 'Live portraits for a wedding.',
  }

  function post(fields: Record<string, string>, file?: Blob) {
    const data = new FormData()
    Object.entries(fields).forEach(([key, value]) => data.set(key, value))
    if (file) data.set('photo', file, 'reference.png')
    return fetch(`${base}/api/requests`, { method: 'POST', body: data })
  }

  try {
    await suite.test(
      'persists a portrait request and reference photo',
      async () => {
        const png = Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j3ioAAAAASUVORK5CYII=',
          'base64',
        )
        const response = await post(
          portrait,
          new Blob([png], { type: 'image/png' }),
        )
        assert.equal(response.status, 201)
        const result = await response.json()
        assert.match(result.reference, /^YS-[A-F0-9-]+$/)
        assert.equal(result.paymentRequired, false)
        const files = await readdir(join(temporaryDirectory, 'references'))
        assert.deepEqual(files, [`${result.reference}.png`])
        assert.deepEqual(
          await readFile(join(temporaryDirectory, 'references', files[0])),
          png,
        )
      },
    )
    await suite.test(
      'persists an event enquiry with a distinct reference',
      async () => {
        const response = await post(event)
        assert.equal(response.status, 201)
        const records = (
          await readFile(join(temporaryDirectory, 'requests.jsonl'), 'utf8')
        )
          .trim()
          .split('\n')
          .map((line) => JSON.parse(line))
        assert.equal(records.length, 2)
        assert.equal(records[1].type, 'event')
        assert.equal(records[1].photo, null)
        assert.notEqual(records[0].reference, records[1].reference)
        assert.equal(records[0].website, undefined)
      },
    )
    await suite.test(
      'rejects invalid email, missing consent, and past dates',
      async () => {
        for (const fields of [
          { ...portrait, email: 'invalid' },
          { ...portrait, consent: '' },
          { ...event, date: '2000-01-01' },
        ]) {
          const response = await post(fields)
          assert.equal(response.status, 400)
          assert.ok((await response.json()).error)
        }
      },
    )
    await suite.test(
      'rejects spoofed image uploads and oversized photos',
      async () => {
        assert.equal(
          (
            await post(
              portrait,
              new Blob(['<svg></svg>'], { type: 'image/png' }),
            )
          ).status,
          400,
        )
        const response = await post(
          portrait,
          new Blob([new Uint8Array(5 * 1024 * 1024 + 1)], {
            type: 'image/png',
          }),
        )
        assert.equal(response.status, 400)
        assert.match((await response.json()).error, /5 MB/)
      },
    )
    await suite.test(
      'rejects honeypot submissions without saving data',
      async () => {
        assert.equal(
          (await post({ ...portrait, website: 'spam.example' })).status,
          400,
        )
        assert.equal(
          (await readFile(join(temporaryDirectory, 'requests.jsonl'), 'utf8'))
            .trim()
            .split('\n').length,
          2,
        )
      },
    )
    await suite.test(
      'does not expose private records or reference photos',
      async () => {
        assert.equal((await fetch(`${base}/api/requests`)).status, 404)
        const response = await fetch(`${base}/data/requests.jsonl`)
        assert.notEqual(
          response.headers.get('content-type'),
          'application/x-ndjson',
        )
        assert.ok(!(await response.text()).includes('test@example.com'))
      },
    )
  } finally {
    server.closeAllConnections()
    await new Promise<void>((resolveClose, reject) =>
      server.close((error) => (error ? reject(error) : resolveClose())),
    )
    delete process.env.STUDIO_DATA_DIR
    const resolved = resolve(temporaryDirectory)
    assert.ok(
      resolved.startsWith(resolve(tmpdir()) + sep) &&
        resolved.includes('yvonne-api-test-'),
    )
    await rm(resolved, { recursive: true, force: true })
  }
})
