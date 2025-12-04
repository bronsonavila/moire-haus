import { Box, Chip, Slider, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useAppStore } from '@/store/useAppStore'

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
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Resolution
          </Typography>

          <Chip label={resolution.toFixed(2)} size="small" variant="outlined" sx={{ height: 24, fontWeight: 500 }} />
        </Box>

        <Slider
          aria-label="Resolution"
          min={0}
          max={1}
          size="small"
          step={0.01}
          value={resolution}
          onChange={(_, value) => {
            if (typeof value === 'number') setResolution(value)
          }}
        />
      </Box>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Frequency
          </Typography>

          <Chip label={frequency.toFixed(2)} size="small" variant="outlined" sx={{ height: 24, fontWeight: 500 }} />
        </Box>

        <Slider
          aria-label="Frequency"
          min={0}
          max={1}
          size="small"
          step={0.01}
          value={frequency}
          onChange={(_, value) => setFrequency(value as number)}
        />
      </Box>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Speed
          </Typography>

          <Chip label={speed.toFixed(2)} size="small" variant="outlined" sx={{ height: 24, fontWeight: 500 }} />
        </Box>

        <Slider
          aria-label="Speed"
          min={0}
          max={1}
          size="small"
          step={0.01}
          value={speed}
          onChange={(_, value) => setSpeed(value as number)}
        />
      </Box>

      <Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
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
                border: '2px solid rgba(0,0,0,0.4)',
                backgroundColor: 'rgba(0,0,0,0.03)',
              },
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.02)',
              },
            },
          }}
          value={colorShift}
        >
          <ToggleButton value={0}>
            <Box sx={{ width: 24, height: 24, backgroundColor: '#3577ae', borderRadius: 1 }} />
          </ToggleButton>

          <ToggleButton value={1}>
            <Box sx={{ width: 24, height: 24, backgroundColor: '#35a1ab', borderRadius: 1 }} />
          </ToggleButton>

          <ToggleButton value={2}>
            <Box sx={{ width: 24, height: 24, backgroundColor: '#55c667', borderRadius: 1 }} />
          </ToggleButton>

          <ToggleButton value={3}>
            <Box sx={{ width: 24, height: 24, backgroundColor: '#db5087', borderRadius: 1 }} />
          </ToggleButton>

          <ToggleButton value={4}>
            <Box sx={{ width: 24, height: 24, backgroundColor: '#c55a68', borderRadius: 1 }} />
          </ToggleButton>

          <ToggleButton value={5}>
            <Box sx={{ width: 24, height: 24, backgroundColor: '#fd9a6a', borderRadius: 1 }} />
          </ToggleButton>

          <ToggleButton value={6}>
            <Box sx={{ width: 24, height: 24, backgroundColor: '#f0a04b', borderRadius: 1 }} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </>
  )
}

export default ControlsContent
