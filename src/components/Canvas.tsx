import { memo, useEffect, useRef } from 'react'
import { useAppStore } from '@/store/useAppStore'
import {
  AMBER_BROWN_LUT,
  GOLD_NOIR_LUT,
  LIME_PURPLE_LUT,
  LUT_SIZE,
  MINT_INDIGO_LUT,
  PEACH_CHARCOAL_LUT,
  ROSE_VIOLET_LUT,
  TEAL_NAVY_LUT,
} from '@/utils/palettes'

// Vertex shader: Fullscreen quad.
const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

// Fragment shader: Radial pattern with split precision math.
const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_patternBase;
uniform float u_patternOffset;
uniform sampler2D u_palette;

void main() {
  vec2 coord = gl_FragCoord.xy;
  vec2 center = u_resolution * 0.5;
  float dx = coord.x + 0.5 - center.x;
  float dy = coord.y + 0.5 - center.y;
  float distance = sqrt(dx * dx + dy * dy);
  float maxDistance = length(center);
  float progress = distance / maxDistance;

  // Split precision: (progress * base) % 1 + (progress * offset) % 1
  float val1 = fract(progress * u_patternBase);
  float val2 = fract(progress * u_patternOffset);
  float tRaw = fract(val1 + val2);

  // Triangle wave
  float t = tRaw <= 0.5 ? tRaw * 2.0 : (1.0 - tRaw) * 2.0;

  // Sample palette
  vec3 color = texture2D(u_palette, vec2(t, 0.5)).rgb;

  gl_FragColor = vec4(color, 1.0);
}
`

type CanvasProps = {
  cellSize: number
  colorShift: number
  columns: number
  index: number
  rows: number
}

const Canvas = ({ cellSize, colorShift, columns, index, rows }: CanvasProps) => {
  const frequency = useAppStore(state => state.frequencyScalar())
  const offset = useAppStore(state => state.patternOffset)
  const setCanvasReady = useAppStore(state => state.setCanvasReady)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const texturesRef = useRef<WebGLTexture[]>([])
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({})

  // Initialize WebGL context and shaders.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { alpha: false, preserveDrawingBuffer: false })
    if (!gl) {
      console.error('WebGL not supported')
      return
    }

    glRef.current = gl

    // Compile shaders.
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vertexShader, VERTEX_SHADER)
    gl.compileShader(vertexShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader error:', gl.getShaderInfoLog(vertexShader))
      return
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fragmentShader, FRAGMENT_SHADER)
    gl.compileShader(fragmentShader)
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader error:', gl.getShaderInfoLog(fragmentShader))
      return
    }

    // Link program.
    const program = gl.createProgram()!
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program))
      return
    }

    programRef.current = program
    gl.useProgram(program)

    // Set up fullscreen quad.
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // Get uniform locations.
    uniformsRef.current = {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      patternBase: gl.getUniformLocation(program, 'u_patternBase'),
      patternOffset: gl.getUniformLocation(program, 'u_patternOffset'),
      palette: gl.getUniformLocation(program, 'u_palette'),
    }

    // Upload palette textures in order (Cool to Warm).
    const createPaletteTexture = (data: Uint8Array) => {
      const texture = gl.createTexture()!
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, LUT_SIZE, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, data)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      return texture
    }

    texturesRef.current = [
      createPaletteTexture(TEAL_NAVY_LUT),
      createPaletteTexture(MINT_INDIGO_LUT),
      createPaletteTexture(LIME_PURPLE_LUT),
      createPaletteTexture(ROSE_VIOLET_LUT),
      createPaletteTexture(PEACH_CHARCOAL_LUT),
      createPaletteTexture(GOLD_NOIR_LUT),
      createPaletteTexture(AMBER_BROWN_LUT),
    ]

    return () => {
      texturesRef.current.forEach(texture => gl.deleteTexture(texture))
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
    }
  }, [])

  // Render frame.
  useEffect(() => {
    const gl = glRef.current
    const program = programRef.current
    const uniforms = uniformsRef.current
    const textures = texturesRef.current

    if (!gl || !program || textures.length === 0) return

    gl.useProgram(program)
    gl.viewport(0, 0, columns, rows)

    // Set uniforms.
    gl.uniform2f(uniforms.resolution, columns, rows)
    gl.uniform1f(uniforms.patternBase, frequency)
    gl.uniform1f(uniforms.patternOffset, offset)

    // Bind the selected palette texture.
    const paletteTexture = textures[colorShift] || textures[0]
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, paletteTexture)
    gl.uniform1i(uniforms.palette, 0)

    // Draw.
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    setCanvasReady(true)
  }, [columns, rows, frequency, offset, colorShift, cellSize, index, setCanvasReady])

  return (
    <canvas
      height={rows}
      ref={canvasRef}
      style={{ display: 'block', height: '100%', imageRendering: 'pixelated', width: '100%' }}
      width={columns}
    />
  )
}

export default memo(Canvas)
