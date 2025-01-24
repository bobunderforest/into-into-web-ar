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

export type ARJSDepsContextVaule = {
  config: ARJSConfigType
  threeContext: THREEContext
  arControl: ArMarkerControls
  arContext: ArToolkitContext
  arSource: ArToolkitSource

  threeCamera: THREE.Camera
  threeRenderer: THREE.Renderer
  threeScene: THREE.Scene
  threeMarkerScene: THREE.Scene
  threeMarkerGroup: THREE.Group

  modelKastet: THREE.Object3D

  rafRenderer: RAFRenderer
  renderModels: RenderFn
  renderLight: RenderFn
}

export type ARJSContext = DepsContext<ARJSDepsContextVaule>
