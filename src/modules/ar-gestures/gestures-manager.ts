// https://github.com/fcor/arjs-gestures

import type * as THREE from 'three'
import { GestureState } from './types'

export class GestureManager {
  eventDispatcher: THREE.EventDispatcher<any>
  domElement: HTMLElement
  isVisible?: boolean
  previousState: GestureState | null
  currentState: GestureState | null

  constructor(THREEx: typeof THREE, domElement: HTMLElement) {
    this.domElement = domElement
    this.previousState = null
    this.currentState = null
    this.eventDispatcher = new THREEx.EventDispatcher()

    // Attach touch listeners
    domElement.addEventListener('touchstart', this.emitGestureEvent)
    domElement.addEventListener('touchmove', this.emitGestureEvent)
    domElement.addEventListener('touchend', this.emitGestureEvent)
  }

  dispose() {
    // Remove listeners if/when you need to clean up
    this.domElement.removeEventListener('touchstart', this.emitGestureEvent)
    this.domElement.removeEventListener('touchmove', this.emitGestureEvent)
    this.domElement.removeEventListener('touchend', this.emitGestureEvent)
  }

  emitGestureEvent = (event: TouchEvent) => {
    const currentState = this.getTouchState(event)
    const previousState = this.previousState
    const gestureContinues =
      previousState &&
      currentState &&
      currentState.touchCount === previousState?.touchCount
    const gestureEnded = previousState && !gestureContinues
    const gestureStarted = currentState && !gestureContinues

    // GESTURE END
    if (gestureEnded) {
      const eventName =
        this.getEventPrefix(previousState.touchCount) + 'fingerend'
      this.eventDispatcher.dispatchEvent({
        type: eventName,
        detail: previousState,
      })
      this.previousState = null
    }

    // GESTURE START
    if (gestureStarted) {
      currentState.startTime = performance.now()
      currentState.startPosition = currentState.position
      currentState.startSpread = currentState.spread
      const eventName =
        this.getEventPrefix(currentState.touchCount) + 'fingerstart'
      this.eventDispatcher.dispatchEvent({
        type: eventName,
        detail: currentState,
      })
      this.previousState = currentState
    }

    // GESTURE MOVE
    if (gestureContinues) {
      const eventDetail = {
        spreadChange: undefined as undefined | number,
        positionChange: {
          x: currentState.position.x - previousState.position.x,
          y: currentState.position.y - previousState.position.y,
        },
      }
      if (currentState.spread) {
        eventDetail.spreadChange = currentState.spread - previousState.spread
      }

      // Merge updated data into previousState
      Object.assign(previousState, currentState)

      // Attach the entire updated state to eventDetail
      Object.assign(eventDetail, previousState)

      const eventName =
        this.getEventPrefix(currentState.touchCount) + 'fingermove'
      this.eventDispatcher.dispatchEvent({
        type: eventName,
        detail: eventDetail,
      })
    }
  }

  getTouchState(event: TouchEvent): GestureState | null {
    if (event.touches.length === 0) {
      return null
    }

    // Convert event.touches to an array
    const touchList = Array.from(event.touches)

    // Calculate the center of all current touches (in raw screen coords)
    const centerX =
      touchList.reduce((sum, t) => sum + t.clientX, 0) / touchList.length
    const centerY =
      touchList.reduce((sum, t) => sum + t.clientY, 0) / touchList.length

    // Use an average of screen width+height to normalize [-1..1]
    const screenScale = 2 / (window.innerWidth + window.innerHeight)

    let spread = 0
    // Calculate spread if 2+ fingers
    if (touchList.length >= 2) {
      spread =
        touchList.reduce((sum, t) => {
          const dx = centerX - t.clientX
          const dy = centerY - t.clientY
          return sum + Math.sqrt(dx * dx + dy * dy)
        }, 0) / touchList.length
      spread *= screenScale
    }

    const touchState = {
      spread,
      touchCount: touchList.length,
      positionRaw: { x: centerX, y: centerY },
      position: {
        x: centerX * screenScale,
        y: centerY * screenScale,
      },
    }

    return touchState
  }

  getEventPrefix(touchCount: number) {
    const numberNames = ['one', 'two', 'three', 'many']
    return numberNames[Math.min(touchCount, 4) - 1]
  }
}
