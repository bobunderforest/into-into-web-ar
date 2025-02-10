import { DepsContext } from 'modules/utils/deps-context'
import type * as THREE from 'three'
import type { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import type { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

type THREEDepsContextValue = {
  THREE: typeof THREE
  FBXLoader: typeof FBXLoader
  GLTFLoader: typeof GLTFLoader
}

export type THREEContext = DepsContext<THREEDepsContextValue>
export const THREEContext =
  DepsContext as typeof DepsContext<THREEDepsContextValue>
