import { Box, Chip, Slider, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useAppStore } from '@/store/useAppStore'

const PALETTE_COLORS = [
  '#3577ae', // TEAL_NAVY
  '#35a1ab', // MINT_INDIGO
  '#55c667', // LIME_PURPLE
  '#db5087', // ROSE_VIOLET
  '#c55a68', // PEACH_CHARCOAL
  '#fd9a6a', // GOLD_NOIR
  '#f0a04b', // AMBER_BROWN
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
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
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

const ControlsContent = () => {
  const resolution = useAppStore(state => state.resolution)
  const colorShift = useAppStore(state => state.colorShift)
  const frequency = useAppStore(state => state.frequency)
  const speed = useAppStore(state => state.speed)
  const setResolution = useAppStore(state => state.setResolution)
  const setColorShift = useAppStore(state => state.setColorShift)
  const setFrequency = useAppStore(state => state.setFrequency)
  const setSpeed = useAppStore(state => state.setSpeed)

  return (
    <>
      <ControlSlider label="Resolution" onChange={setResolution} value={resolution} />

      <ControlSlider label="Frequency" onChange={setFrequency} value={frequency} />

      <ControlSlider label="Speed" onChange={setSpeed} value={speed} />

      <Box>
        <Typography sx={{ color: 'text.secondary', mb: 0.5 }} variant="body2">
          Palette
        </Typography>

        <ToggleButtonGroup
          exclusive
          fullWidth
          onChange={(_, value) => {
            if (value !== null) setColorShift(value)
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
          value={colorShift}
        >
          {PALETTE_COLORS.map((color, index) => (
            <ToggleButton key={color} value={index}>
              <Box sx={{ backgroundColor: color, borderRadius: 1, height: 24, width: 24 }} />
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </>
  )
}

export default ControlsContent
