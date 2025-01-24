// https://ar-js-org.github.io/AR.js-Docs/marker-based/

import {
  THREE,
  ArToolkitSource,
  ArToolkitContext,
  ArMarkerControls,
} from './arjs-endpoint'
import { getSourceOrientation } from './get-source-orientation'
import type { ARJSConfigType } from './types'

/**
 * AR Toolkit Source
 */

type ARSourceArgs = {
  config: ARJSConfigType
}
export const initARSource = ({ config }: ARSourceArgs) =>
  new Promise<ArToolkitSource>((resolve) => {
    const arSource = new ArToolkitSource(config.sourceConfig)
    arSource.init(() => {
      arSource.domElement.addEventListener('canplay', () => {
        console.info(
          '[canplay source dimensions]',
          arSource.domElement.videoWidth,
          arSource.domElement.videoHeight,
        )
        console.info('[ARSource]', arSource)
        resolve(arSource)
      })
    })
  })

/**
 * AR Toolkit Context
 */

type ARContextArgs = {
  config: ARJSConfigType
  camera: THREE.Camera
  arSource: ArToolkitSource
}
export const initARContext = ({ config, camera, arSource }: ARContextArgs) =>
  new Promise<ArToolkitContext>((resolve) => {
    const arContext = new ArToolkitContext(config.contextConfig)

    arContext.init(() => {
      camera.projectionMatrix.copy(arContext.getProjectionMatrix())

      if (config.doOrientation) {
        const sourceOrientation = getSourceOrientation({ arSource })
        arContext.arController.orientation = sourceOrientation
        arContext.arController.options.orientation = sourceOrientation
      }

      console.info('[ARToolkitContext]', arContext)
      resolve(arContext)
    })
  })

/**
 * Marker Controls
 */

type ARMarkerControlArgs = {
  arContext: ArToolkitContext
  markerGroup: THREE.Group
  config: ARJSConfigType
}
export const initARMarkerControls = ({
  arContext,
  markerGroup,
  config,
}: ARMarkerControlArgs) => {
  const arMarkerControls = new ArMarkerControls(
    arContext,
    markerGroup,
    config.controlConfig,
  )

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
}
export const initResizer = ({
  arSource,
  arContext,
  renderer,
}: ARResizerArgs) => {
  const setSize = () => {
    arSource.onResizeElement()
    arSource.copyElementSizeTo(renderer.domElement)
    if (arContext.arController) {
      arSource.copyElementSizeTo(arContext.arController.canvas)
    }
  }
  setSize()
  window.addEventListener('resize', function () {
    setSize()
  })
}
