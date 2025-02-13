import {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useAR } from './ar-context'
import { initARMarkerControls } from 'modules/arjs-core/arjs-inits'
import type { Group } from 'three'
import type { ArMarkerControls } from 'modules/arjs-core/arjs-endpoint'
import type { ARJSControlConfig } from 'modules/arjs-core/types'

type ArMarkerContextValue = {
  isFound: boolean
  markerControl: ArMarkerControls
}

const arMarkerContext = createContext<ArMarkerContextValue | null>(null)

export const useARMarker = () => {
  const value = useContext(arMarkerContext)
  if (value === null) throw new Error('usArMarker call out of context')
  return value
}

type Props = ARJSControlConfig & {
  onFound?: (e: any) => void
  onLost?: (e: any) => void
  children: React.ReactNode | ((args: { isFound: boolean }) => React.ReactNode)
}

export const ARMarker = memo(
  ({
    children: childrenProp,
    onFound,
    onLost,
    type,
    size,
    patternUrl,
    barcodeValue,
    changeMatrixMode,
    smooth = false,
    smoothCount = 1,
    smoothThreshold = 0.001,
    smoothTolerance = 0.5,
  }: Props) => {
    const markerRoot = useRef<Group>(null)
    const { arContext } = useAR()
    const [markerControl, setState] = useState<ArMarkerControls>()
    const [isFound, setFound] = useState(false)

    useEffect(() => {
      const markerControl = initARMarkerControls({
        arContext,
        markerGroup: markerRoot.current!,
        config: {
          type,
          size,
          patternUrl,
          barcodeValue,
          changeMatrixMode,
          smooth,
          smoothCount,
          smoothThreshold,
          smoothTolerance,
        },
      })
      setState(markerControl)

      return () => {
        const index = arContext._arMarkersControls.indexOf(markerControl)
        arContext._arMarkersControls.splice(index, 1)
      }
    }, [
      arContext,
      type,
      size,
      patternUrl,
      barcodeValue,
      changeMatrixMode,
      smooth,
      smoothCount,
      smoothThreshold,
      smoothTolerance,
    ])

    useEffect(() => {
      if (!markerControl) return

      const handleFound = (e: any) => {
        if (e.detail.id === markerControl.id) {
          console.info('[Marker Found]', e.detail)
          setFound(true)
          onFound?.(e.detail)
        }
      }

      const handleLost = (e: any) => {
        if (e.detail && e.detail.id === markerControl.id) {
          console.info('[Marker Lost]', e.detail)
          setFound(false)
          onLost?.(e.detail)
        }
      }

      window.addEventListener('markerFound', handleFound)
      window.addEventListener('markerLost', handleLost)

      return () => {
        window.removeEventListener('markerFound', handleFound)
        window.removeEventListener('markerLost', handleLost)
      }
    }, [markerControl, onFound, onLost])

    // useFrame(() => {
    //   if (markerRoot.current.visible && !isFound) {
    //     setIsFound(true)
    //     if (onMarkerFound) {
    //       onMarkerFound()
    //     }
    //   } else if (!markerRoot.current.visible && isFound) {
    //     setIsFound(false)
    //     if (onMarkerLost) {
    //       onMarkerLost()
    //     }
    //   }
    // })

    const children =
      typeof childrenProp === 'function'
        ? childrenProp({ isFound })
        : childrenProp

    const value = useMemo(
      () => ({
        isFound,
        markerControl,
      }),
      [isFound, markerControl],
    )

    return (
      <arMarkerContext.Provider value={value}>
        <group ref={markerRoot}>{children}</group>
      </arMarkerContext.Provider>
    )
  },
)
