import { calcCoverOffset } from 'modules/utils/calc-cover-offset'
import { CanvasRecorder } from 'modules/utils/canvas-recorder'
import type { ARJSContext } from './types'

export const initRecorder = (context: ARJSContext) => {
  const rafRenderer = context.get('rafRenderer')
  const arSource = context.get('arSource')
  const renderer = context.get('threeRenderer')

  let takeScreenshot = false

  // Recorder
  const webcamVideo = arSource.domElement
  const renderCanvas = renderer.domElement

  const resultCanvas = document.createElement('canvas')
  const resultCtx = resultCanvas.getContext('2d') as CanvasRenderingContext2D
  document.body.appendChild(resultCanvas)

  const recordButtonEl = document.createElement('div')
  recordButtonEl.classList.add('recorder-button')
  document.body.appendChild(recordButtonEl)

  const screenshotButtonEl = document.createElement('div')
  screenshotButtonEl.classList.add('screenshot-button')
  document.body.appendChild(screenshotButtonEl)

  const canvasRecorder = new CanvasRecorder(resultCanvas)

  // Sizes
  let width: number
  let height: number
  let pixelRatio: number
  let offset: ReturnType<typeof calcCoverOffset>

  // Calculate sizes
  const initSizes = () => {
    width = window.innerWidth
    height = window.innerHeight
    pixelRatio = window.devicePixelRatio || 1

    resultCanvas.classList.add('recorder-canvas')
    resultCanvas.width = width * pixelRatio
    resultCanvas.height = height * pixelRatio
    resultCanvas.style.width = width + 'px'
    resultCanvas.style.height = height + 'px'

    offset = calcCoverOffset(
      webcamVideo.videoWidth,
      webcamVideo.videoHeight,
      width,
      height,
    )
  }

  initSizes()
  window.addEventListener('resize', () => {
    initSizes()
  })

  const clearResult = () => {
    resultCtx.clearRect(
      0,
      0,
      width * devicePixelRatio,
      height * devicePixelRatio,
    )
  }

  screenshotButtonEl.addEventListener('click', () => {
    takeScreenshot = true

    /**
     * ImageCapture approach does not supported in safari
     */
    // const track = arSource.domElement.srcObject.getVideoTracks()[0]
    // const imageCapture = new ImageCapture(track)
    // if (imageCapture) {
    //   imageCapture.takePhoto().then((blob) => {
    //     // const data = resultCanvas.toDataURL('image/jpeg')
    //     clearResult()
    //     const a = document.createElement('a')
    //     a.style.display = 'none'
    //     a.href = window.URL.createObjectURL(blob)
    //     a.download = 'into-into'
    //     document.body.appendChild(a)
    //     a.click()
    //   })
    //   // imageCapture.grabFrame().then(processFrame).catch(stopCamera)
    // }
  })

  recordButtonEl.addEventListener('click', () => {
    if (canvasRecorder.isRecording) {
      canvasRecorder.stopRecording()
      clearResult()
    } else {
      canvasRecorder.startRecording()
    }
    recordButtonEl.classList.toggle('is-active', canvasRecorder.isRecording)
  })

  // Render video and canvas to a single canvas
  rafRenderer.registerRenderFn((deltaTime, nowTime) => {
    if (!canvasRecorder.isRecording && !takeScreenshot) return

    resultCtx.clearRect(0, 0, width, height)

    resultCtx.save()
    resultCtx.scale(pixelRatio, pixelRatio)
    resultCtx.drawImage(
      webcamVideo,
      0,
      0,
      webcamVideo.videoWidth,
      webcamVideo.videoHeight,
      offset.marginLeft,
      offset.marginTop,
      offset.width,
      offset.height,
    )

    resultCtx.drawImage(
      renderCanvas,
      0,
      0,
      window.innerWidth,
      window.innerHeight,
    )
    resultCtx.restore()

    if (takeScreenshot) {
      takeScreenshot = false
      const data = resultCanvas.toDataURL('image/jpeg')
      clearResult()
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = data
      a.download = 'into-into'
      document.body.appendChild(a)
      a.click()
    }
  })
}
