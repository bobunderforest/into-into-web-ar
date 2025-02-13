import type * as THREE from 'three'
import { useGesturesControl } from 'modules/hooks/use-gestures-control'

type Props = {
  object: THREE.Object3D
}

export function GesturesControl({ object }: Props) {
  useGesturesControl(object)
  return null
}
