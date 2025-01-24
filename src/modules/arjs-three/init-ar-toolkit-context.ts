import { ARJSContext } from './types'
import {
  initARContext,
  initARMarkerControls,
  initARSource,
} from 'modules/arjs-helpers/arjs-inits'

export const initARJSToolkitContext = async (context: ARJSContext) => {
  const config = context.get('config')
  const camera = context.get('threeCamera')
  const markerGroup = context.get('threeMarkerGroup')

  const arSource = await initARSource({ config })
  const arContext = await initARContext({
    config,
    camera,
    arSource,
  })
  const arMarkerControls = initARMarkerControls({
    arContext,
    markerGroup,
    config,
  })

  context.register('arSource', arSource)
  context.register('arContext', arContext)
  context.register('arControl', arMarkerControls)
}
