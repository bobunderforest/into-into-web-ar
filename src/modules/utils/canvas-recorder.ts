// import { encodeMP4 } from './encoder'

export class CanvasRecorder {
  isRecording: boolean = false
  supportedType: string | null = null
  recordedBlobs: Blob[] = []
  mediaRecorder: MediaRecorder | null = null
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas

    let types = [
      'video/mp4',
      'video/mpeg',
      // 'video/webm',
      // 'video/webm,codecs=vp9',
      // 'video/vp8',
      // 'video/webm\;codecs=vp8',
      // 'video/webm\;codecs=daala',
      // 'video/webm\;codecs=h264',
    ]

    for (let i in types) {
      if (MediaRecorder.isTypeSupported(types[i])) {
        this.supportedType = types[i]
        break
      }
    }

    // const video = document.createElement('video')
    // video.style.display = 'none'
  }

  startRecording(
    video_bits_per_sec: number = 3500000, // 2.5Mbps
  ) {
    // if (this.supportedType === null) {
    //   throw new Error('No supported type found for MediaRecorder')
    // }

    const options = {
      mimeType: this.supportedType!,
      videoBitsPerSecond: video_bits_per_sec,
    }

    var stream = this.canvas.captureStream()
    if (typeof stream === 'undefined' || !stream) {
      return
    }

    this.recordedBlobs = []
    try {
      this.mediaRecorder = new MediaRecorder(stream, options)
    } catch (e) {
      alert('MediaRecorder is not supported by this browser.')
      console.error('Exception while creating MediaRecorder:', e)
      return
    }

    console.info(
      '[Canvas Recorder]: MediaRecorder Created',
      this.mediaRecorder,
      'with options',
      options,
    )
    this.mediaRecorder.onstop = this.handleStop
    this.mediaRecorder.ondataavailable = this.handleDataAvailable
    this.mediaRecorder.start(20)

    this.isRecording = true
    console.info('MediaRecorder started', this.mediaRecorder)
  }

  handleDataAvailable = (event: BlobEvent) => {
    if (event.data && event.data.size > 0) {
      this.recordedBlobs.push(event.data)
    }
  }

  handleStop = (event: Event) => {
    console.info('[CanvasRecorder] Recorder stopped: ', event)
    this.download()
    // const superBuffer = new Blob(this.recordedBlobs, {
    //   type: this.supportedType!,
    // })
    // video.src = window.URL.createObjectURL(superBuffer)
  }

  stopRecording = () => {
    this.mediaRecorder?.stop()
    this.isRecording = false
    console.info('[CanvasRecorder] Recorded Blobs: ', this.recordedBlobs)
    // video.controls = true
  }

  download = async (fileName = 'into-into.mp4') => {
    const blob = new Blob(this.recordedBlobs, { type: this.supportedType! })
    // await encodeMP4()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 100)
  }
}
