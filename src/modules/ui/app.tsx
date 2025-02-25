import { AppRoot } from './app-root'
import { CanvasRecorderComponent } from './canvas-recorder'
import { SceneLight } from './scene-light'
import { Jewelry } from './jewelry'
import { ARMarker } from 'modules/arjs-react/ar-marker'
import { SuspenseMarkerLazy } from './suspense-marker-lazy'
import { GesturesControl } from './gestures-control'
import { useCallback, useMemo, useState } from 'react'
import type { THREE } from 'modules/arjs-core/arjs-endpoint'
import { Environment } from '@react-three/drei'
import { BASE_URL } from 'modules/utils/app-config'

export function App() {
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
      <Environment files={`${BASE_URL}textures/dancing_hall_1k.exr`} />

      {/* Kastet */}
      <ARMarker type={'barcode'} barcodeValue={1}>
        <SuspenseMarkerLazy>
          <Jewelry
            path={'kastet.gltf'}
            scale={1.2}
            sparksDelay={2.2}
            sparksPos={useMemo(() => [0, 0, 0], [])}
            onFoundLoad={setControlledModel}
            onLost={handleLost}
          />
        </SuspenseMarkerLazy>
      </ARMarker>

      {/* Ring */}
      <ARMarker type={'barcode'} barcodeValue={2}>
        <SuspenseMarkerLazy>
          <Jewelry
            path={'ring.gltf'}
            scale={3}
            sparksDelay={2.6}
            sparksPos={useMemo(() => [0, 1.2, 0], [])}
            onFoundLoad={setControlledModel}
            onLost={handleLost}
          />
        </SuspenseMarkerLazy>
      </ARMarker>

      {/* Ring */}
      <ARMarker type={'barcode'} barcodeValue={3}>
        <SuspenseMarkerLazy>
          <Jewelry
            path={'neckle.gltf'}
            scale={0.8}
            onFoundLoad={setControlledModel}
            onLost={handleLost}
          />
        </SuspenseMarkerLazy>
      </ARMarker>

      {/* Sphere */}
      <ARMarker type={'barcode'} barcodeValue={4}>
        <SuspenseMarkerLazy>
          <Jewelry
            path={'sphere.gltf'}
            scale={1.8}
            sparksDelay={1.6}
            sparksPos={useMemo(() => [0, 0, 0], [])}
            onFoundLoad={setControlledModel}
            onLost={handleLost}
          />
        </SuspenseMarkerLazy>
      </ARMarker>

      {/* Earing */}
      <ARMarker type={'barcode'} barcodeValue={5}>
        <SuspenseMarkerLazy>
          <Jewelry
            path={'earing.gltf'}
            scale={2}
            onFoundLoad={setControlledModel}
            onLost={handleLost}
          />
        </SuspenseMarkerLazy>
      </ARMarker>

      <CanvasRecorderComponent />

      {controlledModel && <GesturesControl object={controlledModel} />}
    </AppRoot>
  )
}
