import { GestureHandler, GestureManager } from 'modules/ar-gestures'
import { ARJSContext } from './types'

export const initGestures = (context: ARJSContext) => {
  const THREE = context.get('threeContext').get('THREE')
  const object = context.get('modelKastet')

  const gestureManager = new GestureManager(THREE, document.documentElement)
  const gestureHandler = new GestureHandler(THREE, object, gestureManager, {
    rotationFactor: 5,
    minScale: 0.3,
    maxScale: 8,
  })
  // gestureHandler.onMarkerFound()
}
