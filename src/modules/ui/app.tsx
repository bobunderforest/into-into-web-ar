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
  const preload = useMemo(() => {
    return Number(new URLSearchParams(location.search).get('preload'))
  }, [])

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
        <SuspenseMarkerLazy isPreloaded={preload === 1}>
          <Jewelry
            path={'kastet.gltf'}
            scale={3}
            lift={3}
            sparksDelay={2.2}
            sparksPos={useMemo(() => [0, 0, 0], [])}
            onFoundLoad={setControlledModel}
            onLost={handleLost}
          />
        </SuspenseMarkerLazy>
      </ARMarker>

      {/* Ring */}
      <ARMarker type={'barcode'} barcodeValue={2}>
        <SuspenseMarkerLazy isPreloaded={preload === 2}>
          <Jewelry
            path={'ring.gltf'}
            scale={6}
            lift={1.6}
            sparksDelay={2.6}
            sparksPos={useMemo(() => [0, 2.2, 0.2], [])}
            onFoundLoad={setControlledModel}
            onLost={handleLost}
          />
        </SuspenseMarkerLazy>
      </ARMarker>

      {/* Neckle */}
      <ARMarker type={'barcode'} barcodeValue={3}>
        <SuspenseMarkerLazy isPreloaded={preload === 3}>
          <Jewelry
            path={'neckle.gltf'}
            scale={1.6}
            lift={3}
            onFoundLoad={setControlledModel}
            onLost={handleLost}
          />
        </SuspenseMarkerLazy>
      </ARMarker>

      {/* Sphere */}
      <ARMarker type={'barcode'} barcodeValue={4}>
        <SuspenseMarkerLazy isPreloaded={preload === 4}>
          <Jewelry
            path={'sphere.gltf'}
            scale={2.8}
            lift={3}
            sparksDelay={1.6}
            sparksPos={useMemo(() => [0, 0, 0], [])}
            onFoundLoad={setControlledModel}
            onLost={handleLost}
          />
        </SuspenseMarkerLazy>
      </ARMarker>

      {/* Earing */}
      <ARMarker type={'barcode'} barcodeValue={5}>
        <SuspenseMarkerLazy isPreloaded={preload === 5}>
          <Jewelry
            path={'earing.gltf'}
            scale={4.2}
            lift={3}
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
