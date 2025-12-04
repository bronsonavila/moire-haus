import { memo, useEffect, useRef } from 'react'
import { useAppStore } from '@/store/useAppStore'
import {
  AMBER_BROWN_LUT,
  GOLD_NOIR_LUT,
  LIME_PURPLE_LUT,
  LUT_SIZE,
  MINT_INDIGO_LUT,
  PEACH_CHARCOAL_LUT,
  ROSE_VIOLET_LUT,
  TEAL_NAVY_LUT,
} from '@/utils/palettes'

type CanvasProps = {
  cellSize: number
  colorShift: number
  columns: number
  index: number
  rows: number
}

const Canvas = ({ cellSize, colorShift, columns, index, rows }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageDataRef = useRef<ImageData | null>(null)
  const lastSizeRef = useRef<{ columns: number; rows: number } | null>(null)
  const progressRef = useRef<Float64Array | null>(null)
  const multiplier = useAppStore(state => state.pattern())
  const offset = useAppStore(state => state.patternOffset)
  const setCanvasReady = useAppStore(state => state.setCanvasReady)

  // Use the full multiplier range; split math handles precision
  const frequency = multiplier

  // Cap pixels per frame; upscale via CSS if necessary
  const MAX_PIXELS = 1_000_000
  const totalPixels = columns * rows
  const scaleDown = totalPixels > MAX_PIXELS ? Math.ceil(Math.sqrt(totalPixels / MAX_PIXELS)) : 1
  const drawColumns = Math.max(1, Math.floor(columns / scaleDown))
  const drawRows = Math.max(1, Math.floor(rows / scaleDown))

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })

    if (!ctx) return

    const centerX = drawColumns / 2
    const centerY = drawRows / 2
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY)

    // Reuse ImageData and precomputed progress whenever possible
    if (
      !imageDataRef.current ||
      !lastSizeRef.current ||
      lastSizeRef.current.columns !== drawColumns ||
      lastSizeRef.current.rows !== drawRows
    ) {
      imageDataRef.current = ctx.createImageData(drawColumns, drawRows)
      progressRef.current = new Float64Array(drawColumns * drawRows)
      lastSizeRef.current = { columns: drawColumns, rows: drawRows }

      // Precompute normalized radial progress per pixel once per size
      const progress = progressRef.current

      let k = 0

      for (let j = 0; j < drawRows; j++) {
        const dy = j + 0.5 - centerY

        for (let i = 0; i < drawColumns; i++) {
          const dx = i + 0.5 - centerX
          const distance = Math.sqrt(dx * dx + dy * dy)

          progress[k++] = distance / maxDistance
        }
      }
    }

    const imageData = imageDataRef.current
    const data = imageData.data
    const progress = progressRef.current!

    // Map colorShift index to palette LUT (Cool to Warm)
    const palettes = [
      TEAL_NAVY_LUT,
      MINT_INDIGO_LUT,
      LIME_PURPLE_LUT,
      ROSE_VIOLET_LUT,
      PEACH_CHARCOAL_LUT,
      GOLD_NOIR_LUT,
      AMBER_BROWN_LUT,
    ]
    const paletteLut = palettes[colorShift] || TEAL_NAVY_LUT

    let ptr = 0

    for (let k = 0; k < progress.length; k++) {
      const val1 = (progress[k] * frequency) % 1
      const val2 = (progress[k] * offset) % 1
      const tRaw = (val1 + val2) % 1
      const t = tRaw <= 0.5 ? tRaw * 2 : (1 - tRaw) * 2
      const lutIndex = (t * (LUT_SIZE - 1)) | 0
      const lutPtr = lutIndex * 3

      data[ptr] = paletteLut[lutPtr]
      data[ptr + 1] = paletteLut[lutPtr + 1]
      data[ptr + 2] = paletteLut[lutPtr + 2]
      data[ptr + 3] = 255

      ptr += 4
    }

    ctx.putImageData(imageData, 0, 0)

    setCanvasReady(true)
  }, [cellSize, colorShift, drawColumns, drawRows, index, multiplier, frequency, offset, setCanvasReady])

  return (
    <canvas
      height={drawRows}
      ref={canvasRef}
      style={{ display: 'block', height: '100%', imageRendering: 'pixelated', width: '100%' }}
      width={drawColumns}
    />
  )
}

export default memo(Canvas)
