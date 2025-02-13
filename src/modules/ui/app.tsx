import { Suspense } from 'react'
import { AppRoot } from './app-root'
import { CanvasRecorderComponent } from './canvas-recorder'
import { SceneLight } from './scene-light'
import { Kastet } from './kastet'
import { ARMarker } from 'modules/arjs-react/ar-marker'
import { SuspenseMarkerLazy } from './suspense-marker-lazy'

export function App() {
  return (
    <AppRoot>
      <SceneLight />

      <ARMarker type={'barcode'} barcodeValue={0}>
        <SuspenseMarkerLazy fallback={null}>
          <Kastet path={'kastet_1.gltf'} />
        </SuspenseMarkerLazy>
      </ARMarker>

      <ARMarker type={'barcode'} barcodeValue={1}>
        <SuspenseMarkerLazy fallback={null}>
          <Kastet path={'kastet_2.gltf'} />
        </SuspenseMarkerLazy>
      </ARMarker>

      <CanvasRecorderComponent />
    </AppRoot>
  )
}
