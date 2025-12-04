import { create } from 'zustand'

interface AppState {
  // State
  windowSize: WindowSize
  cellSize: number
  patternIntensity: number
  speedIntensity: number
  colorShift: number
  patternOffset: number
  isCanvasReady: boolean

  // Computed values
  pattern: () => number
  speed: () => number

  // Actions
  setWindowSize: (size: WindowSize) => void
  setCellSize: (size: number) => void
  setPatternIntensity: (intensity: number) => void
  setSpeedIntensity: (intensity: number) => void
  setColorShift: (shift: number) => void
  setPatternOffset: (offset: number | ((previous: number) => number)) => void
  setCanvasReady: (ready: boolean) => void
}

interface WindowSize {
  width: number
  height: number
}

export const RESOLUTION_MIN = 1
export const RESOLUTION_MAX = 31
const RESOLUTION_RANGE = RESOLUTION_MAX - RESOLUTION_MIN

const MAX_PATTERN = 2 ** 20
const MIN_SPEED = 0
const MAX_SPEED = 0.05

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const cellSizeToResolutionValue = (cellSize: number) => {
  const clampedCellSize = clamp(cellSize, RESOLUTION_MIN, RESOLUTION_MAX)

  return (RESOLUTION_MAX - clampedCellSize) / RESOLUTION_RANGE
}

export const resolutionValueToCellSize = (value: number) => {
  const normalizedValue = clamp(value, 0, 1)

  return clamp(RESOLUTION_MAX - normalizedValue * RESOLUTION_RANGE, RESOLUTION_MIN, RESOLUTION_MAX)
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State

  cellSize: 8.5,
  colorShift: 0,
  isCanvasReady: false,
  patternIntensity: 0.5,
  patternOffset: 0,
  speedIntensity: 0.25,
  windowSize: { width: 0, height: 0 },

  // Computed Values

  pattern: () => {
    const state = get()

    // Smooth the top end to avoid aliasing: compress 0.95-1.0 more gradually.
    let adjustedIntensity = state.patternIntensity

    if (adjustedIntensity > 0.95) {
      // Map 0.95→1.0 to 0.95→0.99 using a smooth curve.
      const overage = (adjustedIntensity - 0.95) / 0.05 // 0→1

      adjustedIntensity = 0.95 + overage * 0.04 // 0.95→0.99
    }

    return adjustedIntensity === 0 ? 0 : Math.pow(MAX_PATTERN, adjustedIntensity) - 1
  },

  speed: () => {
    const state = get()

    return MIN_SPEED + state.speedIntensity * (MAX_SPEED - MIN_SPEED)
  },

  // Actions

  setWindowSize: (size: WindowSize) => set({ windowSize: size }),

  setCellSize: (size: number) => set({ cellSize: clamp(size, RESOLUTION_MIN, RESOLUTION_MAX) }),

  setPatternIntensity: (intensity: number) => set({ patternIntensity: intensity, patternOffset: 0 }),

  setSpeedIntensity: (intensity: number) => set({ speedIntensity: intensity }),

  setColorShift: (shift: number) => set({ colorShift: shift }),

  setPatternOffset: (offset: number | ((previous: number) => number)) =>
    set(state => ({
      patternOffset: typeof offset === 'function' ? offset(state.patternOffset) : offset,
    })),

  setCanvasReady: (ready: boolean) => set({ isCanvasReady: ready }),
}))
