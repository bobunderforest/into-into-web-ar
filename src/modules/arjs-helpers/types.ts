export type ARJSSourceConfig = {
  source: 'webcam' | 'video' | 'image'
  sourceUrl?: string | null
  displayWidth?: number
  displayHeight?: number
  sourceWidth?: number
  sourceHeight?: number
}

export type ARJSContextConfig = {
  debug?: boolean
  detectionMode?: 'mono' | 'mono_and_matrix' | 'color' | 'color_and_matrix'
  matrixCodeType?: string
  patternRatio?: number
  labelingMode?: string
  cameraParametersUrl: string
  maxDetectionRate?: number
  canvasWidth?: number
  canvasHeight?: number
  imageSmoothingEnabled?: boolean
}

export type ARJSControlConfig = {
  size?: number
  type?: string
  patternUrl?: string | number
  barcodeValue?: number | number
  changeMatrixMode?: 'modelViewMatrix' | 'cameraTransformMatrix'
  smooth?: boolean
  smoothCount?: number
  smoothTolerance?: number
  smoothThreshold?: number
}

export type ARJSConfigType = {
  doOrientation: boolean
  sourceConfig: ARJSSourceConfig
  contextConfig: ARJSContextConfig
  controlConfig: ARJSControlConfig
}
