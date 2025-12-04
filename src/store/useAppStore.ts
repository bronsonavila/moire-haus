import { create } from 'zustand'

interface AppState {
  // State
  colorShift: number
  frequency: number // 0 to 1
  isCanvasReady: boolean
  patternOffset: number
  resolution: number // 0 to 1
  speed: number // 0 to 1
  windowSize: WindowSize

  // Computed Values
  cellSize: () => number
  frequencyScalar: () => number
  speedScalar: () => number

  // Actions
  setCanvasReady: (ready: boolean) => void
  setColorShift: (shift: number) => void
  setFrequency: (frequency: number) => void
  setPatternOffset: (offset: number | ((previous: number) => number)) => void
  setResolution: (resolution: number) => void
  setSpeed: (speed: number) => void
  setWindowSize: (size: WindowSize) => void
}

interface WindowSize {
  height: number
  width: number
}

export const RESOLUTION_MIN = 1
export const RESOLUTION_MAX = 31

const RESOLUTION_RANGE = RESOLUTION_MAX - RESOLUTION_MIN

const MAX_FREQUENCY = 2 ** 20

const MIN_SPEED = 0
const MAX_SPEED = 0.05

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const resolutionValueToCellSize = (value: number) => {
  const normalizedValue = clamp(value, 0, 1)

  return clamp(RESOLUTION_MAX - normalizedValue * RESOLUTION_RANGE, RESOLUTION_MIN, RESOLUTION_MAX)
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State

  colorShift: 0,
  frequency: 0.5,
  isCanvasReady: false,
  patternOffset: 0,
  resolution: 0.75,
  speed: 0.25,
  windowSize: { height: 0, width: 0 },

  // Computed Values

  cellSize: () => resolutionValueToCellSize(get().resolution),

  // Converts linear 0-1 slider value to exponential pattern frequency.
  frequencyScalar: () => {
    const state = get()

    // Smooth the top end to avoid aliasing: compress 0.95-1.0 more gradually.
    let adjustedFrequency = state.frequency

    if (adjustedFrequency > 0.95) {
      // Map 0.95→1.0 to 0.95→0.99 using a smooth curve.
      const overage = (adjustedFrequency - 0.95) / 0.05 // 0→1

      adjustedFrequency = 0.95 + overage * 0.04 // 0.95→0.99
    }

    return adjustedFrequency === 0 ? 0 : Math.pow(MAX_FREQUENCY, adjustedFrequency) - 1
  },

  // Maps linear 0-1 slider value to animation speed range.
  speedScalar: () => {
    const state = get()

    return MIN_SPEED + state.speed * (MAX_SPEED - MIN_SPEED)
  },

  // Actions

  setCanvasReady: (ready: boolean) => set({ isCanvasReady: ready }),

  setColorShift: (shift: number) => set({ colorShift: shift }),

  setFrequency: (frequency: number) => set({ frequency, patternOffset: 0 }),

  setPatternOffset: (offset: number | ((previous: number) => number)) =>
    set(state => ({
      patternOffset: typeof offset === 'function' ? offset(state.patternOffset) : offset,
    })),

  setResolution: (resolution: number) => set({ resolution: clamp(resolution, 0, 1) }),

  setSpeed: (speed: number) => set({ speed }),

  setWindowSize: (size: WindowSize) => set({ windowSize: size }),
}))
