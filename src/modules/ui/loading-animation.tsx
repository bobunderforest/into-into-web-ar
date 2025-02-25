import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Mesh } from 'three'
import { tent } from 'modules/utils/tent'
import { easeOutSine } from 'modules/utils/easings'

const TOTAL_DURATION = 0.8

const animate = (mesh: Mesh, prog: number) => {
  const scale = easeOutSine(prog)
  mesh.scale.set(scale, scale, scale)

  const opacity = tent(prog)
  const material = mesh.material as THREE.MeshStandardMaterial
  material.transparent = true
  material.opacity = opacity
}

export const LoadingAnimation = () => {
  const sphereRef = useRef<Mesh>(null)

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    const prog = (elapsed % TOTAL_DURATION) / TOTAL_DURATION
    animate(sphereRef.current!, prog)
  })

  return (
    <group position={[0, 1.2, 0]}>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial opacity={0} color="#99ddff" />
      </mesh>
    </group>
  )
}
