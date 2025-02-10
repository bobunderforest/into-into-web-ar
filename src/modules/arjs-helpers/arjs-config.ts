import { BASE_URL } from 'modules/config'
import { ARJSConfigType } from './types'

// https://ar-js-org.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
// https://github.com/nicolocarpignoli/artoolkit-barcode-markers-collection
// https://www.nayuki.io/page/qr-code-generator-library

export const arjsConfig: ARJSConfigType = {
  doOrientation: true,
  sourceConfig: {
    source: 'webcam',
  },
  contextConfig: {
    // debug: true,
    cameraParametersUrl: `${BASE_URL}data/camera_para.dat`,
    detectionMode: 'mono_and_matrix',
    matrixCodeType: '3x3',
    imageSmoothingEnabled: true,
  },
  controlConfig: [
    {
      type: 'barcode',
      barcodeValue: 0,
      smooth: false,
      smoothCount: 1,
      smoothTolerance: 0.001,
      smoothThreshold: 0.5,
    },
    {
      type: 'barcode',
      barcodeValue: 1,
      smooth: false,
      smoothCount: 1,
      smoothTolerance: 0.001,
      smoothThreshold: 0.5,
    },
  ],
}
