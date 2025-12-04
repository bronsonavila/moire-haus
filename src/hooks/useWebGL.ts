import { useEffect, useState } from 'react'

/**
 * Detects WebGL support in the browser
 * @returns true if WebGL is supported, false otherwise
 */
export function useWebGL(): boolean {
  const [hasWebGL, setHasWebGL] = useState(true) // Assume WebGL by default (99%+ support)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

      setHasWebGL(!!gl)
    } catch (e) {
      setHasWebGL(false)
    }
  }, [])

  return hasWebGL
}
