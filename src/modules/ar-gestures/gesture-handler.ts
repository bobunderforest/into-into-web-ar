import type * as THREE from 'three'
import { GestureManager } from './gestures-manager'
import { GestureHandlerOptions } from './types'

export class GestureHandler {
  initialScale: THREE.Vector3
  scaleFactor: number
  isVisible?: boolean
  object3D: THREE.Object3D
  gestureManager: GestureManager
  options: GestureHandlerOptions

  constructor(
    THREEx: typeof THREE,
    object3D: THREE.Object3D,
    gestureManager: GestureManager,
    options: Partial<GestureHandlerOptions> = {},
  ) {
    this.object3D = object3D
    this.gestureManager = gestureManager

    // Merge default options
    this.options = Object.assign(
      {
        enabled: true,
        rotationFactor: 5,
        minScale: 0.3,
        maxScale: 8,
      },
      options,
    )

    this.isVisible = true // If you have marker-based logic, set this as needed.

    // Initial scale to track how big the object was originally
    this.initialScale = new THREEx.Vector3().copy(this.object3D.scale)
    this.scaleFactor = 1

    // Register event listeners
    if (this.options.enabled) {
      this.gestureManager.eventDispatcher.addEventListener(
        'onefingermove',
        this.handleRotation,
      )
      this.gestureManager.eventDispatcher.addEventListener(
        'twofingermove',
        this.handleScale,
      )
    }
  }

  enable() {
    if (this.options.enabled) return
    this.options.enabled = true
    this.gestureManager.eventDispatcher.addEventListener(
      'onefingermove',
      this.handleRotation,
    )
    this.gestureManager.eventDispatcher.addEventListener(
      'twofingermove',
      this.handleScale,
    )
  }

  disable() {
    if (!this.options.enabled) return
    this.options.enabled = false
    this.gestureManager.eventDispatcher.removeEventListener(
      'onefingermove',
      this.handleRotation,
    )
    this.gestureManager.eventDispatcher.removeEventListener(
      'twofingermove',
      this.handleScale,
    )
  }

  // For AR marker logic, you could call these from outside:
  onMarkerFound() {
    this.isVisible = true
  }
  onMarkerLost() {
    this.isVisible = false
  }

  handleRotation = (event) => {
    if (!this.isVisible) return
    console.log(event)

    const detail = event.detail
    this.object3D.rotation.y +=
      detail.positionChange.x * this.options.rotationFactor
    this.object3D.rotation.x +=
      detail.positionChange.y * this.options.rotationFactor
  }

  handleScale = (event) => {
    if (!this.isVisible) return

    const detail = event.detail

    // Keep track of scale factor
    // event.detail.startSpread is from the initial gesture start
    // spreadChange = currentSpread - previousSpread
    // so ratio ~ 1 + (spreadChange / startSpread) is the same logic from A-Frame
    this.scaleFactor *= 1 + detail.spreadChange / detail.startSpread

    // Clamp scale factor
    this.scaleFactor = Math.min(
      Math.max(this.scaleFactor, this.options.minScale),
      this.options.maxScale,
    )

    // Apply to the object's scale
    this.object3D.scale.set(
      this.initialScale.x * this.scaleFactor,
      this.initialScale.y * this.scaleFactor,
      this.initialScale.z * this.scaleFactor,
    )
  }
}
