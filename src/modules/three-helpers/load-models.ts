import type * as THREE from 'three'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { THREEContext } from './three-deps-context'

type Args = {
  threeContext: THREEContext
  markerScene: THREE.Scene
}

const loadGLTF = (context: THREEContext, url: string) =>
  new Promise<GLTF>((resolve) => {
    const GLTFLoader = context.get('GLTFLoader')
    const loader = new GLTFLoader()
    loader.load(url, resolve)
  })

export const loadModels = async ({ markerScene, threeContext }: Args) => {
  const THREE = threeContext.get('THREE')
  const mesh = new THREE.AxesHelper()
  markerScene.add(mesh)

  // Kastet
  const kastet = await loadGLTF(
    threeContext,
    `/models/Test_Animated_web.gltf?t=${Date.now()}`,
  )
  kastet.scene.traverse((child: any) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.metalness = 1.0
      child.material.roughness = 0.25
      child.material.needsUpdate = true
    }
  })

  kastet.scene.scale.multiply(new THREE.Vector3(4, 4, 4))
  const mixer = new THREE.AnimationMixer(kastet.scene)
  const action = mixer.clipAction(kastet.animations[0])
  action.setLoop(THREE.LoopPingPong, Infinity)

  action.play()

  markerScene.add(kastet.scene)

  const renderModels = (deltaTime: number) => {
    mixer.update(deltaTime)

    kastet.scene.traverse((child: any) => {
      if (child.isMesh && child.material.isMeshStandardMaterial) {
        child.material.needsUpdate = true
      }
    })
  }

  return {
    kastet,
    renderModels,
  }
}
