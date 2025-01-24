import { threeContext } from 'modules/arjs-helpers/arjs-endpoint'

import { getARJSConfig } from 'modules/arjs-helpers/arjs-config'
import { initThreeContext } from 'modules/arjs-three/init-three-context'
import { initARJSToolkitContext } from 'modules/arjs-three/init-ar-toolkit-context'
import { initResizerContext } from 'modules/arjs-three/init-resizer-context'
import { initGestures } from 'modules/arjs-three/init-gestures'

import { deactivatePinchZoom } from 'modules/utils/deactivate-pinch-zoom'
import { arjsDepsContext } from './arjs-deps-context'
import { startRendering } from './start-rendering'
import { BASE_URL } from 'modules/config'

export const initAR = async () => {
  const context = arjsDepsContext
  context.register('config', getARJSConfig(BASE_URL))
  context.register('threeContext', threeContext)

  deactivatePinchZoom()

  // Three.js Init
  await initThreeContext(context)

  // AR Toolkit Init
  await initARJSToolkitContext(context)

  // Resizer Init
  initResizerContext(context)

  // Gestures Control
  initGestures(context)

  // Rendering Pipeline
  startRendering(context)
}
