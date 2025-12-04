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

const MAX_PATTERN = 2 ** 20
const MIN_SPEED = 0
const MAX_SPEED = 0.05

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  cellSize: 11,
  colorShift: 0,
  patternIntensity: 0.5,
  patternOffset: 0,
  speedIntensity: 0.25,
  windowSize: { width: 0, height: 0 },
  isCanvasReady: false,

  // Computed values
  pattern: () => {
    const state = get()
    // Smooth the top end to avoid aliasing: compress 0.95-1.0 more gradually
    let adjustedIntensity = state.patternIntensity

    if (adjustedIntensity > 0.95) {
      // Map 0.95→1.0 to 0.95→0.99 using a smooth curve
      const overage = (adjustedIntensity - 0.95) / 0.05 // 0→1

      adjustedIntensity = 0.95 + overage * 0.04 // Maps to 0.95→0.99
    }

    return adjustedIntensity === 0 ? 0 : Math.pow(MAX_PATTERN, adjustedIntensity) - 1
  },

  speed: () => {
    const state = get()

    return MIN_SPEED + state.speedIntensity * (MAX_SPEED - MIN_SPEED)
  },

  // Actions
  setWindowSize: (size: WindowSize) => set({ windowSize: size }),

  setCellSize: (size: number) => set({ cellSize: size }),

  setPatternIntensity: (intensity: number) => set({ patternIntensity: intensity, patternOffset: 0 }),

  setSpeedIntensity: (intensity: number) => set({ speedIntensity: intensity }),

  setColorShift: (shift: number) => set({ colorShift: shift }),

  setPatternOffset: (offset: number | ((previous: number) => number)) =>
    set(state => ({
      patternOffset: typeof offset === 'function' ? offset(state.patternOffset) : offset,
    })),

  setCanvasReady: (ready: boolean) => set({ isCanvasReady: ready }),
}))
