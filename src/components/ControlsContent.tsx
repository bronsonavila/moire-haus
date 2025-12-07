import { Box, Chip, Slider, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useAppStore } from '@/store/useAppStore'
import {
  AMBER_BROWN,
  GOLD_NOIR,
  LIME_PURPLE,
  MINT_INDIGO,
  PEACH_CHARCOAL,
  ROSE_VIOLET,
  TEAL_NAVY,
} from '@/utils/palettes'

// Use representative colors from each palette (early and mid-range positions).
const PALETTE_GRADIENTS = [
  { left: TEAL_NAVY[4], right: TEAL_NAVY[11] }, // Bright cyan → Teal
  { left: MINT_INDIGO[4], right: MINT_INDIGO[11] }, // Mint → Aqua
  { left: LIME_PURPLE[2], right: LIME_PURPLE[14] }, // Lime → Blue
  { left: ROSE_VIOLET[3], right: ROSE_VIOLET[10] }, // Pink → Magenta
  { left: PEACH_CHARCOAL[3], right: PEACH_CHARCOAL[9] }, // Peach → Crimson
  { left: GOLD_NOIR[4], right: GOLD_NOIR[10] }, // Gold → Magenta
  { left: AMBER_BROWN[4], right: AMBER_BROWN[12] }, // Orange → Brown
]

type ControlSliderProps = {
  label: string
  max?: number
  min?: number
  onChange: (value: number) => void
  step?: number
  value: number
}

const ControlSlider = ({ label, max = 1, min = 0, onChange, step = 0.01, value }: ControlSliderProps) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.25 }}>
      <Typography sx={{ color: 'text.secondary' }} variant="body2">
        {label}
      </Typography>

      <Chip label={value.toFixed(2)} size="small" sx={{ height: 24, fontWeight: 500 }} variant="outlined" />
    </Box>

    <Slider
      aria-label={label}
      max={max}
      min={min}
      onChange={(_, value) => typeof value === 'number' && onChange(value)}
      size="small"
      step={step}
      value={value}
    />
  </Box>
)

type ControlsContentProps = {
  isMobile?: boolean
}

const ControlsContent = ({ isMobile = false }: ControlsContentProps) => {
  const frequency = useAppStore(state => state.frequency)
  const resolution = useAppStore(state => state.resolution)
  const selectedPalette = useAppStore(state => state.selectedPalette)
  const speed = useAppStore(state => state.speed)
  const setFrequency = useAppStore(state => state.setFrequency)
  const setResolution = useAppStore(state => state.setResolution)
  const setSelectedPalette = useAppStore(state => state.setSelectedPalette)
  const setSpeed = useAppStore(state => state.setSpeed)

  return (
    <>
      <ControlSlider label="Resolution" onChange={setResolution} value={resolution} />

      <ControlSlider label="Frequency" onChange={setFrequency} value={frequency} />

      <ControlSlider label="Speed" onChange={setSpeed} value={speed} />

      <Box>
        <Typography sx={{ color: 'text.secondary', mb: 0.25 }} variant="body2">
          Palette
        </Typography>

        <ToggleButtonGroup
          exclusive
          fullWidth
          onChange={(_, value) => {
            if (value !== null) setSelectedPalette(value)
          }}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              border: '2px solid rgba(0,0,0,0.08)',
              minWidth: 0,
              padding: '8px',
              transition: 'border-color 0.2s ease, background-color 0.2s ease',
              '&.Mui-selected': {
                backgroundColor: 'rgba(0,0,0,0.03)',
                border: '2px solid rgba(0,0,0,0.4)',
              },
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' },
            },
          }}
          value={selectedPalette}
        >
          {PALETTE_GRADIENTS.map((palette, index) => (
            <ToggleButton key={index} value={index}>
              <Box
                sx={{
                  alignItems: 'center',
                  backgroundColor: palette.left,
                  borderRadius: 1,
                  display: 'flex',
                  height: 24,
                  justifyContent: 'center',
                  width: 24,
                }}
              >
                <Box
                  sx={{ backgroundColor: palette.right, borderRadius: 0.5, height: 19, width: isMobile ? 17 : 11 }}
                />
              </Box>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </>
  )
}

export default ControlsContent
