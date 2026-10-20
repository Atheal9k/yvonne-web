import { useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  ChevronDown,
  Heart,
  MapPin,
  Menu,
  PartyPopper,
  X,
} from 'lucide-react'
import { avatar, kindArt, pieces, wavyTrio } from './portfolio'
import type { Category, Piece, PortraitKind } from './portfolio'
import { ArtImage, Sparkle } from './components/Decor'
import { Dialog, EventForm, PortraitForm } from './components/RequestDialog'
import './App.css'

type Modal =
  | { type: 'portrait'; kind?: PortraitKind }
  | { type: 'event' }
  | { type: 'artwork'; piece: Piece }
  | { type: 'privacy' }
  | null

const ALL = 'Everything'
const filters: (typeof ALL | Category)[] = [ALL, 'Pets', 'People', 'Couples']

const faqs = [
  [
    'How do custom portraits work?',
    'Choose who you’d like illustrated and your preferred format, then share a photo and a few details. I’ll put together a personal quote. Once the details are agreed and payment is arranged, your portrait can begin.',
  ],
  [
    'Can I have my portrait printed or framed?',
    'Absolutely. Choose a digital keepsake or an art print when you make your request. Size, framing, postage and the final price will be confirmed in your quote.',
  ],
  [
    'What events can you illustrate at?',
    'Weddings, brand events, birthdays, launch parties and just-because celebrations. Live portraits give guests a little entertainment and something personal to take home. Share your guest count and timing so we can plan the right fit.',
  ],
  [
    'How far ahead should I book?',
    'The earlier the better, especially for weddings and a special gift date. Add your event date or preferred delivery date to your enquiry, and I’ll confirm availability and a realistic timeline before you commit.',
  ],
  [
    'Do you travel outside Melbourne?',
    'Yvonne Studios is based in Melbourne. For events further afield, let me know the location and we can talk through travel. Digital portrait requests are welcome from wherever you call home.',
  ],
]

const navLinks = [
  ['Portfolio', '#work'],
  ['Custom portraits', '#portraits'],
  ['Live illustration', '#live'],
  ['Meet Yvonne', '#about'],
]

