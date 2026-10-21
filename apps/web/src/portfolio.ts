// Yvonne's real artwork (photographed pieces). Images live in ./assets/art as
// WebP at two widths; Vite fingerprints them at build time.
const art = import.meta.glob<string>('./assets/art/*.webp', {
  eager: true,
  import: 'default',
})

function srcset(name: string) {
  const files = Object.entries(art)
    .filter(([path]) => path.startsWith(`./assets/art/${name}-`))
    .map(([path, url]) => ({
      url,
      width: Number(path.match(/-(\d+)\.webp$/)?.[1] ?? 0),
    }))
    .sort((a, b) => a.width - b.width)
  if (!files.length) throw new Error(`Missing artwork: ${name}`)
  return {
    src: files[files.length - 1].url,
    srcSet: files.map((f) => `${f.url} ${f.width}w`).join(', '),
  }
}

/** Portrait kinds understood by the request form and the API. */
export type PortraitKind = 'couple' | 'family' | 'pet'
export type Category = 'Pets' | 'People' | 'Couples'

export type Piece = {
  id: string
  title: string
  category: Category
  kind: PortraitKind
  frame: 'lilac' | 'pink' | 'blue' | 'butter' | 'wood'
  note: string
  alt: string
  src: string
  srcSet: string
}

const piece = (p: Omit<Piece, 'src' | 'srcSet'>): Piece => ({
  ...p,
  ...srcset(p.id),
})

export const pieces: Piece[] = [
  piece({
    id: 'billy',
    title: 'Billy',
    category: 'Pets',
    kind: 'pet',
    frame: 'lilac',
    note: 'A cheeky little side-eye, framed in lilac waves.',
    alt: 'Marker illustration of Billy, a white dog with pink ears, with his name hand-lettered underneath, in a wavy lilac frame',
  }),
  piece({
    id: 'pink-bow-pup',
    title: 'Pink bow pup',
    category: 'Pets',
    kind: 'pet',
    frame: 'pink',
    note: 'A fluffy poodle in her Sunday-best bow.',
    alt: 'Marker illustration of a brown poodle wearing a big pink bow, with small yellow sparkles, in a wavy pink frame',
  }),
  piece({
    id: 'winston',
    title: 'Winston',
    category: 'Pets',
    kind: 'pet',
    frame: 'blue',
    note: 'Curly coat, blue bow, tongue out. Very Winston.',
    alt: 'Marker illustration of Winston, a curly brown dog with a blue bow, with his name hand-lettered, in a wavy blue frame',
  }),
  piece({
    id: 'david-shy',
    title: 'David & Shy',
    category: 'People',
    kind: 'family',
    frame: 'butter',
    note: 'Two little people cards, names and sparkles included.',
    alt: 'Two illustrated portrait cards: David with glasses and a flower shirt, and Shy with long braids, each with their name hand-lettered',
  }),
  piece({
    id: 'arjun-karina',
    title: 'Arjun & Karina',
    category: 'Couples',
    kind: 'couple',
    frame: 'blue',
    note: 'Bundled up for winter, and very much in love.',
    alt: 'Illustrated card of a couple, Arjun and Karina, smiling in puffer jackets and a pink beanie, with their names written in the corner',
  }),
  piece({
    id: 'wedding-cat',
    title: 'Just married, plus cat',
    category: 'Couples',
    kind: 'couple',
    frame: 'pink',
    note: 'A wedding keepsake starring the happy couple and their cat.',
    alt: 'Two illustrated cards of a bride in a pink veil and a groom, with their black and white cat between them and a tiny heart above',
  }),
  piece({
    id: 'iris',
    title: 'Iris',
    category: 'Pets',
    kind: 'pet',
    frame: 'butter',
    note: 'Big ears, pink collar, butter-yellow waves.',
    alt: 'Marker illustration of Iris, a tan greyhound-type dog with a pink collar, with her name hand-lettered, in a wavy yellow frame',
  }),
  piece({
    id: 'daphne-hank',
    title: 'Daphne & Hank',
    category: 'Pets',
    kind: 'pet',
    frame: 'lilac',
    note: 'Best friends, each in their own wavy frame.',
    alt: 'Two framed dog illustrations: Daphne, a black and grey dog in a lilac wavy frame, and Hank, a chocolate dog with a bow tie',
  }),
  piece({
    id: 'poodle-wood-frame',
    title: 'Little poodle, framed',
    category: 'Pets',
    kind: 'pet',
    frame: 'wood',
    note: 'Ready for the mantelpiece in a simple wooden frame.',
    alt: 'A brown poodle illustration with a pink bow and sparkles, signed @itseevee_world, displayed in a light wooden box frame',
  }),
]

export const avatar = {
  ...srcset('avatar'),
  alt: 'Yvonne’s self-portrait illustration: a smiling girl with long dark hair and a little sprout on her head, making a heart with her hands, with a pencil in a speech bubble',
}

export const wavyTrio = {
  ...srcset('wavy-trio'),
  alt: 'Three pet portraits in purple, pink and blue wavy frames on a clipboard, beside pink, yellow and blue paint markers',
}

/** Representative artwork for each portrait type in the request form. */
export const kindArt: Record<PortraitKind, Piece> = {
  couple: pieces.find((p) => p.id === 'arjun-karina')!,
  family: pieces.find((p) => p.id === 'david-shy')!,
  pet: pieces.find((p) => p.id === 'pink-bow-pup')!,
}
