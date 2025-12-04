'use client'

import { Box } from '@mui/material'
import { useAppStore } from '@/store/useAppStore'
import { memo, useEffect, useState } from 'react'
import {
  AMBER_BROWN,
  GOLD_NOIR,
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

const CursorIndicator = () => {
  const cursorPosition = useAppStore(state => state.cursorPosition)
  const isCursorActive = useAppStore(state => state.isCursorActive)
  const isCursorOverCanvas = useAppStore(state => state.isCursorOverCanvas)
  const selectedPalette = useAppStore(state => state.selectedPalette)

  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  if (isTouchDevice || !cursorPosition || !isCursorOverCanvas || !isCursorActive) return null

  const glowColor = PALETTE_GLOW_COLORS[selectedPalette] || PALETTE_GLOW_COLORS[0]

  return (
    <Box
      sx={{
        left: cursorPosition.x,
        opacity: isCursorOverCanvas && isCursorActive ? 1 : 0,
        pointerEvents: 'none',
        position: 'fixed',
        top: cursorPosition.y,
        transform: 'translate(-50%, -50%)',
        transition: 'opacity 0.2s ease',
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          background: `radial-gradient(circle, ${glowColor} 4%, transparent 64%)`,
          filter: 'blur(2px)',
          height: 48,
          width: 48,
        }}
      />
    </Box>
  )
}

export default memo(CursorIndicator)