function Wordmark() {
  return (
    <>
      <Sparkle className="brand-sparkle" size={20} />
      <span className="wordmark-text">
        yvonne <span>studios</span>
      </span>
    </>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState<(typeof filters)[number]>(ALL)
  const [modal, setModal] = useState<Modal>(null)
  const close = () => setModal(null)
  const openPortrait = (kind?: PortraitKind) =>
    setModal({ type: 'portrait', kind })
  const openEvent = () => setModal({ type: 'event' })
  const shown = pieces.filter(
    (piece) => filter === ALL || piece.category === filter,
  )
  const count = (item: (typeof filters)[number]) =>
    item === ALL
      ? pieces.length
      : pieces.filter((piece) => piece.category === item).length

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to the lovely things
      </a>
      <div className="announcement">
        <span>Little portraits</span>
        <Sparkle size={11} />
        <span>Big feelings</span>
        <Sparkle size={11} />
        <span>Hand-drawn in Melbourne</span>
      </div>
      <header className="site-header">
        <a className="wordmark" href="#" aria-label="Yvonne Studios home">
          <Wordmark />
        </a>
        <nav
          id="mobile-navigation"
          className={menuOpen ? 'main-nav is-open' : 'main-nav'}
          aria-label="Main navigation"
        >
          {navLinks.map(([name, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {name}
            </a>
          ))}
          <button
            className="mobile-contact button button-primary"
            onClick={() => {
              setMenuOpen(false)
              openEvent()
            }}
          >
            Say hello <ArrowUpRight size={16} />
          </button>
        </nav>
        <button className="button button-primary header-button" onClick={openEvent}>
          Say hello <ArrowUpRight size={16} />
        </button>
        <button
          className="menu-toggle icon-button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main id="main">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              Live portraits &amp; custom illustration :)
            </p>
            <h1 id="hero-title">
              Little portraits.
              <br />
              <span className="hero-highlight">
                Big feelings.
                <svg viewBox="0 0 300 18" aria-hidden="true">
                  <path d="M4 12C60 2 110 16 160 8S250 4 296 10" />
                </svg>
              </span>
            </h1>
            <p className="hero-description">
              Hand-drawn marker portraits of your favourite people and pets,
              with little sparkles, wavy frames and names lettered by hand.
              Commissioned from your photos, or drawn live at your event.
            </p>
            <div className="hero-actions">
              <button
                className="button button-primary"
                onClick={() => openPortrait()}
              >
                Request a portrait <ArrowUpRight size={18} />
              </button>
              <a className="button button-outline" href="#live">
                Live drawing at events <ArrowRight size={17} />
              </a>
            </div>
            <p className="hero-footnote">
              <MapPin size={14} strokeWidth={1.8} /> Melbourne based. Drawn
              with love.
            </p>
          </div>
          <div className="hero-art">
            <div className="hero-blob" aria-hidden="true" />
            <ArtImage
              className="hero-avatar"
              src={avatar.src}
              srcSet={avatar.srcSet}
              sizes="(max-width: 700px) 80vw, 460px"
              alt={avatar.alt}
              loading="eager"
              fetchPriority="high"
            />
            <span className="speech-bubble" aria-hidden="true">
              hi, I’m Yvonne!
            </span>
            <div className="hero-card wavy-frame frame-pink">
              <ArtImage
                src={kindArt.pet.src}
                srcSet={kindArt.pet.srcSet}
                sizes="180px"
                alt="Marker illustration of a brown poodle with a pink bow"
              />
            </div>
            <Sparkle className="float-sparkle s1" size={30} />
            <Sparkle className="float-sparkle s2" size={18} />
            <Sparkle className="float-sparkle s3" size={24} />
          </div>
        </section>

        <div className="ticker" aria-label="What I draw">
          {['Pets', 'People', 'Couples', 'Weddings', 'Live events', 'Gifts'].map(
            (item) => (
              <span key={item}>
                {item} <Sparkle size={12} />
              </span>
            ),
          )}
        </div>

        <section
          className="paths section-shell"
          aria-labelledby="paths-title"
        >
          <h2 id="paths-title" className="visually-hidden">
            Two ways to work together
          </h2>
          <button className="path-card path-yellow" onClick={() => openPortrait()}>
            <span className="path-icon">
              <Camera size={22} />
            </span>
            <span className="path-label">From your photos</span>
            <strong>Custom portraits</strong>
            <span className="path-text">
              Pets, people and couples, drawn from your favourite photos as a
              digital keepsake or a print.
            </span>
            <span className="path-cta">
              Start a request <ArrowRight size={16} />
            </span>
          </button>
          <button className="path-card path-blue" onClick={openEvent}>
            <span className="path-icon">
              <PartyPopper size={22} />
            </span>
            <span className="path-label">At your celebration</span>
            <strong>Live illustration</strong>
            <span className="path-text">
              Guests sit for a quick, joyful portrait and take home a little
              hand-drawn memory.
            </span>
            <span className="path-cta">
              Enquire about your event <ArrowRight size={16} />
            </span>
          </button>
        </section>

        <section
          className="work-section section-shell"
          id="work"
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <p className="eyebrow">The lovely things</p>
            <h2 id="work-title">A little portfolio</h2>
            <p>
              Real pieces, photographed in my studio. Every one started as a
              photo and a story.
            </p>
          </div>
          <div
            className="gallery-filters"
            role="group"
            aria-label="Filter portfolio"
          >
            {filters.map((item) => (
              <button
                key={item}
                className={filter === item ? 'active' : ''}
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
              >
                {item}
                <span className="filter-count" aria-hidden="true">
                  {count(item)}
                </span>
              </button>
            ))}
          </div>
          <p className="visually-hidden" aria-live="polite">
            Showing {shown.length} pieces
          </p>
          <div className="art-gallery">
            {shown.map((piece, i) => (
              <button
                className={`gallery-piece tilt-${i % 3} ${i % 2 ? 'shadow-sky' : 'shadow-butter'}`}
                key={piece.id}
                aria-label={`${piece.title}: a closer look`}
                onClick={() => setModal({ type: 'artwork', piece })}
              >
                <span className="gallery-frame">
                  <ArtImage src={piece.src} srcSet={piece.srcSet} alt={piece.alt} />
                </span>
                <span className="gallery-caption">
                  <span className="piece-title">{piece.title}</span>
                  <span className="piece-note">{piece.note}</span>
                  <span className="piece-tag">{piece.category}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section
          className="portraits-section"
          id="portraits"
          aria-labelledby="portraits-title"
        >
          <div className="section-shell portrait-inner">
            <div className="portrait-art">
              <ArtImage
                className="portrait-photo"
                src={wavyTrio.src}
                srcSet={wavyTrio.srcSet}
                sizes="(max-width: 800px) 90vw, 460px"
                alt={wavyTrio.alt}
              />
              <span className="handwritten-note portrait-note">
                Billy, Winston &amp; a pink bow pup
              </span>
              <Sparkle className="float-sparkle s4" size={26} />
            </div>
            <div className="portrait-copy">
              <p className="eyebrow">Custom portraits</p>
              <h2 id="portraits-title">Some gifts say a lot. This one says you.</h2>
              <p>
                For your favourite human, your whole little crew, or the
                four-legged love of your life. I draw the little things:
                the bow they always wear, the way they tilt their head.
              </p>
              <ul className="kind-list">
                {(
                  [
                    ['pet', 'Pets', 'floofs, snoots & bows'],
                    ['family', 'People', 'friends, family & you'],
                    ['couple', 'Couples', 'anniversaries & weddings'],
                  ] as const
                ).map(([kind, label, detail]) => (
                  <li key={kind}>
                    <button onClick={() => openPortrait(kind)}>
                      <span className={`kind-thumb wavy-frame frame-${kindArt[kind].frame}`}>
                        <ArtImage
                          src={kindArt[kind].src}
                          srcSet={kindArt[kind].srcSet}
                          sizes="90px"
                          alt=""
                        />
                      </span>
                      <span>
                        <strong>{label}</strong>
                        <small>{detail}</small>
                      </span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className="button button-primary"
                onClick={() => openPortrait()}
              >
                Create my little keepsake <ArrowUpRight size={18} />
              </button>
              <p className="small-note">
                Every request gets a personal quote before any payment.
              </p>
            </div>
          </div>
        </section>

        <section
          className="live-section"
          id="live"
          aria-labelledby="live-title"
        >
          <div className="section-shell live-inner">
            <div className="live-copy">
              <p className="eyebrow">Live illustration</p>
              <h2 id="live-title">Good company. Great memories. A little drawn magic.</h2>
              <p>
                An experience to delight your guests, and a keepsake to remember
                it by. I draw the lovely faces at your event, one joyful little
                portrait at a time.
              </p>
              <div className="occasion-tags">
                <span>Weddings</span>
                <span>Brand events</span>
                <span>Birthdays</span>
                <span>Celebrations</span>
              </div>
              <button className="button button-dark" onClick={openEvent}>
                Let’s draw a crowd <ArrowUpRight size={18} />
              </button>
              <span className="live-location">
                <MapPin size={13} /> Melbourne &amp; beyond, by arrangement
              </span>
            </div>
            <div className="live-art">
              <figure className="live-card card-one">
                <ArtImage
                  src={kindArt.couple.src}
                  srcSet={kindArt.couple.srcSet}
                  sizes="300px"
                  alt={kindArt.couple.alt}
                />
                <figcaption>bundled up &amp; in love</figcaption>
              </figure>
              <figure className="live-card card-two">
                <ArtImage
                  src={pieces.find((p) => p.id === 'wedding-cat')!.src}
                  srcSet={pieces.find((p) => p.id === 'wedding-cat')!.srcSet}
                  sizes="300px"
                  alt={pieces.find((p) => p.id === 'wedding-cat')!.alt}
                />
                <figcaption>just married, plus cat</figcaption>
              </figure>
              <Sparkle className="float-sparkle s5" size={28} />
              <Sparkle className="float-sparkle s6" size={16} />
            </div>
          </div>
        </section>

        <section
          className="process-section section-shell"
          aria-labelledby="process-title"
        >
          <div className="section-heading">
            <p className="eyebrow">How it works</p>
            <h2 id="process-title">From a little idea to a forever thing</h2>
          </div>
          <ol className="process-steps">
            <li>
              <span className="step-number">1</span>
              <h3>Tell me your story</h3>
              <p>
                Pick your portrait or tell me about your event. Share the little
                details that matter to you.
              </p>
            </li>
            <li>
              <span className="step-number">2</span>
              <h3>I add a little magic</h3>
              <p>
                We agree on the details and your quote, then I turn those
                favourite faces into something full of life.
              </p>
            </li>
            <li>
              <span className="step-number">3</span>
              <h3>Keep the feeling forever</h3>
              <p>
                A thoughtful gift, a joyful moment, and a little piece of art
                that’s entirely yours.
              </p>
            </li>
          </ol>
        </section>

        <section
          className="about-section section-shell"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="about-art">
            <div className="about-blob" aria-hidden="true" />
            <ArtImage
              className="about-avatar"
              src={avatar.src}
              srcSet={avatar.srcSet}
              sizes="(max-width: 800px) 80vw, 420px"
              alt={avatar.alt}
            />
            <span className="handwritten-note about-note">
              that’s me, sprout and all
            </span>
            <Sparkle className="float-sparkle s7" size={24} />
          </div>
          <div className="about-copy">
            <p className="eyebrow">Meet Yvonne</p>
            <h2 id="about-title">Hello, I’m Yvonne!</h2>
            <p>
              I’m an illustrator based in Melbourne, drawing heartfelt little
              portraits with markers and bringing a bit of creative joy to
              celebrations.
            </p>
            <p>
              I’m here for the small details: the pink bow, the favourite
              beanie, those wonderfully wonky ears. The little things that make
              a portrait feel like <em>you</em>.
            </p>
            <p>
              You’ll find my pieces signed{' '}
              <span className="handle">@itseevee_world</span>. Welcome to my
              little corner of the world. I’m so happy you’re here.
            </p>
            <span className="signature">
              with love, Yvonne <Heart size={18} strokeWidth={2} />
            </span>
          </div>
        </section>

        <section
          className="faq-section section-shell"
          id="faq"
          aria-labelledby="faq-title"
        >
          <div className="faq-heading">
            <p className="eyebrow">A few little answers</p>
            <h2 id="faq-title">Wondering about something?</h2>
            <p>Here’s a little help to get you started.</p>
            <button className="text-link" onClick={openEvent}>
              Let’s have a chat <ArrowUpRight size={17} />
            </button>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <ChevronDown size={18} aria-hidden="true" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="final-cta" aria-labelledby="cta-title">
          <Sparkle className="cta-sparkle left" size={34} />
          <div>
            <p className="eyebrow">Let’s make something meaningful</p>
            <h2 id="cta-title">Your people, drawn with love.</h2>
            <p>For the faces and moments you never want to forget.</p>
            <div className="cta-actions">
              <button
                className="button button-primary"
                onClick={() => openPortrait()}
              >
                Make it personal <ArrowUpRight size={17} />
              </button>
              <button className="button button-outline" onClick={openEvent}>
                Bring art to my event <ArrowUpRight size={17} />
              </button>
            </div>
          </div>
          <Sparkle className="cta-sparkle right" size={24} />
        </section>
      </main>

      <footer className="site-footer section-shell">
        <div className="footer-top">
          <a className="wordmark footer-wordmark" href="#">
            <Wordmark />
          </a>
          <p>A little art. A lot of heart.</p>
          <div className="footer-links">
            <a href="#work">Portfolio</a>
            <a href="#about">Meet Yvonne</a>
            <a href="#faq">Little questions</a>
          </div>
          <button className="footer-hello" onClick={openEvent}>
            Say a little hello <ArrowUpRight size={20} />
          </button>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Yvonne Studios · Melbourne, Australia
          </span>
          <span>All artwork © Yvonne · @itseevee_world</span>
          <button onClick={() => setModal({ type: 'privacy' })}>
            Privacy &amp; studio preview
          </button>
        </div>
      </footer>

      {modal?.type === 'portrait' && (
        <PortraitForm initialKind={modal.kind} onClose={close} />
      )}
      {modal?.type === 'event' && <EventForm onClose={close} />}
      {modal?.type === 'artwork' && (
        <Dialog title={`A closer look: ${modal.piece.title}`} onClose={close}>
          <div className="artwork-detail">
            <div className={`detail-frame wavy-frame frame-${modal.piece.frame}`}>
              <ArtImage
                src={modal.piece.src}
                srcSet={modal.piece.srcSet}
                sizes="(max-width: 700px) 85vw, 420px"
                alt={modal.piece.alt}
                loading="eager"
              />
            </div>
            <div>
              <p className="eyebrow">{modal.piece.category}</p>
              <h2>{modal.piece.title}</h2>
              <p>{modal.piece.note}</p>
              <p>
                Hand-drawn with markers from a favourite photo, with the name
                lettered by hand and a sprinkle of sparkles.
              </p>
              <button
                className="button button-primary"
                onClick={() =>
                  setModal({ type: 'portrait', kind: modal.piece.kind })
                }
              >
                Make one yours <ArrowUpRight size={17} />
              </button>
            </div>
          </div>
        </Dialog>
      )}
      {modal?.type === 'privacy' && (
        <Dialog title="Privacy and studio preview" onClose={close}>
          <div className="privacy-content">
            <p className="eyebrow">A little transparency</p>
            <h2>Your details, handled with care.</h2>
            <p>
              This is a studio website preview with temporary business details.
              No payment is collected and no booking is confirmed through this
              preview.
            </p>
            <p>
              When you submit a form, your name, email, project details and any
              reference photo are saved privately on the studio server to
              prepare your quote. They are not displayed publicly. Email
              delivery is not connected yet.
            </p>
            <p>
              Only upload photos you have permission to share. To ask about a
              stored request, keep your reference number and contact the studio
              owner directly. A final privacy policy and contact details will be
              added before public launch.
            </p>
            <button className="button button-primary" onClick={close}>
              Back to the lovely things <ArrowRight size={16} />
            </button>
          </div>
        </Dialog>
      )}
    </>
  )
}

export default App
