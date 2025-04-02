import type * as THREE from 'three'
import { useGesturesControl } from 'modules/hooks/use-gestures-control'
import { Html } from '@react-three/drei'
import RotateIconSVG from 'assets/rotate-icon.svg?react'

type Props = {
  object?: THREE.Object3D | null
}

export function GesturesControl({ object }: Props) {
  useGesturesControl(object)
  return (
    <Html>
      <div className={'gestures-rotate-icon'}>
        <RotateIconSVG />
      </div>
    </Html>
  )
}
