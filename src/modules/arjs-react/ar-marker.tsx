import { useEffect, useMemo, useRef, useState } from 'react'
import { ThreeElements, useFrame } from '@react-three/fiber'
import { useAR } from './ar-context'
import { initARMarkerControls } from 'modules/arjs-core/arjs-inits'
import type { Group } from 'three'
import type { ArMarkerControls } from 'modules/arjs-core/arjs-endpoint'
import type { ARJSControlConfig } from 'modules/arjs-core/types'

const MARKER_CONFIG_DEFAULTS = {
  smooth: false,
  smoothCount: 1,
  smoothTolerance: 0.001,
  smoothThreshold: 0.5,
}

type Props = {
  config: ARJSControlConfig
  onFound?: (e: any) => void
  onLost?: (e: any) => void
  children: React.ReactNode
}

export const ARMarker = ({ children, config, onFound, onLost }: Props) => {
  const markerRoot = useRef<Group>(null)
  const { arContext } = useAR()
  const [markerControl, setState] = useState<ArMarkerControls>()

  useEffect(() => {
    const markerControl = initARMarkerControls({
      arContext,
      markerGroup: markerRoot.current!,
      config: {
        ...MARKER_CONFIG_DEFAULTS,
        ...config,
      },
    })
    setState(markerControl)

    return () => {
      const index = arContext._arMarkersControls.indexOf(markerControl)
      arContext._arMarkersControls.splice(index, 1)
    }
  }, [arContext, config])

  useEffect(() => {
    if (!markerControl) return

    const handleFound = (e: any) => {
      if (e.detail.id === markerControl.id) {
        console.info('[Marker Found]', e.detail)
        onFound?.(e.detail)
      }
    }

    const handleLost = (e: any) => {
      if (e.detail && e.detail.id === markerControl.id) {
        console.info('[Marker Lost]', e.detail)
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

  return <group ref={markerRoot}>{children}</group>
}
