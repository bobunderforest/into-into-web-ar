import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { THREEContext } from 'modules/three-helpers/three-deps-context'

export * as THREE from 'three'
export {
  ArToolkitProfile,
  ArToolkitSource,
  ArToolkitContext,
  ArMarkerControls,
} from 'ar-js-org/three.js/build/ar-threex.mjs'

export const threeContext = new THREEContext()
threeContext.register('THREE', THREE)
threeContext.register('FBXLoader', FBXLoader)
threeContext.register('GLTFLoader', GLTFLoader)
