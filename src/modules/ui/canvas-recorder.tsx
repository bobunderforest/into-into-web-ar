import cns from 'classnames'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useAR } from 'modules/arjs-react/ar-context'
import { CanvasRecorder } from 'modules/utils/canvas-recorder'
import { calcCoverOffset } from 'modules/utils/calc-cover-offset'
import { Html } from '@react-three/drei'

type Sizes = {
  width: number
  height: number
  dpr: number
  offsetVideo: ReturnType<typeof calcCoverOffset>
  offsetRender: ReturnType<typeof calcCoverOffset>
}

export function CanvasRecorderComponent() {
  const { gl: renderer } = useThree()
  const { arSource, arContext } = useAR()

  const state = useRef({
    sizes: null as null | Sizes,
    takeScreenshot: false,
    canvasRecorder: null as null | CanvasRecorder,
    resultCanvas: null as null | HTMLCanvasElement,
    resultCtx: null as null | CanvasRenderingContext2D,
  })

  useEffect(() => {
    const webcamVideo = arSource.domElement
    const renderCanvas = renderer.domElement

    const resultCanvas = document.createElement('canvas')
    resultCanvas.classList.add('recorder-canvas')
    document.body.appendChild(resultCanvas)
    const resultCtx = resultCanvas.getContext('2d') as CanvasRenderingContext2D

    const canvasRecorder = new CanvasRecorder(resultCanvas)

    state.current.resultCanvas = resultCanvas
    state.current.resultCtx = resultCtx
    state.current.canvasRecorder = canvasRecorder

    // Calculate sizes
    const initSizes = () => {
      // const dpr = window.devicePixelRatio || 1
      const dpr = 1 // 1 for better video fps
      const width = window.innerWidth
      const height = window.innerHeight
      resultCanvas.width = width * dpr
      resultCanvas.height = height * dpr
      resultCanvas.style.width = width + 'px'
      resultCanvas.style.height = height + 'px'

      const sizes = {
        dpr,
        width,
        height,
        offsetVideo: calcCoverOffset(
          webcamVideo.videoWidth,
          webcamVideo.videoHeight,
          width,
          height,
        ),
        offsetRender: calcCoverOffset(
          renderCanvas.width,
          renderCanvas.height,
          width,
          height,
        ),
      }

      state.current.sizes = sizes
    }

    initSizes()
    setTimeout(() => {
      initSizes()
    }, 100)
    window.addEventListener('resize', () => {
      initSizes()
    })
  }, [])

  const clearResult = useCallback(() => {
    setTimeout(() => {
      const { resultCtx, sizes } = state.current
      if (!resultCtx || !sizes) return
      const { width, height, dpr } = sizes
      resultCtx.clearRect(0, 0, width * dpr, height * dpr)
    }, 0)
  }, [])

  useFrame((_, deltaTime) => {
    const { takeScreenshot, canvasRecorder, resultCanvas, resultCtx, sizes } =
      state.current

    if (
      !canvasRecorder ||
      (!canvasRecorder.isRecording && !takeScreenshot) ||
      !resultCanvas ||
      !resultCtx ||
      !sizes
    ) {
      return
    }

    const webcamVideo = arSource.domElement
    const renderCanvas = renderer.domElement
    const { width, height, dpr, offsetVideo, offsetRender } = sizes

    // Render video and canvas to a single canvas
    resultCtx.save()
    resultCtx.scale(dpr, dpr)
    resultCtx.clearRect(0, 0, width, height)
    resultCtx.drawImage(
      webcamVideo,
      0,
      0,
      webcamVideo.videoWidth,
      webcamVideo.videoHeight,
      offsetVideo.marginLeft,
      offsetVideo.marginTop,
      offsetVideo.width,
      offsetVideo.height,
    )

    resultCtx.drawImage(
      renderCanvas,
      0,
      0,
      renderCanvas.width,
      renderCanvas.height,
      offsetRender.marginLeft,
      offsetRender.marginTop,
      offsetRender.width,
      offsetRender.height,
    )

    resultCtx.restore()

    if (takeScreenshot) {
      state.current.takeScreenshot = false
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
    const { canvasRecorder } = state.current
    if (!canvasRecorder) return
    if (canvasRecorder.isRecording) {
      canvasRecorder.stopRecording()
      clearResult()
    } else {
      canvasRecorder.startRecording()
    }
  }, [clearResult])

  const handleScreenshot = useCallback(() => {
    state.current.takeScreenshot = true
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
        className={cns('recorder-button', {
          'is-active': state.current.canvasRecorder?.isRecording,
        })}
        onClick={handleRecording}
      />
      <div className={'screenshot-button'} onClick={handleScreenshot} />
    </Html>
  )
}
