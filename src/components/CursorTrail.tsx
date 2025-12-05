'use client'

import { useAppStore } from '@/store/useAppStore'
import { memo, useEffect, useRef, useState } from 'react'
import {
  AMBER_BROWN,
  GOLD_NOIR,
  hexToRgb,
  LIME_PURPLE,
  MINT_INDIGO,
  PEACH_CHARCOAL,
  ROSE_VIOLET,
  TEAL_NAVY,
} from '@/utils/palettes'

const PALETTE_GLOW_COLORS = [
  TEAL_NAVY[4], // Bright cyan
  MINT_INDIGO[4], // Mint
  LIME_PURPLE[2], // Lime
  ROSE_VIOLET[3], // Pink
  PEACH_CHARCOAL[3], // Peach
  GOLD_NOIR[4], // Gold
  AMBER_BROWN[4], // Orange
]

const TRAIL_LENGTH = 8

const CursorTrail = () => {
  const cursorPosition = useAppStore(state => state.cursorPosition)
  const isCursorActive = useAppStore(state => state.isCursorActive)
  const isCursorOverCanvas = useAppStore(state => state.isCursorOverCanvas)
  const resolution = useAppStore(state => state.resolution)
  const selectedPalette = useAppStore(state => state.selectedPalette)

  const [dimensions, setDimensions] = useState({ height: 0, width: 0 })
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const animationFrameRef = useRef<number>()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const decayRef = useRef(0) // 0 = Invisible, 1 = Full size.
  const movementTimeoutRef = useRef<NodeJS.Timeout>()
  const shouldDecayRef = useRef(false) // `true` triggers shrink/fade-out.
  const trailRef = useRef<Array<{ x: number; y: number }>>([])

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    setDimensions({ width: window.innerWidth, height: window.innerHeight })

    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight })

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!cursorPosition || !isCursorOverCanvas || !isCursorActive) {
      if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current)

      shouldDecayRef.current = true // Start fade-out on mouse leave.

      return
    }

    shouldDecayRef.current = false // Keep at full size while moving.

    trailRef.current.push({ x: cursorPosition.x, y: cursorPosition.y })

    if (trailRef.current.length > TRAIL_LENGTH) trailRef.current.shift()

    if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current)

    // Start fade-out after 50ms of no movement.
    movementTimeoutRef.current = setTimeout(() => {
      shouldDecayRef.current = true
    }, 50)
  }, [cursorPosition, isCursorOverCanvas, isCursorActive])

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    if (!ctx) return

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (trailRef.current.length === 0) {
        animationFrameRef.current = requestAnimationFrame(render)

        return
      }

      if (decayRef.current < 1 && !shouldDecayRef.current) {
        // Expand animation: Fade in and grow to full size.
        decayRef.current = Math.min(1, decayRef.current + 0.08)
      } else if (shouldDecayRef.current && decayRef.current > 0.01) {
        // Shrink animation: Fade out and shrink.
        decayRef.current *= 0.95
      } else if (shouldDecayRef.current && decayRef.current <= 0.01) {
        // Cleanup when fully faded out.
        trailRef.current = []
        decayRef.current = 0
        shouldDecayRef.current = false
      }

      const glowColor = PALETTE_GLOW_COLORS[selectedPalette] || PALETTE_GLOW_COLORS[0]
      const scale = 1.5 - resolution
      const baseSize = 64 * scale
      const baseOpacity = Math.min(1, 0.6 + scale * 0.5)
      const [r, g, b] = hexToRgb(glowColor)

      // Draw each trail position as a radial gradient (oldest to newest).
      trailRef.current.forEach((point, index) => {
        const progress = (index + 1) / trailRef.current.length // Newer points are larger.
        const size = baseSize * progress * decayRef.current
        const opacity = baseOpacity * progress * 0.8 * decayRef.current

        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size / 2)
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity})`)
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${opacity * 0.4})`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(point.x, point.y, size / 2, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameRef.current = requestAnimationFrame(render)
    }

    animationFrameRef.current = requestAnimationFrame(render)

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [resolution, selectedPalette, dimensions.width])

  if (isTouchDevice || dimensions.width === 0) return null

  return (
    <canvas
      ref={canvasRef}
      height={dimensions.height}
      width={dimensions.width}
      style={{
        height: '100%',
        left: 0,
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 10,
      }}
    />
  )
}

export default memo(CursorTrail)
