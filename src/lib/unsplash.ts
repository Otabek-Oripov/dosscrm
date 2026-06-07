/**
 * Deterministic Unsplash image URL generator.
 * DossCrm uses streetwear/urban fashion photography to feel distinct.
 */

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

type Opts = {
  seed?: string | number
  w?: number
  h?: number
}

export function unsplash(terms: string | string[], opts: Opts = {}): string {
  const q = Array.isArray(terms) ? terms.join(",") : terms
  const w = opts.w ?? 800
  const h = opts.h ?? 600
  const sig =
    typeof opts.seed === "number"
      ? opts.seed
      : hash(String(opts.seed ?? q))
  return `https://source.unsplash.com/${w}x${h}/?${encodeURIComponent(q)}&sig=${sig}`
}

/* Streetwear / urban fashion editorial */
const STREET_HEROES = [
  "1490481651871-ab68de25d43d",
  "1492707892479-7bc8d5a4ee93",
  "1539109136881-3be0616acf4b",
  "1483985988355-763728e1935b",
  "1469334031218-e382a71b716b",
  "1543610892-0b1f7e6d8ac1",
  "1517245386807-bb43f82c33c4",
  "1495105787522-5334e3ffa0ef",
  "1604176354204-9268737828e4",
  "1539109136881-3be0616acf4b",
]

/* Streetwear products / sneakers / accessories */
const STREET_PRODUCTS = [
  "1542291026-7eec264c27ff",
  "1549298916-b41d501d3772",
  "1595950653106-6c9ebd614d3a",
  "1525966222134-fcfa99b8ae77",
  "1556906781-9a412961c28c",
  "1542293787938-c9e299b88010",
  "1551488831-00ddcb6c6bd3",
  "1591047139829-d91aecb6caea",
]

const STREET_PORTRAITS = [
  "1488161628813-04466f872be2",
  "1517841905240-472988babdf9",
  "1525361956193-d7a4cdaa1a04",
  "1539571696357-5a69c17a67c6",
  "1494790108377-be9c29b29330",
  "1531746020798-e6953c6e8e04",
]

const WORKSPACE_DARK = [
  "1517245386807-bb43f82c33c4",
  "1604176354204-9268737828e4",
  "1542291026-7eec264c27ff",
  "1542293787938-c9e299b88010",
  "1497366216548-37526070297c",
]

function pick(arr: string[], seed: string | number): string {
  const idx = (typeof seed === "number" ? seed : hash(String(seed))) % arr.length
  return arr[idx]
}

function direct(id: string, w: number, h: number): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`
}

export function fashionHero(seed: string | number = "hero", w = 1200, h = 900): string {
  return direct(pick(STREET_HEROES, seed), w, h)
}

export function fashionProduct(seed: string | number, w = 400, h = 500): string {
  return direct(pick(STREET_PRODUCTS, seed), w, h)
}

export function fashionPortrait(seed: string | number = "portrait", w = 800, h = 1200): string {
  return direct(pick(STREET_PORTRAITS, seed), w, h)
}

export function workspaceImage(seed: string | number = "workspace", w = 600, h = 400): string {
  return direct(pick(WORKSPACE_DARK, seed), w, h)
}
