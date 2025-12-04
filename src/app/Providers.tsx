'use client'

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

const theme = createTheme({
  palette: { mode: 'light' },
  components: {
    MuiSlider: {
      styleOverrides: {
        root: { '@media (pointer: coarse)': { padding: '13px 0' } },
        thumb: {
          '&::before': { boxShadow: 'none' },
          '&:hover, &.Mui-focusVisible, &.Mui-active': { boxShadow: 'none' },
        },
      },
    },
    MuiToggleButton: { defaultProps: { disableRipple: true } },
  },
})

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {children}
    </ThemeProvider>
  )
}
