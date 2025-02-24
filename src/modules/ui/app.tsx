import { AppRoot } from './app-root'
import { CanvasRecorderComponent } from './canvas-recorder'
import { SceneLight } from './scene-light'
import { Kastet } from './kastet'
import { ARMarker } from 'modules/arjs-react/ar-marker'
import { SuspenseMarkerLazy } from './suspense-marker-lazy'
import { GesturesControl } from './gestures-control'
import { useCallback, useState } from 'react'
import type { THREE } from 'modules/arjs-core/arjs-endpoint'
// import {
//   Bloom,
//   DepthOfField,
//   EffectComposer,
// } from '@react-three/postprocessing'
// import { SelectiveBloom } from './selective-bloom'

export function App() {
  // const controlRef = useRef<THREE.Object3D>(null)
  const [controlledModel, setControlledModel] = useState<THREE.Object3D | null>(
    null,
  )

  const handleLost = useCallback((object: THREE.Object3D) => {
    setControlledModel((curr) => {
      if (object === curr) return null
      return curr
    })
  }, [])

  return (
    <AppRoot>
      <SceneLight />

      {/* <ARMarker type={'barcode'} barcodeValue={0}>
        <SuspenseMarkerLazy fallback={null}>
          <Kastet
            path={'kastet_1_o.gltf'}
            onFoundLoad={setControlledModel}
            onLost={handleLost}
          />
        </SuspenseMarkerLazy>
      </ARMarker> */}

      <ARMarker type={'barcode'} barcodeValue={1}>
        <SuspenseMarkerLazy fallback={null}>
          <Kastet
            path={'kastet_2_o.gltf'}
            onFoundLoad={setControlledModel}
            onLost={handleLost}
          />
        </SuspenseMarkerLazy>
      </ARMarker>

      <CanvasRecorderComponent />

      {controlledModel && <GesturesControl object={controlledModel} />}

      {/* <SelectiveBloom /> */}
      {/* <EffectComposer> */}
      {/* <Bloom
          luminanceThreshold={0.8}
          luminanceSmoothing={9}
          intensity={0.6}
        /> */}
      {/* <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={2}
          height={480}
        /> */}
      {/* </EffectComposer> */}
    </AppRoot>
  )
}
