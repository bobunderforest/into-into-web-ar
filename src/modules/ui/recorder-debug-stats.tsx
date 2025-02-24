import * as THREE from 'three'
import type { Sizes } from './canvas-recorder'

type Props = {
  arSource: any
  renderer: THREE.Renderer
  sizes: Sizes
  resultCanvas: HTMLCanvasElement
}

export const RecorderDebugStats = ({
  arSource,
  renderer,
  sizes,
  resultCanvas,
}: Props) => {
  return (
    <div className="recorder-debug">
      <table>
        <tbody>
          <tr>
            <td>dpr</td>
            <td>{sizes?.dpr}</td>
          </tr>

          <tr></tr>
          <tr>
            <td>screen</td>
            <td>
              {window.innerWidth} x {window.innerHeight}
            </td>
          </tr>

          <tr></tr>
          <tr>
            <td>video</td>
            <td>
              {arSource.domElement.videoWidth} x{' '}
              {arSource.domElement.videoHeight};{' '}
              {arSource.domElement.style.marginLeft};
            </td>
          </tr>

          <tr></tr>
          <tr>
            <td>video style</td>
            <td>
              {arSource.domElement.style.width} x{' '}
              {arSource.domElement.style.height};{' '}
              {arSource.domElement.style.marginLeft};
            </td>
          </tr>

          <tr></tr>
          <tr>
            <td>render</td>
            <td>
              {renderer.domElement.width} x {renderer.domElement.height}
            </td>
          </tr>

          <tr></tr>
          <tr>
            <td>render style</td>
            <td>
              {renderer.domElement.style.width} x{' '}
              {renderer.domElement.style.height};{' '}
              {renderer.domElement.style.marginLeft};{' '}
              {renderer.domElement.style.marginTop}
            </td>
          </tr>

          <tr></tr>
          <tr>
            <td>render wrapper</td>
            <td>
              {renderer.domElement.style.width} x{' '}
              {renderer.domElement.style.height};{' '}
              {renderer.domElement.style.marginLeft};{' '}
              {renderer.domElement.style.marginTop}
            </td>
          </tr>

          <tr></tr>
          <tr>
            <td>result</td>
            <td>
              {resultCanvas?.width} x {resultCanvas?.height}
            </td>
          </tr>

          <tr></tr>
          <tr>
            <td>result style</td>
            <td>
              {resultCanvas?.style.width} x {resultCanvas?.style.height};{' '}
              {resultCanvas?.style.marginLeft}; {resultCanvas?.style.marginTop}
            </td>
          </tr>

          <tr></tr>
          <tr>
            <td>offset video</td>
            <td>
              {sizes?.offsetVideo.width} x {sizes?.offsetVideo.height};{' '}
              {sizes?.offsetVideo.marginLeft}; {sizes?.offsetVideo.marginTop}
            </td>
          </tr>

          <tr></tr>
          <tr>
            <td>offset render</td>
            <td>
              {sizes?.offsetRender.width} x {sizes?.offsetRender.height};{' '}
              {sizes?.offsetRender.marginLeft}; {sizes?.offsetRender.marginTop}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
