import type { ARJSContext } from './types'

export const startRendering = (context: ARJSContext) => {
  const rafRenderer = context.get('rafRenderer')
  const arContext = context.get('arContext')
  const arSource = context.get('arSource')
  const scene = context.get('threeScene')
  const camera = context.get('threeCamera')
  const renderer = context.get('threeRenderer')
  const renderModels = context.get('renderModels')
  const renderLight = context.get('renderLight')

  rafRenderer.registerRenderFn((deltaTime, nowTime) => {
    if (arSource.ready === false) return
    arContext.update(arSource.domElement)
    renderer.render(scene, camera)
    renderModels(deltaTime, nowTime)
    renderLight(deltaTime, nowTime)
  })

  rafRenderer.startRender()
}
