import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { ARMarker, useARMarker } from 'modules/arjs-react/ar-marker'

import { THREE } from 'modules/arjs-core/arjs-endpoint'
import { BASE_URL } from 'modules/utils/app-config'
import { GesturesControl } from './gestures-control'

type Props = {
  path: string
}

export function Kastet({ path }: Props) {
  const { isFound } = useARMarker()
  const gltf = useGLTF(`${BASE_URL}models/${path}`)

  const [mixer, animationAction] = useMemo(() => {
    const mixer = new THREE.AnimationMixer(gltf.scene)
    const action = mixer.clipAction(gltf.animations[0])
    action.setLoop(THREE.LoopOnce, 1)
    action.clampWhenFinished = true
    action.enabled = true
    return [mixer, action]
  }, [gltf])

  useEffect(() => {
    if (isFound) {
      animationAction.play()
    } else {
      animationAction.stop()
      animationAction.reset()
    }
  }, [isFound])

  useFrame((_, deltaTime) => {
    mixer.update(deltaTime)
  })

  return (
    <>
      <axesHelper />
      <primitive
        object={gltf.scene}
        scale={[0.015, 0.015, 0.015]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      {isFound && (
        <>
          <GesturesControl object={gltf.scene} />
        </>
      )}
    </>
  )
}
