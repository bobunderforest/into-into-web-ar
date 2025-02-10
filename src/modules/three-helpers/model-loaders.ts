import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
// import type { FBX } from 'three/examples/jsm/loaders/FBXLoader'
import { THREEContext } from './three-deps-context'

export const loadGLTF = (context: THREEContext, url: string) =>
  new Promise<GLTF>((resolve) => {
    const GLTFLoader = context.get('GLTFLoader')
    const loader = new GLTFLoader()
    loader.load(url, resolve)
  })

// export const loadFBX = (context: THREEContext, url: string) =>
//   new Promise<THREE.Group>((resolve) => {
//     const FBXLoader = context.get('FBXLoader')
//     const loader = new FBXLoader()
//     loader.load(url, resolve)
//   })
