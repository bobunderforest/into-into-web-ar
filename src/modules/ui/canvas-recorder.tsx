import cns from 'classnames'
import { useCallback, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useAR } from 'modules/arjs-react/ar-context'
import { CanvasRecorder } from 'modules/utils/canvas-recorder'
import { calcCoverOffset } from 'modules/utils/calc-cover-offset'
import { Html } from '@react-three/drei'

type Sizes = {
  width: number
  height: number
  dpr: number
  offset: ReturnType<typeof calcCoverOffset>
}

export function CanvasRecorderComponent() {
  const { gl: renderer } = useThree()
  const { arSource } = useAR()

  const [sizes, setSizes] = useState<Sizes | null>(null)
  const [isRecording, setRecording] = useState(false)
  const [takeScreenshot, setScreenshot] = useState(false)
  const [canvasRecorder, setCanvasRecorder] = useState<CanvasRecorder | null>(
    null,
  )
  const [resultCanvas, setResultCanvas] = useState<HTMLCanvasElement | null>(
    null,
  )
  const [resultCtx, setResultCtx] = useState<CanvasRenderingContext2D | null>(
    null,
  )

  useEffect(() => {
    const webcamVideo = arSource.domElement

    const resultCanvas = document.createElement('canvas')
    resultCanvas.classList.add('recorder-canvas')
    document.body.appendChild(resultCanvas)
    const resultCtx = resultCanvas.getContext('2d') as CanvasRenderingContext2D

    const canvasRecorder = new CanvasRecorder(resultCanvas)

    setResultCanvas(resultCanvas)
    setResultCtx(resultCtx)
    setCanvasRecorder(canvasRecorder)

    // Calculate sizes
    const initSizes = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      const sizes = {
        width,
        height,
        dpr: window.devicePixelRatio || 1,
        offset: calcCoverOffset(
          webcamVideo.videoWidth,
          webcamVideo.videoHeight,
          width,
          height,
        ),
      }

      resultCanvas.width = sizes.width * sizes.dpr
      resultCanvas.height = sizes.height * sizes.dpr
      resultCanvas.style.width = sizes.width + 'px'
      resultCanvas.style.height = sizes.height + 'px'

      setSizes(sizes)
    }

    initSizes()
    window.addEventListener('resize', () => {
      initSizes()
    })
  }, [])

  const clearResult = useCallback(() => {
    setTimeout(() => {
      if (!resultCtx || !sizes) return
      resultCtx.clearRect(
        0,
        0,
        sizes.width * sizes.dpr,
        sizes.height * sizes.dpr,
      )
    }, 0)
  }, [sizes, resultCtx])

  useFrame((_, deltaTime) => {
    if (
      (!isRecording && !takeScreenshot) ||
      !canvasRecorder ||
      !resultCanvas ||
      !resultCtx ||
      !sizes
    ) {
      return
    }

    const webcamVideo = arSource.domElement
    const renderCanvas = renderer.domElement
    const { width, height, dpr, offset } = sizes

    // Render video and canvas to a single canvas

    resultCtx.clearRect(0, 0, width, height)

    resultCtx.save()
    resultCtx.scale(dpr, dpr)
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
      setScreenshot(false)
      const data = resultCanvas.toDataURL('image/jpeg')
      clearResult()
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = data
      a.download = 'into-into'
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        document.body.removeChild(a)
      }, 100)
    }
  })

  const handleRecording = useCallback(() => {
    if (!canvasRecorder) return
    if (canvasRecorder.isRecording) {
      setRecording(false)
      canvasRecorder.stopRecording()
      clearResult()
    } else {
      setRecording(true)
      canvasRecorder.startRecording()
    }
  }, [clearResult, canvasRecorder])

  const handleScreenshot = useCallback(() => {
    setScreenshot(true)
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
  }, [])

  return (
    <Html>
      <div
        className={cns('recorder-button', { 'is-active': isRecording })}
        onClick={handleRecording}
      />
      <div className={'screenshot-button'} onClick={handleScreenshot} />
    </Html>
  )
}
