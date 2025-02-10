import { ARJSContext } from './types'
import {
  initARContext,
  initARMarkerControls,
  initARSource,
} from 'modules/arjs-helpers/arjs-inits'

export const initARJSToolkitContext = async (context: ARJSContext) => {
  const config = context.get('config')
  const camera = context.get('threeCamera')
  const threeMarkerScenes = context.get('threeMarkerScenes')

  const arSource = await initARSource({ config })

  const arContext = await initARContext({
    config,
    camera,
    arSource,
  })

  const arMarkerControls = config.controlConfig.map((controlConfig, i) =>
    initARMarkerControls({
      arContext,
      markerGroup: threeMarkerScenes[i].group,
      config: controlConfig,
    }),
  )

  context.register('arSource', arSource)
  context.register('arContext', arContext)
  context.register('arControls', arMarkerControls)
}
