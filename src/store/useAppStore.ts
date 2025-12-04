import { create } from 'zustand'

interface AppState {
  // State
  animationPhase: number
  cursorPosition: { x: number; y: number } | null
  frequency: number // 0 to 1
  isCanvasReady: boolean
  isCursorActive: boolean
  isCursorOverCanvas: boolean
  resolution: number // 0 to 1
  selectedPalette: number
  speed: number // 0 to 1
  windowSize: WindowSize

  // Computed Values
  cellSize: () => number
  frequencyScalar: () => number
  speedScalar: () => number

  // Actions
  setAnimationPhase: (phase: number | ((previous: number) => number)) => void
  setCanvasReady: (ready: boolean) => void
  setCursorActive: (isActive: boolean) => void
  setCursorOverCanvas: (isOver: boolean) => void
  setCursorPosition: (position: { x: number; y: number } | null) => void
  setFrequency: (frequency: number) => void
  setResolution: (resolution: number) => void
  setSelectedPalette: (index: number) => void
  setSpeed: (speed: number) => void
  setWindowSize: (size: WindowSize) => void
}

interface WindowSize {
  height: number
  width: number
}

const CELL_SIZE_MIN = 1
const CELL_SIZE_MAX = 16
const CELL_SIZE_RANGE = CELL_SIZE_MAX - CELL_SIZE_MIN

const FREQUENCY_MAX = 2 ** 20

const SPEED_MIN = 0
const SPEED_MAX = 0.05

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const resolutionValueToCellSize = (value: number) => {
  const normalizedValue = clamp(value, 0, 1)

  return clamp(CELL_SIZE_MAX - normalizedValue * CELL_SIZE_RANGE, CELL_SIZE_MIN, CELL_SIZE_MAX)
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State

  animationPhase: 0,
  cursorPosition: null,
  frequency: 0.5,
  isCanvasReady: false,
  isCursorActive: true,
  isCursorOverCanvas: false,
  resolution: 0.75,
  selectedPalette: 0,
  speed: 0.25,
  windowSize: { height: 0, width: 0 },

  // Computed Values

  cellSize: () => resolutionValueToCellSize(get().resolution),

  frequencyScalar: () => {
    // Converts linear 0-1 slider value to exponential pattern frequency.
    const state = get()

    // Smooth the top end to avoid aliasing: compress 0.95-1.0 more gradually.
    let adjustedFrequency = state.frequency

    if (adjustedFrequency > 0.95) {
      // Map 0.95→1.0 to 0.95→0.99 using a smooth curve.
      const overage = (adjustedFrequency - 0.95) / 0.05 // 0→1

      adjustedFrequency = 0.95 + overage * 0.04 // 0.95→0.99
    }

    return adjustedFrequency === 0 ? 0 : Math.pow(FREQUENCY_MAX, adjustedFrequency) - 1
  },

  speedScalar: () => {
    // Maps linear 0-1 slider value to animation speed range.
    const state = get()

    return SPEED_MIN + state.speed * (SPEED_MAX - SPEED_MIN)
  },

  // Actions

  setAnimationPhase: (phase: number | ((previous: number) => number)) =>
    set(state => ({
      animationPhase: typeof phase === 'function' ? phase(state.animationPhase) : phase,
    })),

  setCanvasReady: (ready: boolean) => set({ isCanvasReady: ready }),

  setCursorActive: (isActive: boolean) => set({ isCursorActive: isActive }),

  setCursorOverCanvas: (isOver: boolean) => set({ isCursorOverCanvas: isOver }),

  setCursorPosition: (position: { x: number; y: number } | null) => set({ cursorPosition: position }),

  setFrequency: (frequency: number) => set({ frequency, animationPhase: 0 }),

  setResolution: (resolution: number) => set({ resolution: clamp(resolution, 0, 1) }),

  setSelectedPalette: (index: number) => set({ selectedPalette: index }),

  setSpeed: (speed: number) => set({ speed }),

  setWindowSize: (size: WindowSize) => set({ windowSize: size }),
}))
