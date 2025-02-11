import { Suspense } from 'react'
import { AppRoot } from './app-root'
import { CanvasRecorderComponent } from './canvas-recorder'
import { SceneLight } from './scene-light'
import { Kastet } from './kastet'
import { Kastet2 } from './kastet-2'

export function App() {
  return (
    <AppRoot>
      <SceneLight />
      <Suspense fallback={null}>
        <Kastet />
      </Suspense>
      <Suspense fallback={null}>
        <Kastet2 />
      </Suspense>
      <CanvasRecorderComponent />
    </AppRoot>
  )
}
