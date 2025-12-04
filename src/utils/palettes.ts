// Palette LUT resolution
export const LUT_SIZE = 1024

// Warm, earthy palette from sunlight yellow to deep mahogany.
export const AMBER_BROWN = [
  '#fded86',
  '#fde86e',
  '#f9d063',
  '#f5b857',
  '#f0a04b',
  '#eb8a40',
  '#e77235',
  '#e35b2c',
  '#c74e29',
  '#9d4429',
  '#753c2c',
  '#4c3430',
]

// Magma-like palette from pale yellow through orange/red to dark purple/black.
export const GOLD_NOIR = [
  '#fcfdbf',
  '#f7feae',
  '#fdc980',
  '#fd9a6a',
  '#f6765b',
  '#e6554d',
  '#c43c4e',
  '#9c2e5a',
  '#741f59',
  '#4c1452',
  '#260c38',
  '#0b0405',
]

// Viridis-like palette from bright lime yellow to deep purple.
export const LIME_PURPLE = [
  '#fde725',
  '#dce319',
  '#b8de29',
  '#95d840',
  '#73d055',
  '#55c667',
  '#3cbb75',
  '#29af7f',
  '#20a387',
  '#287d8e',
  '#33638d',
  '#440154',
]

// Mako-like palette from icy mint/cyan to deep indigo.
export const MINT_INDIGO = [
  '#def5e5',
  '#ade3c0',
  '#6cd3ad',
  '#43bbad',
  '#35a1ab',
  '#3487a6',
  '#366da0',
  '#3d5296',
  '#403a75',
  '#35264c',
  '#231526',
  '#0b0405',
]

// Rocket-like palette from soft peach/rose to deep charcoal/red-black.
export const PEACH_CHARCOAL = [
  '#f3e3e8',
  '#eac5c7',
  '#dfa3a6',
  '#d47e87',
  '#c55a68',
  '#b03b4e',
  '#962238',
  '#780e27',
  '#59061c',
  '#3b0515',
  '#21060f',
  '#03051a',
]

// Vibrant palette from soft peach to deep violet.
export const ROSE_VIOLET = [
  '#f9cdac',
  '#f3aca2',
  '#ee8b97',
  '#e96a8d',
  '#db5087',
  '#b8428c',
  '#973490',
  '#742796',
  '#5e1f88',
  '#4d1a70',
  '#3d1459',
  '#2d0f41',
]

// Cool-toned palette from pale seafoam to deep midnight blue.
export const TEAL_NAVY = [
  '#dcecc9',
  '#b3ddcc',
  '#8acdce',
  '#62bed2',
  '#46aace',
  '#3d91be',
  '#3577ae',
  '#2d5e9e',
  '#24448e',
  '#1c2b7f',
  '#162065',
  '#11174b',
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
