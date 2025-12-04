'use client'

import { useAppStore } from '@/store/useAppStore'
import { useCallback, useEffect, useRef } from 'react'
import Canvas from '@/components/Canvas'
import Controls from '@/components/Controls'
import CursorIndicator from '@/components/CursorIndicator'

const HomePage = () => {
  const cellSize = useAppStore(state => state.cellSize())
  const speed = useAppStore(state => state.speedScalar())
  const windowSize = useAppStore(state => state.windowSize)
  const setAnimationPhase = useAppStore(state => state.setAnimationPhase)
  const setWindowSize = useAppStore(state => state.setWindowSize)

  const requestRef = useRef<number>()
  const speedRef = useRef(speed)

  const columns = Math.ceil(windowSize.width / cellSize)
  const rows = Math.ceil(windowSize.height / cellSize)

  const animate = useCallback(() => {
    setAnimationPhase(previous => Number((previous + speedRef.current).toFixed(4)))

    requestRef.current = requestAnimationFrame(animate)
  }, [setAnimationPhase])

  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  useEffect(() => {
    const handleResize = () => setWindowSize({ height: window.innerHeight, width: window.innerWidth })

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [setWindowSize])

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [animate])

  return (
    <main>
      {windowSize.width > 0 && <Canvas cellSize={cellSize} columns={columns} rows={rows} />}

      <CursorIndicator />

      <Controls />
    </main>
  )
}

export default HomePage
