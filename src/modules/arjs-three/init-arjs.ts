import { threeContext } from 'modules/arjs-helpers/arjs-endpoint'

import { arjsConfig } from 'modules/arjs-helpers/arjs-config'
import { initThreeContext } from 'modules/arjs-three/init-three-context'
import { initARJSToolkitContext } from 'modules/arjs-three/init-ar-toolkit-context'
import { initGesturesContext } from 'modules/arjs-three/init-gestures-context'

import { deactivatePinchZoom } from 'modules/utils/deactivate-pinch-zoom'
import { arjsDepsContext } from './arjs-deps-context'
import { initRendering } from './start-rendering'
import { initRecorder } from './init-recorder'
import { initAnimationControl } from './int-animation-control'
import { initResizer } from 'modules/arjs-helpers/arjs-inits'

export const initAR = async () => {
  const context = arjsDepsContext
  context.register('config', arjsConfig)
  context.register('threeContext', threeContext)

  deactivatePinchZoom()

  await initThreeContext(context)

  await initARJSToolkitContext(context)

  initAnimationControl(context)

  initResizer({
    arSource: context.get('arSource'),
    arContext: context.get('arContext'),
    renderer: context.get('threeRenderer'),
  })

  initGesturesContext(context)

  initRendering(context)

  initRecorder(context)

  context.get('rafRenderer').startRender()
}
