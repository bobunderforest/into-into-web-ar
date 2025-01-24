export type GestureState = {
  startTime?: number
  startPosition?: { x: number; y: number }
  startSpread?: number

  spread: number
  touchCount: number
  positionRaw: { x: number; y: number }
  position: { x: number; y: number }
}

export type GestureHandlerOptions = {
  enabled: boolean
  rotationFactor: number
  minScale: number
  maxScale: number
}
