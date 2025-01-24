import { initResizer } from 'modules/arjs-helpers/arjs-inits'
import type { ARJSContext } from './types'

export const initResizerContext = (context: ARJSContext) => {
  const arSource = context.get('arSource')
  const arContext = context.get('arContext')
  const renderer = context.get('threeRenderer')

  initResizer({
    arSource,
    arContext,
    renderer,
  })
}
