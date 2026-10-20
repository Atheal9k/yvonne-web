import { useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Heart,
  MapPin,
  Menu,
  PenLine,
  Sparkles,
  X,
} from 'lucide-react'
import { Artwork, DoodleFlower } from './components/Artwork'
import type { ArtworkKind } from './components/Artwork'
import { Dialog, EventForm, PortraitForm } from './components/RequestDialog'
import './App.css'

type Modal =
  | { type: 'portrait'; kind?: ArtworkKind }
  | { type: 'event' }
  | { type: 'artwork'; kind: ArtworkKind }
  | { type: 'privacy' }
  | null
const pieces: {
  kind: ArtworkKind
  title: string
  category: string
  note: string
  tag: string
}[] = [
  {
    kind: 'live',
    title: 'The beginning of forever',
    category: 'Couples',
    note: 'For the just-married kind of magic.',
    tag: 'LOVE, ON PAPER',
  },
  {
    kind: 'pet',
    title: 'Your very best friend',
    category: 'Pets',
    note: 'Big personalities. Little paw prints.',
    tag: 'THE GOOD DOG CLUB',
  },
  {
    kind: 'family',
    title: 'All your favourite people',
    category: 'Families',
    note: 'Your wonderfully one-of-a-kind crew.',
    tag: 'THE WHOLE LITTLE WORLD',
  },
]
const faqs = [
  [
    'How do custom portraits work?',
    'Choose who you’d like illustrated and your preferred format, then share a photo and a few details. I’ll put together a personal quote. Once the details are agreed and payment is arranged, your portrait can begin.',
  ],
  [
    'Can I have my portrait printed?',
    'Absolutely. Choose a digital keepsake or an art print when you make your request. Print size, paper, postage and the final price will be confirmed in your quote.',
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

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState('All the lovely things')
  const [modal, setModal] = useState<Modal>(null)
  const close = () => setModal(null)
  const openPortrait = () => setModal({ type: 'portrait' })
  const openEvent = () => setModal({ type: 'event' })

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to the lovely things
      </a>
      <div className="announcement">
        <span>Little portraits. Lasting memories.</span>
        <span className="announcement-star">✳</span>
        <span>Made with love in Melbourne</span>
        <Heart size={12} />
      </div>
      <header className="site-header">
        <a className="wordmark" href="#" aria-label="Yvonne Studios home">
          <DoodleFlower className="brand-flower" />
          <span>
            yvonne<span className="wordmark-bottom">S T U D I O S</span>
          </span>
        </a>
        <nav
          id="mobile-navigation"
          className={menuOpen ? 'main-nav is-open' : 'main-nav'}
          aria-label="Main navigation"
        >
          {[
            ['The lovely things', '#work'],
            ['Custom portraits', '#portraits'],
            ['Live illustration', '#live'],
            ['Meet Yvonne', '#about'],
          ].map(([name, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {name}
            </a>
          ))}
          <button
            className="mobile-contact"
            onClick={() => {
              setMenuOpen(false)
              openEvent()
            }}
          >
            Let’s chat <ArrowUpRight size={16} />
          </button>
        </nav>
        <button className="button header-button" onClick={openEvent}>
          Let’s make memories <ArrowUpRight size={16} />
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
              <span className="little-line" /> LIVE PORTRAITS & CUSTOM
              ILLUSTRATION
            </p>
            <h1 id="hero-title">
              Little portraits.
              <br />
              Big feelings.
              <br />
              <span className="hero-italic">
                Yours to keep.
                <svg viewBox="0 0 470 19" aria-hidden="true">
                  <path d="M4 12Q230-3 464 7M18 17Q245 4 448 12" />
                </svg>
              </span>
            </h1>
            <p className="hero-description">
              Your favourite people. Your once-in-a-lifetime moments. Turn them
              into joyful, one-of-a-kind illustrations to treasure forever.
            </p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={openPortrait}>
                Find your perfect portrait <ArrowUpRight size={18} />
              </button>
              <a className="text-link" href="#live">
                Planning an event? <ArrowRight size={17} />
              </a>
            </div>
            <div className="hero-footnote">
              <MapPin size={14} strokeWidth={1.5} />
              <span>Melbourne based. Heartfelt, everywhere.</span>
            </div>
          </div>
          <div className="hero-art-area">
            <span className="hero-spark spark-one">✳</span>
            <span className="hero-spark spark-two">✧</span>
            <div className="art-backdrop" />
            <div className="hero-paper">
              <div className="paper-tape" />
              <Artwork
                kind="couple"
                label="Whimsical SVG portrait of a couple and their little golden dog, surrounded by flowers"
              />
              <div className="paper-caption">
                <span>A love like no other.</span>
                <Heart size={13} />
              </div>
            </div>
            <div className="keepsake-sticker">
              <span>MADE BY HAND</span>
              <Heart size={23} strokeWidth={1.4} />
              <em>kept by heart</em>
            </div>
            <div className="handwritten hero-annotation">
              a little piece
              <br />
              of your story
              <svg viewBox="0 0 95 64" aria-hidden="true">
                <path d="M86 6Q92 59 10 49M10 49L25 40M10 49L22 59" />
              </svg>
            </div>
          </div>
        </section>

        <div className="values-strip">
          <span>
            <PenLine /> A little hand-drawn happiness
          </span>
          <span className="strip-star">✳</span>
          <span>
            <Heart /> Thoughtful gifts, forever keepsakes
          </span>
          <span className="strip-star">✳</span>
          <span>
            <MapPin /> From Melbourne, with love
          </span>
          <span className="strip-star last-star">✳</span>
        </div>

        <section
          className="work-section section-shell"
          id="work"
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE LOVELY THINGS</p>
              <h2 id="work-title">
                Real people.
                <br />
                <em>A little extra wonder.</em>
              </h2>
            </div>
            <div className="heading-aside">
              <p>
                A celebration of love, little quirks,
                <br />
                and the things that make us, us.
              </p>
              <a className="text-link" href="#portraits">
                Something made just for you <ArrowDownRight size={18} />
              </a>
            </div>
          </div>
          <div
            className="gallery-filters"
            role="group"
            aria-label="Filter portrait gallery"
          >
            {['All the lovely things', 'Couples', 'Families', 'Pets'].map(
              (item) => (
                <button
                  key={item}
                  className={filter === item ? 'active' : ''}
                  aria-pressed={filter === item}
                  onClick={() => setFilter(item)}
                >
                  {item}
                  {filter === item && <span>✳</span>}
                </button>
              ),
            )}
          </div>
          <div className="art-gallery">
            {pieces
              .filter(
                (piece) =>
                  filter === 'All the lovely things' ||
                  piece.category === filter,
              )
              .map((piece, i) => (
                <button
                  className={`gallery-piece piece-${piece.kind}`}
                  key={piece.kind}
                  onClick={() =>
                    setModal({ type: 'artwork', kind: piece.kind })
                  }
                >
                  <div className="gallery-art">
                    <span className="art-tag">{piece.tag}</span>
                    <div className={`gallery-paper paper-${i}`}>
                      <Artwork kind={piece.kind} />
                    </div>
                    <span className="view-artwork">
                      A closer look <ArrowUpRight size={17} />
                    </span>
                    {piece.kind === 'pet' && (
                      <span className="pet-doodle">woof! ♡</span>
                    )}
                  </div>
                  <div className="gallery-caption">
                    <div>
                      <h3>{piece.title}</h3>
                      <p>{piece.note}</p>
                    </div>
                    <span className="round-arrow">
                      <ArrowUpRight size={19} />
                    </span>
                  </div>
                </button>
              ))}
          </div>
          <p className="sample-note">
            A little inspiration: sample SVG illustrations. Your real-life story
            makes the final artwork yours.
          </p>
        </section>

        <section
          className="portraits-section"
          id="portraits"
          aria-labelledby="portraits-title"
        >
          <div className="section-shell portrait-inner">
            <div className="portrait-still-life">
              <div className="gingham-mat" />
              <div className="little-portrait">
                <Artwork kind="family" />
                <span>The people who feel like home.</span>
              </div>
              <div className="gift-tag">
                <Heart size={20} />
                <span>
                  For someone
                  <br />
                  <em>pretty special.</em>
                </span>
              </div>
              <DoodleFlower className="portrait-flower" />
            </div>
            <div className="portrait-copy">
              <p className="eyebrow">PERSONAL. PLAYFUL. COMPLETELY YOURS.</p>
              <h2 id="portraits-title">
                Some gifts say a lot.
                <br />
                <em>This one says you.</em>
              </h2>
              <p>
                For your favourite human, your whole little family, or the
                four-legged love of your life. A custom portrait captures all
                the little things that make them special.
              </p>
              <ul className="check-list">
                <li>
                  <Check /> Thoughtfully illustrated from your favourite photos
                </li>
                <li>
                  <Check /> Couples, families, pets & wonderfully unique people
                </li>
                <li>
                  <Check /> Digital keepsakes or art prints to make a house a
                  home
                </li>
              </ul>
              <button className="button button-primary" onClick={openPortrait}>
                Create my little keepsake <ArrowUpRight size={18} />
              </button>
              <p className="small-note">
                A personal quote. A personal portrait. A whole lot of heart.
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
              <p className="eyebrow">LIVE ILLUSTRATION, LOVELY CONNECTIONS</p>
              <h2 id="live-title">
                Good company.
                <br />
                Great memories.
                <br />
                <em>A little drawn magic.</em>
              </h2>
              <p>
                An experience to delight your guests, and a keepsake to remember
                it by. I capture the lovely faces at your event, one joyful
                portrait at a time.
              </p>
              <div className="occasion-tags">
                <span>Weddings</span>
                <span>Brand events</span>
                <span>Celebrations</span>
              </div>
              <button className="button button-dark" onClick={openEvent}>
                Let’s draw a crowd <ArrowUpRight size={18} />
              </button>
              <span className="live-location">
                <MapPin size={13} /> Melbourne & beyond, by arrangement
              </span>
            </div>
            <div className="live-art">
              <div className="live-arch" />
              <div className="live-paper live-paper-one">
                <Artwork kind="live" />
                <span>the happy couple ♡</span>
              </div>
              <div className="live-paper live-paper-two">
                <Artwork kind="family" />
                <span>all together, always</span>
              </div>
              <div className="live-badge">
                <Sparkles size={22} />
                <span>
                  A party favour
                  <br />
                  <em>with personality.</em>
                </span>
              </div>
              <DoodleFlower className="live-flower" />
              <span className="handwritten live-annotation">
                a moment of joy,
                <br />a memory for keeps.
              </span>
            </div>
          </div>
        </section>

        <section
          className="process-section section-shell"
          aria-labelledby="process-title"
        >
          <div className="process-heading">
            <p className="eyebrow">FROM A LITTLE IDEA TO A FOREVER THING</p>
            <h2 id="process-title">
              A little less complicated.
              <br />
              <em>A whole lot more personal.</em>
            </h2>
          </div>
          <div className="process-steps">
            <article>
              <span className="step-number">
                01 <span>✧</span>
              </span>
              <h3>Tell me your story</h3>
              <p>
                Pick your portrait or tell me about your event. Share the little
                details that matter to you.
              </p>
            </article>
            <article>
              <span className="step-number">
                02 <PenLine size={25} strokeWidth={1} />
              </span>
              <h3>I’ll add a little magic</h3>
              <p>
                We’ll agree on all the details, then I’ll turn those favourite
                faces into something full of life.
              </p>
            </article>
            <article>
              <span className="step-number">
                03 <Heart size={25} strokeWidth={1} />
              </span>
              <h3>Keep the feeling forever</h3>
              <p>
                A thoughtful gift. A joyful moment. A little piece of art that’s
                entirely, wonderfully yours.
              </p>
            </article>
          </div>
        </section>

        <section
          className="about-section section-shell"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="about-art">
            <div className="about-art-frame">
              <Artwork
                kind="studio"
                label="SVG illustration of an artist at her studio table"
              />
            </div>
            <span className="handwritten about-note">
              a happy little
              <br />
              place to create ♡
            </span>
            <span className="about-spark">✳</span>
          </div>
          <div className="about-copy">
            <p className="eyebrow">THE HANDS & HEART BEHIND THE ART</p>
            <h2 id="about-title">
              Hello, I’m Yvonne.
              <br />
              <em>
                Your people person.
                <br />
                With a paintbrush.
              </em>
            </h2>
            <p>
              I’m an illustrator based in Melbourne, making heartfelt portraits
              and bringing a little creative joy to celebrations.
            </p>
            <p>
              I’m here for the small details: the way you hold hands, that
              favourite outfit, those wonderfully wonky ears. The little things
              that make a portrait feel like <em>you.</em>
            </p>
            <p>
              Welcome to my little corner of the world. I’m so happy you’re
              here.
            </p>
            <span className="signature">
              with love, Yvonne <Heart size={19} strokeWidth={1.3} />
            </span>
          </div>
        </section>

        <section
          className="faq-section section-shell"
          id="faq"
          aria-labelledby="faq-title"
        >
          <div className="faq-heading">
            <p className="eyebrow">A FEW LITTLE ANSWERS</p>
            <h2 id="faq-title">
              Wondering
              <br />
              <em>about something?</em>
            </h2>
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
                  <ChevronDown size={18} />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="final-cta">
          <DoodleFlower className="cta-flower flower-left" />
          <div>
            <p className="eyebrow">LET’S MAKE SOMETHING MEANINGFUL</p>
            <h2>
              Your memories.
              <br />
              <em>A little more magical.</em>
            </h2>
            <p>For the people and the moments you never want to forget.</p>
            <div className="cta-actions">
              <button className="button button-primary" onClick={openPortrait}>
                Make it personal <ArrowUpRight size={17} />
              </button>
              <button className="button button-outline" onClick={openEvent}>
                Bring art to my event <ArrowUpRight size={17} />
              </button>
            </div>
          </div>
          <DoodleFlower className="cta-flower flower-right" />
          <span className="cta-star">✦</span>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <div className="footer-top">
          <a className="wordmark footer-wordmark" href="#">
            <DoodleFlower className="brand-flower" />
            <span>
              yvonne<span className="wordmark-bottom">S T U D I O S</span>
            </span>
          </a>
          <p>
            A little art.
            <br />A lot of heart.
          </p>
          <div className="footer-links">
            <a href="#work">The lovely things</a>
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
          <span>Made with love & a little imagination ♡</span>
          <button onClick={() => setModal({ type: 'privacy' })}>
            Privacy & studio preview
          </button>
        </div>
      </footer>

      {modal?.type === 'portrait' && (
        <PortraitForm initialKind={modal.kind} onClose={close} />
      )}
      {modal?.type === 'event' && <EventForm onClose={close} />}
      {modal?.type === 'artwork' && (
        <Dialog title="A closer look at the illustration" onClose={close}>
          <div className="artwork-detail">
            <Artwork kind={modal.kind} />
            <div>
              <p className="eyebrow">A LITTLE INSPIRATION</p>
              <h2>{pieces.find((p) => p.kind === modal.kind)?.title}</h2>
              <p>
                An illustration that celebrates your story, your favourite
                faces, and all the details in between.
              </p>
              <p className="form-note">
                Sample SVG artwork, shown as inspiration for your own
                commission.
              </p>
              <button
                className="button button-primary"
                onClick={() => setModal({ type: 'portrait', kind: modal.kind })}
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
            <p className="eyebrow">A LITTLE TRANSPARENCY</p>
            <h2>
              Your details,
              <br />
              <em>handled with care.</em>
            </h2>
            <p>
              This is a studio website preview with sample SVG artwork and
              temporary business details. No payment is collected and no booking
              is confirmed through this preview.
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
