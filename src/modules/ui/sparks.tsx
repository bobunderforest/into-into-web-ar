import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'

interface FlamingSparksProps {
  count?: number
  duration?: number
  delay?: number
  sparksPos: [number, number, number]
}

export const Sparks = ({
  count = 50,
  duration = 0.5,
  delay = 0.5,
  sparksPos,
}: FlamingSparksProps) => {
  // Create Float32Arrays for positions and velocities.
  // Each spark starts at the origin and is given a random velocity.
  const { pos, vel } = useMemo(() => {
    const LEN = 2
    const SPARK_STEP = LEN / count

    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Start at the origin (or change if needed)
      pos[i * 3 + 0] = sparksPos[0]
      pos[i * 3 + 1] = sparksPos[1]
      pos[i * 3 + 2] = sparksPos[2] + -LEN / 2 + i * SPARK_STEP

      // Random spherical velocity
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const speed = 1 + Math.random() * 20 // adjust speed as needed

      vel[i * 3 + 0] = speed * Math.sin(phi) * Math.cos(theta)
      vel[i * 3 + 1] = speed * Math.cos(phi)
      vel[i * 3 + 2] = speed * Math.sin(phi) * Math.sin(theta) - 3
    }
    return { pos, vel }
  }, [])

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
    if (elapsedRef.current < delay) return
    const prog = Math.min(
      Math.max(1 - (elapsedRef.current - delay) / duration, 0),
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
            Math.max(
              Math.min(1 - (elapsedRef.current - delay) / duration, 1),
              0,
            )
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
