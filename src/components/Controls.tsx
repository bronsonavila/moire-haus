import { Box, Collapse, Fade, IconButton, Paper, Stack, Typography } from '@mui/material'
import { memo, useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import CloseIcon from '@mui/icons-material/Close'
import ControlsContent from './ControlsContent'
import TuneIcon from '@mui/icons-material/Tune'

const INACTIVITY_TIMEOUT = 2500

const Controls = () => {
  const isCanvasReady = useAppStore(state => state.isCanvasReady)

  const [isExpanded, setIsExpanded] = useState(false) // For mobile.
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileTriggerVisible, setIsMobileTriggerVisible] = useState(true)
  const [isVisible, setIsVisible] = useState(true) // For desktop.

  const ignoreNextTouchRef = useRef(false)
  const isExpandedRef = useRef(isExpanded)
  const mobileTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    isExpandedRef.current = isExpanded
  }, [isExpanded])

  // Detect if device is mobile/touch.
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth < 768

      setIsMobile(isTouchDevice || isSmallScreen)
    }

    checkMobile()

    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Reset mode-specific states when switching between mobile and desktop.
  useEffect(() => {
    if (isMobile) {
      // Switching to mobile: reset desktop states.
      setIsVisible(true)
      setIsHovering(false)
      setIsExpanded(false)
      setIsMobileTriggerVisible(true)
    } else {
      // Switching to desktop: reset mobile states.
      setIsExpanded(false)
      setIsMobileTriggerVisible(true)
      setIsVisible(true)
      setIsHovering(false)
    }
  }, [isMobile])

  // Desktop: Track mouse movement and auto-hide.
  useEffect(() => {
    if (isMobile) return

    const handleMouseMove = () => {
      setIsVisible(true)

      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      if (!isHovering) timeoutRef.current = setTimeout(() => setIsVisible(false), INACTIVITY_TIMEOUT)
    }

    const handleMouseLeave = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      setIsVisible(false)
    }

    document.body.style.cursor = isVisible ? 'default' : 'none'

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    timeoutRef.current = setTimeout(() => setIsVisible(false), INACTIVITY_TIMEOUT)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)

      document.body.style.cursor = 'default'

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isMobile, isHovering, isVisible])

  // Keep controls visible when hovering.
  useEffect(() => {
    if (isMobile) return

    if (isHovering) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      setIsVisible(true)
    }
  }, [isHovering, isMobile])

  // Mobile: Auto-hide the tune button after inactivity, show on touch.
  useEffect(() => {
    if (!isMobile) return

    const clearMobileTimeout = () => {
      if (mobileTimeoutRef.current) clearTimeout(mobileTimeoutRef.current)
    }

    const scheduleHide = () => {
      clearMobileTimeout()

      mobileTimeoutRef.current = setTimeout(() => setIsMobileTriggerVisible(false), INACTIVITY_TIMEOUT)
    }

    const handleTouch = (event: Event) => {
      if (ignoreNextTouchRef.current) {
        ignoreNextTouchRef.current = false

        return
      }

      // Ignore if touching the controls/button itself.
      const target = event.target as HTMLElement

      if (target.closest('button') || target.closest('.MuiPaper-root')) return

      const tappedCanvas = target.closest('canvas')

      if (tappedCanvas && isExpandedRef.current) {
        setIsExpanded(false)
        setIsMobileTriggerVisible(false)

        return
      }

      setIsMobileTriggerVisible(current => {
        if (current) {
          clearMobileTimeout() // If visible, hide it and cancel timer.

          return false
        } else {
          scheduleHide() // If hidden, show it and schedule hide.

          return true
        }
      })
    }

    // Start visible and schedule auto-hide.
    setIsMobileTriggerVisible(true)
    scheduleHide()

    // Use click to avoid double-firing with touchstart+pointerdown.
    window.addEventListener('click', handleTouch)

    return () => {
      window.removeEventListener('click', handleTouch)

      clearMobileTimeout()
    }
  }, [isMobile])

  if (!isCanvasReady) return null

  // Mobile: Render floating button + collapsible panel.
  if (isMobile) {
    return (
      <>
        <Collapse in={isExpanded} timeout={{ enter: 300, exit: 0 }} unmountOnExit>
          <Paper
            elevation={3}
            sx={{
              backdropFilter: 'blur(4px)',
              bgcolor: 'rgba(255,255,255,0.95)',
              borderRadius: 2,
              bottom: '1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              p: 2,
              position: 'fixed',
              right: '1rem',
              width: 280,
            }}
          >
            <Stack spacing={2} sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Controls
                </Typography>

                <IconButton
                  size="small"
                  onClick={() => {
                    setIsExpanded(false)
                    setIsMobileTriggerVisible(false)
                  }}
                  sx={{ ml: 'auto' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <ControlsContent />
            </Stack>
          </Paper>
        </Collapse>

        {!isExpanded && (
          <Fade appear={false} in={isMobileTriggerVisible} timeout={{ enter: 400, exit: 400 }}>
            <IconButton
              aria-label="open controls"
              disableRipple
              onClick={() => setIsExpanded(true)}
              sx={{
                backdropFilter: 'blur(4px)',
                bgcolor: 'rgba(255,255,255,0.85)',
                bottom: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                height: 48,
                position: 'fixed',
                right: '1rem',
                width: 48,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.95)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              }}
            >
              <TuneIcon />
            </IconButton>
          </Fade>
        )}
      </>
    )
  }

  // Desktop: Auto-hide behavior.
  return (
    <Fade appear={false} in={isVisible} timeout={400}>
      <Paper
        elevation={1}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        sx={{
          backdropFilter: 'blur(4px)',
          bgcolor: 'rgba(255,255,255,0.9)',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          p: 2,
          position: 'fixed',
          right: '1rem',
          top: '1rem',
          width: 280,
        }}
      >
        <Stack spacing={2} sx={{ width: '100%' }}>
          <ControlsContent />
        </Stack>
      </Paper>
    </Fade>
  )
}

export default memo(Controls)
