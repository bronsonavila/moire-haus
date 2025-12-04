// Palette LUT resolution
export const LUT_SIZE = 1024

// Warm, earthy palette with varied yellows, oranges, reds, and browns.
export const AMBER_BROWN = [
  '#fffacc',
  '#fff488',
  '#ffe94d',
  '#ffd600',
  '#ffc933',
  '#ffaa00',
  '#ff9500',
  '#ff7700',
  '#ff5500',
  '#ff3300',
  '#e62e00',
  '#cc2900',
  '#b32400',
  '#991f00',
  '#7f1a00',
  '#663300',
  '#5c3d2e',
  '#523d33',
  '#4a3428',
  '#3d2b1f',
  '#332519',
  '#2b1f15',
  '#1f1610',
  '#15100b',
  '#0a0603',
]

// Magma-like palette with dramatic shifts from cream through orange, red, magenta to black.
export const GOLD_NOIR = [
  '#fffef0',
  '#fff9b8',
  '#ffee77',
  '#ffdc44',
  '#ffc91a',
  '#ffaa00',
  '#ff8800',
  '#ff6600',
  '#ff3d00',
  '#ff1a4d',
  '#ff0066',
  '#dd0077',
  '#bb0088',
  '#990099',
  '#7700aa',
  '#5500bb',
  '#4400aa',
  '#330099',
  '#220088',
  '#110066',
  '#0a0044',
  '#050033',
  '#020022',
  '#010011',
  '#000000',
]

// Electric palette with vivid lime, cyan, green, teal, blue, and deep purple.
export const LIME_PURPLE = [
  '#f4ff00',
  '#d4ff00',
  '#aaff00',
  '#77ff00',
  '#44ff00',
  '#00ff22',
  '#00ff55',
  '#00ff88',
  '#00ffaa',
  '#00ffdd',
  '#00eeff',
  '#00ccff',
  '#00aaff',
  '#0088ff',
  '#0066ff',
  '#0044ff',
  '#0022ff',
  '#1100ff',
  '#3300ff',
  '#5500dd',
  '#6600bb',
  '#660099',
  '#550077',
  '#440055',
  '#220033',
]

// Cool palette with bright mint, aqua, cyan, teal, and midnight blues.
export const MINT_INDIGO = [
  '#eeffee',
  '#ccffdd',
  '#aaffcc',
  '#77ffbb',
  '#44ffaa',
  '#00ff99',
  '#00ff88',
  '#00ee99',
  '#00ddaa',
  '#00ccbb',
  '#00bbcc',
  '#00aadd',
  '#0099dd',
  '#0088cc',
  '#0077bb',
  '#0066aa',
  '#005599',
  '#004488',
  '#003377',
  '#002266',
  '#001155',
  '#000d44',
  '#000933',
  '#000522',
  '#000011',
]

// Dramatic palette with coral, salmon, rose, crimson, maroon, and charcoal.
export const PEACH_CHARCOAL = [
  '#fff5ee',
  '#ffddcc',
  '#ffccaa',
  '#ffaa88',
  '#ff8866',
  '#ff6644',
  '#ff4422',
  '#ff2200',
  '#ee0033',
  '#dd0044',
  '#cc0055',
  '#bb0055',
  '#aa0055',
  '#990044',
  '#880044',
  '#770033',
  '#660033',
  '#550022',
  '#440022',
  '#330011',
  '#2a0011',
  '#220011',
  '#190008',
  '#110005',
  '#080002',
]

// Vibrant palette with hot pink, magenta, fuchsia, purple, and deep violet.
export const ROSE_VIOLET = [
  '#ffeeff',
  '#ffccff',
  '#ffaaff',
  '#ff88ff',
  '#ff66ff',
  '#ff44ff',
  '#ff00ff',
  '#ee00ff',
  '#dd00ff',
  '#cc00ff',
  '#bb00ff',
  '#aa00ee',
  '#9900dd',
  '#8800cc',
  '#7700bb',
  '#6600aa',
  '#550099',
  '#440088',
  '#330077',
  '#280066',
  '#220055',
  '#1c0044',
  '#160033',
  '#110022',
  '#0a0011',
]

// Oceanic palette with seafoam, aqua, cyan, turquoise, and navy blues.
export const TEAL_NAVY = [
  '#eeffff',
  '#ccffff',
  '#aaffff',
  '#88ffff',
  '#66ffff',
  '#44eeff',
  '#22ddee',
  '#00ccdd',
  '#00bbcc',
  '#00aacc',
  '#0099bb',
  '#0088aa',
  '#007799',
  '#006688',
  '#005577',
  '#004466',
  '#003355',
  '#002244',
  '#001a44',
  '#001133',
  '#000d33',
  '#000922',
  '#000622',
  '#000311',
  '#000108',
]

export const buildPaletteLut = (palette: [number, number, number][]) => {
  const lut = new Uint8Array(LUT_SIZE * 3)

  for (let i = 0; i < LUT_SIZE; i++) {
    const t = i / (LUT_SIZE - 1)
    const [r, g, b] = getPaletteColor(palette, t)
    const index = i * 3

    lut[index] = r
    lut[index + 1] = g
    lut[index + 2] = b
  }

  return lut
}

export const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0]
}

export const getPaletteColor = (palette: [number, number, number][], param: number): [number, number, number] => {
  const scaledIndex = param * (palette.length - 1)
  const lowerIndex = Math.floor(scaledIndex)
  const upperIndex = Math.min(lowerIndex + 1, palette.length - 1)
  const fraction = scaledIndex - lowerIndex

  return lerpColor(palette[lowerIndex], palette[upperIndex], fraction)
}

export const lerpColor = (
  c1: [number, number, number],
  c2: [number, number, number],
  t: number
): [number, number, number] => {
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * t)
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * t)
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * t)

  return [r, g, b]
}

export const AMBER_BROWN_RGB = AMBER_BROWN.map(hexToRgb)
export const GOLD_NOIR_RGB = GOLD_NOIR.map(hexToRgb)
export const LIME_PURPLE_RGB = LIME_PURPLE.map(hexToRgb)
export const MINT_INDIGO_RGB = MINT_INDIGO.map(hexToRgb)
export const PEACH_CHARCOAL_RGB = PEACH_CHARCOAL.map(hexToRgb)
export const ROSE_VIOLET_RGB = ROSE_VIOLET.map(hexToRgb)
export const TEAL_NAVY_RGB = TEAL_NAVY.map(hexToRgb)

export const AMBER_BROWN_LUT = buildPaletteLut(AMBER_BROWN_RGB)
export const GOLD_NOIR_LUT = buildPaletteLut(GOLD_NOIR_RGB)
export const LIME_PURPLE_LUT = buildPaletteLut(LIME_PURPLE_RGB)
export const MINT_INDIGO_LUT = buildPaletteLut(MINT_INDIGO_RGB)
export const PEACH_CHARCOAL_LUT = buildPaletteLut(PEACH_CHARCOAL_RGB)
export const ROSE_VIOLET_LUT = buildPaletteLut(ROSE_VIOLET_RGB)
export const TEAL_NAVY_LUT = buildPaletteLut(TEAL_NAVY_RGB)
