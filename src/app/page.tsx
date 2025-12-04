'use client'

import { useAppStore } from '@/store/useAppStore'
import { useCallback, useEffect, useRef } from 'react'
import { useWebGL } from '@/hooks/useWebGL'
import Canvas from '@/components/Canvas'
import CanvasWebGL from '@/components/CanvasWebGL'
import Controls from '@/components/Controls'

const HomePage = () => {
  const cellSize = useAppStore(state => state.cellSize)
  const colorShift = useAppStore(state => state.colorShift)
  const speed = useAppStore(state => state.speed())
  const windowSize = useAppStore(state => state.windowSize)
  const setPatternOffset = useAppStore(state => state.setPatternOffset)
  const setWindowSize = useAppStore(state => state.setWindowSize)

  const requestRef = useRef<number>()
  const speedRef = useRef(speed)

  const hasWebGL = useWebGL()

  const columns = Math.ceil(windowSize.width / cellSize)
  const rows = Math.ceil(windowSize.height / cellSize)

  const animate = useCallback(() => {
    setPatternOffset(previous => Number((previous + speedRef.current).toFixed(4)))

    requestRef.current = requestAnimationFrame(animate)
  }, [setPatternOffset])

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
      {windowSize.width > 0 &&
        (hasWebGL ? (
          <CanvasWebGL cellSize={cellSize} colorShift={colorShift} columns={columns} index={0} rows={rows} />
        ) : (
          <Canvas cellSize={cellSize} colorShift={colorShift} columns={columns} index={0} rows={rows} />
        ))}

      <Controls />
    </main>
  )
}

export default HomePage
