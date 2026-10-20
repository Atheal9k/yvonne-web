import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  X,
} from 'lucide-react'
import { kindArt } from '../portfolio'
import type { PortraitKind } from '../portfolio'
import { ArtImage, Sparkle } from './Decor'

export function Dialog({
  children,
  onClose,
  title,
}: {
  children: ReactNode
  onClose: () => void
  title: string
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    const previous = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  return (
    <dialog
      ref={ref}
      className="studio-dialog"
      aria-label={title}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <button
        className="dialog-close icon-button"
        onClick={onClose}
        aria-label="Close dialog"
      >
        <X size={21} />
      </button>
      {children}
    </dialog>
  )
}

function Success({
  reference,
  type,
  onClose,
}: {
  reference: string
  type: 'portrait' | 'event'
  onClose: () => void
}) {
  return (
    <div className="success-panel">
      <span className="success-icon">
        <CheckCircle2 size={34} strokeWidth={1.4} />
      </span>
      <p className="eyebrow">THE START OF SOMETHING LOVELY</p>
      <h2>
        {type === 'portrait'
          ? 'A little art is in the making.'
          : 'Let’s make it memorable.'}
      </h2>
      <p>
        Your {type === 'portrait' ? 'portrait request' : 'event enquiry'} has
        been saved. Keep your reference below for your records.
      </p>
      <div className="reference-number">{reference}</div>
      <p className="form-note">
        Studio preview: requests are stored for review. Email delivery and
        payment will be connected before launch. No payment has been taken and
        no booking is confirmed.
      </p>
      <button className="button button-primary" onClick={onClose}>
        Back to the studio <ArrowRight size={17} />
      </button>
    </div>
  )
}

async function submitRequest(data: FormData) {
  const response = await fetch('/api/requests', {
    method: 'POST',
    body: data,
    signal: AbortSignal.timeout(20000),
  })
  const result = (await response.json()) as {
    reference?: string
    error?: string
  }
  if (!response.ok || !result.reference)
    throw new Error(result.error ?? 'Something went wrong. Please try again.')
  return result.reference
}

export function PortraitForm({
  initialKind = 'couple',
  onClose,
}: {
  initialKind?: PortraitKind
  onClose: () => void
}) {
  const [kind, setKind] = useState<PortraitKind>(initialKind)
  const [format, setFormat] = useState('digital')
  const [step, setStep] = useState(1)
  const [reference, setReference] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [filename, setFilename] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const data = new FormData(event.currentTarget)
    data.set('type', 'portrait')
    data.set('kind', kind)
    data.set('format', format)
    try {
      setReference(await submitRequest(data))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog title="Request a custom portrait" onClose={onClose}>
      {reference ? (
        <Success reference={reference} type="portrait" onClose={onClose} />
      ) : (
        <div className="request-layout">
          <aside className="request-art">
            <span className="eyebrow">A LITTLE PIECE OF YOUR STORY</span>
            <div className={`request-frame wavy-frame frame-${kindArt[kind].frame}`}>
              <ArtImage
                src={kindArt[kind].src}
                srcSet={kindArt[kind].srcSet}
                sizes="280px"
                alt={kindArt[kind].alt}
              />
              <Sparkle className="request-sparkle" />
            </div>
            <p>
              One of a kind.
              <br />
              <em>Just like your people.</em>
            </p>
          </aside>
          <div className="request-body">
            <p className="eyebrow">
              CUSTOM PORTRAITS <span className="step-label">{step} / 2</span>
            </p>
            <h2>
              {step === 1 ? 'Let’s make it yours.' : 'Tell me a little more.'}
            </h2>
            <p className="dialog-intro">
              {step === 1
                ? 'A few little details to start your one-of-a-kind portrait.'
                : 'Your favourite photo is where the magic begins.'}
            </p>
            <form onSubmit={submit}>
              <div hidden={step !== 1}>
                <fieldset className="choice-fieldset">
                  <legend>Who’s in your portrait?</legend>
                  <div className="portrait-choices">
                    {(
                      [
                        ['couple', 'A lovely couple'],
                        ['family', 'My favourite people'],
                        ['pet', 'A furry friend'],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        className={`portrait-choice ${kind === value ? 'selected' : ''}`}
                        aria-pressed={kind === value}
                        type="button"
                        onClick={() => setKind(value)}
                      >
                        <ArtImage
                          src={kindArt[value].src}
                          srcSet={kindArt[value].srcSet}
                          sizes="120px"
                          alt=""
                        />
                        <span>{label}</span>
                        {kind === value && (
                          <Check className="choice-check" size={15} />
                        )}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="choice-fieldset">
                  <legend>How would you like it?</legend>
                  <div className="format-choices">
                    {[
                      [
                        'digital',
                        'Digital keepsake',
                        'A high-resolution artwork file',
                      ],
                      [
                        'print',
                        'A lovely art print',
                        'Printed, packed & ready to treasure',
                      ],
                    ].map(([value, label, detail]) => (
                      <button
                        type="button"
                        key={value}
                        className={`format-choice ${format === value ? 'selected' : ''}`}
                        aria-pressed={format === value}
                        onClick={() => setFormat(value)}
                      >
                        <span className="radio-circle">
                          {format === value && <span />}
                        </span>
                        <span>
                          <strong>{label}</strong>
                          <small>{detail}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <div className="form-row">
                  <label>
                    Number of subjects
                    <select name="subjects" defaultValue="2">
                      <option value="1">1 lovely face</option>
                      <option value="2">2 lovely faces</option>
                      <option value="3">3 lovely faces</option>
                      <option value="4">4 lovely faces</option>
                      <option value="5+">5 or more</option>
                    </select>
                  </label>
                  <label>
                    Artwork size
                    <select name="size" defaultValue="A4">
                      <option>A5</option>
                      <option>A4</option>
                      <option>A3</option>
                    </select>
                  </label>
                </div>
                <div className="quote-note">
                  Every story is a little different. You’ll receive a personal
                  quote before any payment.
                </div>
                <button
                  type="button"
                  className="button button-primary full-width"
                  onClick={() => setStep(2)}
                >
                  Make it personal <ArrowRight size={17} />
                </button>
              </div>
              {step === 2 && (
                <>
                  <div className="form-row">
                    <label>
                      Your name
                      <input
                        name="name"
                        autoComplete="name"
                        placeholder="The name behind the story"
                        required
                        maxLength={100}
                      />
                    </label>
                    <label>
                      Email address
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        required
                        maxLength={254}
                      />
                    </label>
                  </div>
                  <label className="upload-field">
                    <ImagePlus size={25} strokeWidth={1.3} />
                    <strong>{filename || 'Add your favourite photo'}</strong>
                    <span>Optional · JPG, PNG or WebP · up to 5 MB</span>
                    <input
                      type="file"
                      name="photo"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (file && file.size > 5 * 1024 * 1024) {
                          event.target.value = ''
                          setFilename('')
                          setError('Please choose a photo smaller than 5 MB.')
                          return
                        }
                        setFilename(file?.name ?? '')
                        setError('')
                      }}
                    />
                  </label>
                  <label>
                    Your little details
                    <textarea
                      name="message"
                      rows={3}
                      placeholder="An anniversary? A birthday? Tell me about your people, any special details, and when you need it."
                      maxLength={3000}
                    />
                  </label>
                  <label className="consent-check">
                    <input
                      type="checkbox"
                      name="consent"
                      value="yes"
                      required
                    />
                    <span>
                      I’m happy for these details and my reference photo to be
                      used to prepare my portrait quote.
                    </span>
                  </label>
                  <input
                    name="website"
                    className="honeypot"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                  {error && (
                    <p className="form-error" role="alert">
                      {error}
                    </p>
                  )}
                  <button
                    disabled={busy}
                    className="button button-primary full-width"
                    type="submit"
                  >
                    {busy ? (
                      <>
                        <LoaderCircle className="spinning" size={18} /> Saving
                        your request…
                      </>
                    ) : (
                      <>
                        Request my portrait <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="back-button"
                    onClick={() => setStep(1)}
                    disabled={busy}
                  >
                    <ArrowLeft size={14} /> Back to the lovely details
                  </button>
                  <p className="form-note">
                    No payment needed today. Your request is saved in this
                    studio preview.
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </Dialog>
  )
}

export function EventForm({ onClose }: { onClose: () => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const data = new FormData(event.currentTarget)
    data.set('type', 'event')
    try {
      setReference(await submitRequest(data))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog title="Enquire about live illustration" onClose={onClose}>
      {reference ? (
        <Success reference={reference} type="event" onClose={onClose} />
      ) : (
        <div className="event-form-body">
          <span className="eyebrow">A PARTY FAVOUR WITH PERSONALITY</span>
          <h2>Let’s draw a crowd.</h2>
          <p className="dialog-intro">
            Tell me what you’re dreaming up. We’ll find the lovely little
            details together.
          </p>
          <form onSubmit={submit}>
            <div className="form-row">
              <label>
                Your name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  placeholder="Hello, you"
                  maxLength={100}
                />
              </label>
              <label>
                Email address
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  maxLength={254}
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                The occasion
                <select name="occasion" defaultValue="Wedding">
                  <option>Wedding</option>
                  <option>Brand or corporate event</option>
                  <option>Birthday or celebration</option>
                  <option>Community event</option>
                  <option>Something else</option>
                </select>
              </label>
              <label>
                Event date
                <input type="date" name="date" min={today} required />
              </label>
            </div>
            <div className="form-row">
              <label>
                Where’s the party?
                <input
                  name="location"
                  placeholder="Venue or suburb"
                  required
                  maxLength={200}
                />
              </label>
              <label>
                Number of guests
                <select name="guests" defaultValue="50–100">
                  <option>Under 50</option>
                  <option>50–100</option>
                  <option>100–150</option>
                  <option>150+</option>
                  <option>Still planning</option>
                </select>
              </label>
            </div>
            <label>
              A little about your event
              <textarea
                name="message"
                rows={3}
                placeholder="The vibe, the timing, and anything else you’d love me to know…"
                maxLength={3000}
              />
            </label>
            <label className="consent-check">
              <input type="checkbox" name="consent" value="yes" required />
              <span>
                I’m happy for my details to be used to respond to this enquiry.
              </span>
            </label>
            <input
              name="website"
              className="honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="button button-primary full-width"
              disabled={busy}
            >
              {busy ? (
                <>
                  <LoaderCircle size={17} className="spinning" /> Saving your
                  enquiry…
                </>
              ) : (
                <>
                  Send a little hello <ArrowRight size={17} />
                </>
              )}
            </button>
            <p className="form-note">
              An enquiry starts the conversation. Your event is confirmed only
              after a quote is accepted. This preview saves requests without
              sending email.
            </p>
          </form>
        </div>
      )}
    </Dialog>
  )
}
