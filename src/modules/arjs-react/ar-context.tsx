import {
  memo,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ArToolkitSource, ArToolkitContext } from '../arjs-core/arjs-endpoint'
import type {
  ARJSSourceConfig,
  ARJSContextConfig,
} from 'modules/arjs-core/types'
import {
  initARContext,
  initAROrientation,
  initARSource,
  initResizer,
} from 'modules/arjs-core/arjs-inits'

type ARContextValue = {
  arSource: ArToolkitSource
  arContext: ArToolkitContext
}

const ARContext = createContext<ARContextValue | null>(null)

type Props = {
  tracking?: boolean
  configSource: ARJSSourceConfig
  configContext: ARJSContextConfig
  // onCameraStreamError: (err: any) => void
  children: React.ReactNode
}

export const ARProvider = memo(function AR({
  tracking = true,
  children,
  configSource,
  configContext,
  // onCameraStreamReady,
  // onCameraStreamError,
}: Props) {
  const { gl, camera } = useThree()
  const [isInitialized, setInitialized] = useState<boolean>(false)
  const [arSource, setArSource] = useState<ArToolkitSource | null>(null)
  const [arContext, setArContext] = useState<ArToolkitContext | null>(null)

  useEffect(() => {
    let unmount: (() => void) | undefined

    const init = async () => {
      const arSource = await initARSource(configSource)
      const arContext = await initARContext(configContext, camera)

      initAROrientation(arSource, arContext)

      const unmountResizer = initResizer({
        arSource,
        arContext,
        renderer: gl,
        camera,
      })

      setArSource(arSource)
      setArContext(arContext)
      setInitialized(true)

      unmount = () => {
        setInitialized(false)
        unmountResizer()
        setArSource(null)
        setArContext(null)

        arContext.arController.dispose()
        if (arContext.arController.cameraParam) {
          arContext.arController.cameraParam.dispose()
        }

        const video = arSource.domElement
        if (video) {
          video.srcObject.getTracks().map((track: any) => track.stop())
          video.remove()
        }
      }
    }

    void init()

    return () => {
      unmount?.()
    }
  }, [gl, camera, configSource, configContext])

  useFrame(() => {
    if (!tracking) {
      return
    }

    if (arSource && arSource.ready !== false) {
      arContext.update(arSource.domElement)
    }
  })

  const value = useMemo(
    () => ({
      arSource,
      arContext,
    }),
    [arSource, arContext],
  )

  return (
    <ARContext.Provider value={value}>
      {isInitialized && <>{children}</>}
    </ARContext.Provider>
  )
})

export const useAR = () => {
  const arValue = useContext(ARContext)
  if (arValue === null) throw new Error('useAR called out of context')
  return useMemo(() => ({ ...arValue }), [arValue])
}
