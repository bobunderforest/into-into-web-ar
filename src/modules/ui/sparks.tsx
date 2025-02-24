import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'

interface FlamingSparksProps {
  /** Number of sparks to spawn */
  count?: number
  /** How long (in seconds) before sparks fully fade out */
  duration?: number
}

const createSparkTexture = () => {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (context) {
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    )
    // Adjust color stops to control the blur and glow intensity
    gradient.addColorStop(0, 'rgba(255, 200, 0, 1)') // bright center
    gradient.addColorStop(0.8, 'rgba(255, 150, 0, 0.8)') // mid-tone
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)') // transparent edge
    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)
  }
  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

export const Sparks: React.FC<FlamingSparksProps> = ({
  count = 50,
  duration = 0.5,
}) => {
  // Create Float32Arrays for positions and velocities.
  // Each spark starts at the origin and is given a random velocity.
  const { pos, vel } = useMemo(() => {
    const LEN = 2
    const SPARK_STEP = LEN / count

    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Start at the origin (or change if needed)
      pos[i * 3 + 0] = 0
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = -LEN / 2 + i * SPARK_STEP

      // Random spherical velocity
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const speed = 1 + Math.random() * 20 // adjust speed as needed

      vel[i * 3 + 0] = speed * Math.sin(phi) * Math.cos(theta)
      vel[i * 3 + 1] = speed * Math.cos(phi)
      vel[i * 3 + 2] = speed * Math.sin(phi) * Math.sin(theta) - 3
    }
    return { pos, vel }
  }, [count])

  // We keep a ref to each spark's mesh so we can update its position & material.
  const sparkRefs = useRef<(THREE.Mesh | null)[]>([])
  if (sparkRefs.current.length !== count) {
    sparkRefs.current = new Array(count).fill(null)
  }

  // Track elapsed time (in seconds)
  const elapsedRef = useRef(0)

  // Update positions and fade-out each spark on every frame.
  useFrame((_, delta) => {
    elapsedRef.current += delta
    if (elapsedRef.current < 0.35) return
    const prog = Math.min(
      Math.max(1 - (elapsedRef.current - 0.35) / duration, 0),
      1,
    )

    for (let i = 0; i < count; i++) {
      vel[i * 3 + 0] += 0 * delta
      vel[i * 3 + 1] += -40 * delta
      vel[i * 3 + 2] += -10 * delta

      // Move the spark by its velocity
      pos[i * 3 + 0] += vel[i * 3 + 0] * delta
      pos[i * 3 + 1] += vel[i * 3 + 1] * delta
      pos[i * 3 + 2] += vel[i * 3 + 2] * delta

      // Update the mesh position and fade its opacity over time.
      const mesh = sparkRefs.current[i]
      if (mesh) {
        mesh.position.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2])
        const material = mesh.material as THREE.MeshBasicMaterial
        if (material) {
          // Fade from full opacity to 0 over the duration
          material.opacity = prog
          material.needsUpdate = true
        }
      }
    }
  })
  const texture = useMemo(() => createSparkTexture(), [])

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Trail
          key={i}
          width={1}
          length={0.5}
          decay={1.5}
          color="rgba(230, 255, 230, 1)"
          attenuation={(t: number) =>
            t *
            t *
            Math.max(Math.min(1 - (elapsedRef.current - 0.35) / duration, 1), 0)
          }
        >
          <mesh ref={(el) => (sparkRefs.current[i] = el)}>
            <sphereGeometry args={[0.001, 8, 8]} />
            <meshBasicMaterial
              // map={texture}
              color="rgba(230, 255, 230, 0.8)"
              transparent
              opacity={1}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </Trail>
      ))}
    </>
  )
}
