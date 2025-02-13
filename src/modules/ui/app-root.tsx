import { useEffect } from 'react'
import { Canvas, events } from '@react-three/fiber'
import { ARProvider } from 'modules/arjs-react/ar-context'
import { deactivatePinchZoom } from 'modules/utils/deactivate-pinch-zoom'
import { BASE_URL } from 'modules/utils/app-config'
import { ARJSContextConfig, ARJSSourceConfig } from 'modules/arjs-core/types'

// https://ar-js-org.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
// https://github.com/nicolocarpignoli/artoolkit-barcode-markers-collection
// https://www.nayuki.io/page/qr-code-generator-library

const sourceConfig: ARJSSourceConfig = {
  source: 'webcam',
  sourceWidth: 1440,
  sourceHeight: 1080,
}

const contextConfig: ARJSContextConfig = {
  // debug: true,
  cameraParametersUrl: `${BASE_URL}data/camera_para.dat`,
  detectionMode: 'mono_and_matrix',
  matrixCodeType: '3x3',
  imageSmoothingEnabled: true,
  // labelingMode: 'white_region',
  // canvasWidth: 640,
  // canvasHeight: 480,
}

const eventManagerFactory = (state) => ({
  ...events(state),

  compute(event, state) {
    state.pointer.set(
      (event.clientX / state.size.width) * 2 - 1,
      -(event.clientY / state.size.height) * 2 + 1,
    )
    state.raycaster.setFromCamera(state.pointer, state.camera)
  },
})

type Props = {
  children: React.ReactNode
}

export function AppRoot({ children }: Props) {
  useEffect(() => {
    deactivatePinchZoom()
  }, [])

  return (
    <Canvas
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'default',
        // renderer.setClearColor(new THREEx.Color('lightgrey'), 0)
        // physicallyCorrectLights: true,
      }}
      dpr={window.devicePixelRatio || 1}
      events={eventManagerFactory}
      camera={{ position: [0, 0, 0] }}
      className="threejs-canvas-wrapper"
      // onCreated={({ gl }) => {
      //   gl.setSize(window.innerWidth, window.innerHeight)
      // }}
    >
      <ARProvider configSource={sourceConfig} configContext={contextConfig}>
        {children}
      </ARProvider>
    </Canvas>
  )
}
