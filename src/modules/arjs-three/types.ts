import type * as THREE from 'three'
import type {
  ArMarkerControls,
  ArToolkitContext,
  ArToolkitSource,
} from 'modules/arjs-helpers/arjs-endpoint'
import type { ARJSConfigType } from 'modules/arjs-helpers/types'
import type { RAFRenderer, RenderFn } from 'modules/utils/raf-renderer'
import type { DepsContext } from 'modules/utils/deps-context'
import type { THREEContext } from 'modules/three-helpers/three-deps-context'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

export type ThreeMarkerScene = {
  gltf: GLTF
  animationAction: THREE.AnimationAction
  renderModels: RenderFn
  scene: THREE.Scene
  group: THREE.Group
}

export type ARJSDepsContextVaule = {
  config: ARJSConfigType

  arControls: ArMarkerControls[]
  arContext: ArToolkitContext
  arSource: ArToolkitSource

  threeContext: THREEContext
  threeCamera: THREE.Camera
  threeRenderer: THREE.Renderer
  threeScene: THREE.Scene
  threeMarkerScenes: ThreeMarkerScene[]

  rafRenderer: RAFRenderer
  renderLight: RenderFn
}

export type ARJSContext = DepsContext<ARJSDepsContextVaule>
