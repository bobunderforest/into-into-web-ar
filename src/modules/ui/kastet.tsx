import { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { useARMarker } from 'modules/arjs-react/ar-marker'

import { THREE } from 'modules/arjs-core/arjs-endpoint'
import { BASE_URL } from 'modules/utils/app-config'
// import { Sparks } from './sparks'
import { GesturesControl } from './gestures-control'
import { deg2rad } from 'modules/utils/rad2deg'

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

  /**
   * Clipiing render under the marker surface
   */
  const planeRef = useRef<any>()
  const clippingPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    [],
  )
  useFrame(() => {
    if (planeRef.current) {
      planeRef.current.updateWorldMatrix(true, false)
      const worldPosition = new THREE.Vector3()
      worldPosition.setFromMatrixPosition(planeRef.current.matrixWorld)
      const worldQuaternion = new THREE.Quaternion()
      planeRef.current.getWorldQuaternion(worldQuaternion)
      const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(worldQuaternion)
      clippingPlane.normal.copy(normal)
      clippingPlane.constant = -worldPosition.dot(normal)
    }
  })

  return (
    <>
      <axesHelper />
      {isFound && <GesturesControl object={gltf.scene} />}

      <group rotation={[-deg2rad(25), 0, 0]} position={[0, 2, 0]}>
        <mesh castShadow>
          <primitive
            castShadow
            object={gltf.scene}
            scale={[0.015, 0.015, 0.015]}
            onUpdate={(obj: any) => {
              obj.castShadow = true
              obj.traverse((child: any) => {
                if (child.isMesh) {
                  child.castShadow = true
                  child.material.clippingPlanes = [clippingPlane]
                  // child.material.clipIntersection = true // if you want the inside part to be rendered
                  child.material.needsUpdate = true
                }
              })
            }}
          />
        </mesh>
        {/* {isFound && <Sparks />} */}
      </group>

      <pointLight
        position={[0, 10, 1]}
        color={0xffffff}
        intensity={100}
        distance={20}
        castShadow
        shadow-mapSize-height={2048}
        shadow-mapSize-width={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.01}
        shadow-camera-far={10}
        shadow-bias={-0}
      />

      <mesh
        ref={planeRef}
        castShadow
        receiveShadow
        rotation={[deg2rad(-90), 0, 0]}
        position={[0, 0, 0]}
      >
        <planeGeometry args={[6, 6]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </>
  )
}
