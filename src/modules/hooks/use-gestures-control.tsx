import { useEffect } from 'react'
import { THREE } from 'modules/arjs-core/arjs-endpoint'
import { GestureHandler, GestureManager } from 'modules/ar-gestures'

export const useGesturesControl = (object?: THREE.Object3D | null) => {
  if (!object) return
  useEffect(() => {
    const gestureManager = new GestureManager(THREE, document.documentElement)
    const gestureHandler = new GestureHandler(THREE, object, gestureManager, {
      rotationFactor: 5,
      minScale: 0.3,
      maxScale: 8,
    })
    return () => {
      gestureHandler.disable()
      gestureManager.dispose()
    }
  }, [object])
}
