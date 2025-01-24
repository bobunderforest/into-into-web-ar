import { BASE_URL } from 'modules/config'
import { ARJSConfigType } from './types'

// https://ar-js-org.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
// https://github.com/nicolocarpignoli/artoolkit-barcode-markers-collection

export const getARJSConfig = (): ARJSConfigType => ({
  doOrientation: true,
  sourceConfig: {
    source: 'webcam',
  },
  contextConfig: {
    // debug: true,
    // patternRatio: 0.5,
    cameraParametersUrl: `${BASE_URL}data/camera_para.dat`,
    detectionMode: 'mono',
    imageSmoothingEnabled: true,
  },
  controlConfig: {
    type: 'pattern',
    // patternUrl: `${BASE_URL}data/pattern-barcode.patt`,
    patternUrl: `${BASE_URL}data/pattern-qr-code.patt`,
    smooth: false,
    smoothCount: 3,
    smoothTolerance: 0.005,
    smoothThreshold: 0.5,
  },
})
