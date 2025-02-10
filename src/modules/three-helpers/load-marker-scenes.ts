import type * as THREE from 'three'
import { THREEContext } from './three-deps-context'
import { BASE_URL } from 'modules/config'
import { loadGLTF } from './model-loaders'
import { initThreeLight } from './init-three-light'

type Args = {
  threeContext: THREEContext
  markerScene: THREE.Scene
}

// Kastet
export const loadMarkerSceneKastet = async ({
  markerScene,
  threeContext,
}: Args) => {
  const THREE = threeContext.get('THREE')
  const mesh = new THREE.AxesHelper()
  markerScene.add(mesh)

  const gltf = await loadGLTF(
    threeContext,
    `${BASE_URL}models/Test_Animated_web.gltf?t=${Date.now()}`,
  )
  gltf.scene.scale.multiply(new THREE.Vector3(3, 3, 3))
  markerScene.add(gltf.scene)

  const mixer = new THREE.AnimationMixer(gltf.scene)
  const action = mixer.clipAction(gltf.animations[0])
  action.setLoop(THREE.LoopOnce, 1)
  action.clampWhenFinished = true
  action.enabled = true

  const renderModels = (deltaTime: number) => {
    mixer.update(deltaTime)
  }

  return {
    gltf,
    animationAction: action,
    renderModels,
  }
}

// Girl
export const loadMarkerSceneGirl = async ({
  markerScene,
  threeContext,
}: Args) => {
  const THREE = threeContext.get('THREE')
  const mesh = new THREE.AxesHelper()
  markerScene.add(mesh)

  const gltf = await loadGLTF(
    threeContext,
    `${BASE_URL}models/Test_Animated_web.gltf?t=${Date.now()}`,
  )
  gltf.scene.scale.multiply(new THREE.Vector3(2, 2, 2))
  markerScene.add(gltf.scene)

  const mixer = new THREE.AnimationMixer(gltf.scene)
  const action = mixer.clipAction(gltf.animations[0])
  action.setLoop(THREE.LoopRepeat, Infinity)

  const renderModels = (deltaTime: number) => {
    mixer.update(deltaTime)
  }

  return {
    gltf,
    animationAction: action,
    renderModels,
  }
}

export const markerSceneLoaders = [loadMarkerSceneKastet, loadMarkerSceneGirl]
