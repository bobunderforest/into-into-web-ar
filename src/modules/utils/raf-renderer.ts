import { animationFrame } from './animationFrame'

export type RenderFn = (deltaTime: number, nowTime: number) => void

export class RAFRenderer {
  renderFns: RenderFn[] = []
  isRunning = false
  lastTimeMsec: number | null = null

  animate = (nowMsec: number) => {
    if (!this.isRunning) return

    this.lastTimeMsec = this.lastTimeMsec || nowMsec - 1000 / 60
    let deltaMsec = Math.min(200, nowMsec - this.lastTimeMsec)
    this.lastTimeMsec = nowMsec

    this.renderFns.forEach((render) => {
      render(deltaMsec / 1000, nowMsec / 1000)
    })

    animationFrame(this.animate)
  }

  startRender = () => {
    this.isRunning = true
    animationFrame(this.animate)
  }

  stopRender = () => {
    this.isRunning = false
  }

  registerRenderFn = (renderFn: RenderFn) => {
    this.renderFns.push(renderFn)
  }
}
