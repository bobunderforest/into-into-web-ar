import { useCallback, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { ARMarker } from 'modules/arjs-react/ar-marker'

import { THREE } from 'modules/arjs-core/arjs-endpoint'
import { BASE_URL } from 'modules/utils/app-config'
import type { ARJSControlConfig } from 'modules/arjs-core/types'
import { useGesturesControl } from 'modules/hooks/use-gestures-control'

const MARKER_CONFIG: ARJSControlConfig = {
  type: 'barcode',
  barcodeValue: 0,
}

export function Kastet() {
  const gltf = useGLTF(`${BASE_URL}models/kastet_1.gltf`)

  const [mixer, animationAction] = useMemo(() => {
    const mixer = new THREE.AnimationMixer(gltf.scene)
    const action = mixer.clipAction(gltf.animations[0])
    action.setLoop(THREE.LoopOnce, 1)
    action.clampWhenFinished = true
    action.enabled = true
    return [mixer, action]
  }, [gltf])

  const handleFound = useCallback((e) => {
    animationAction.play()
  }, [])

  const handleLost = useCallback((e) => {
    animationAction.stop()
    animationAction.reset()
  }, [])

  useFrame((_, deltaTime) => {
    mixer.update(deltaTime)
  })

  useGesturesControl(gltf.scene)

  return (
    <ARMarker config={MARKER_CONFIG} onFound={handleFound} onLost={handleLost}>
      <primitive
        object={gltf.scene}
        scale={[0.015, 0.015, 0.015]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </ARMarker>
  )
}
