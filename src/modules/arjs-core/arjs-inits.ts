// https://ar-js-org.github.io/AR.js-Docs/marker-based/

import {
  THREE,
  ArToolkitSource,
  ArToolkitContext,
  ArMarkerControls,
} from './arjs-endpoint'
import type {
  ARJSContextConfig,
  ARJSControlConfig,
  ARJSSourceConfig,
} from './types'

/**
 * AR Toolkit Source
 */

export const initARSource = (config: ARJSSourceConfig) =>
  new Promise<ArToolkitSource>((resolve) => {
    const arSource = new ArToolkitSource(config)
    arSource.init(() => {
      arSource.domElement.addEventListener('canplay', () => {
        const { videoWidth, videoHeight } = arSource.domElement
        console.info('[ARSource]', arSource)
        console.info('[canplay source dimensions]', videoWidth, videoHeight)
        resolve(arSource)
      })
    })
  })

/**
 * AR Toolkit Context
 */

export const initARContext = (
  config: ARJSContextConfig,
  camera: THREE.Camera,
) =>
  new Promise<ArToolkitContext>((resolve) => {
    const arContext = new ArToolkitContext(config)
    arContext.init(() => {
      camera.projectionMatrix.copy(arContext.getProjectionMatrix())
      console.info('[ARToolkitContext]', arContext)
      resolve(arContext)
    })
  })

/**
 * Source Orientation
 */

export const initAROrientation = (
  arSource: ArToolkitSource,
  arContext: ArToolkitContext,
) => {
  const { videoWidth, videoHeight } = arSource.domElement
  const sourceOrientation = videoWidth > videoHeight ? 'landscape' : 'portrait'
  arContext.arController.orientation = sourceOrientation
  arContext.arController.options.orientation = sourceOrientation

  console.info(
    '[source orientation]',
    sourceOrientation,
    videoWidth,
    videoHeight,
  )
}

/**
 * Marker Controls
 */

type ARMarkerControlArgs = {
  arContext: ArToolkitContext
  markerGroup: THREE.Group
  config: ARJSControlConfig
}
export const initARMarkerControls = ({
  arContext,
  markerGroup,
  config,
}: ARMarkerControlArgs) => {
  const arMarkerControls = new ArMarkerControls(arContext, markerGroup, config)
  console.info('[ArMarkerControls]', arMarkerControls)
  return arMarkerControls
}

/**
 * Resizer
 */

type ARResizerArgs = {
  arSource: ArToolkitSource
  arContext: ArToolkitContext
  renderer: THREE.Renderer
  camera: THREE.Camera
}
export const initResizer = ({
  arSource,
  arContext,
  renderer,
  camera,
}: ARResizerArgs) => {
  const setSize = () => {
    console.info('[AR Resize]')
    arSource.onResizeElement()
    const renderElement = document.querySelector(
      '.threejs-canvas-wrapper-outside',
    )! as any
    arSource.copyElementSizeTo(renderElement)
    if (arContext.arController !== null) {
      arSource.copyElementSizeTo(arContext.arController.canvas)
      camera.projectionMatrix.copy(arContext.getProjectionMatrix())
    }
  }
  setSize()
  setTimeout(() => {
    setSize()
  }, 100)
  window.addEventListener('resize', setSize)
  return () => {
    window.removeEventListener('resize', setSize)
  }
}
