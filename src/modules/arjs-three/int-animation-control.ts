import { ARJSContext } from './types'

export const initAnimationControl = (context: ARJSContext) => {
  const threeMarkerScenes = context.get('threeMarkerScenes')

  window.addEventListener('markerFound', (e: any) => {
    console.info('[Marker Found]', e.detail)
    const { animationAction } = threeMarkerScenes[e.detail.id]
    animationAction.play()
  })

  window.addEventListener('markerLost', (e: any) => {
    console.info('[Marker Lost]', e.detail)
    const { animationAction } = threeMarkerScenes[e.detail.id]
    animationAction.stop()
    animationAction.reset()
  })
}
