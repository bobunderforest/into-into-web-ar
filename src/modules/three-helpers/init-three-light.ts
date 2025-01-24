import type * as THREE from 'three'
import { generateSphereCoordinates } from './generate-sphere-coordinates'

type Args = {
  markerScene: THREE.Scene
}

export const initThreeLight = (THREEx: typeof THREE, { markerScene }: Args) => {
  const ambientLight = new THREEx.AmbientLight(0xee99aa, 25.5)
  markerScene.add(ambientLight)

  const sphereCoordinates = generateSphereCoordinates(35, 3)
  for (let i = 0; i < sphereCoordinates.length; i++) {
    const pointLight = new THREEx.PointLight(0xee99aa, 35, 155)
    pointLight.position.set(...sphereCoordinates[i])
    markerScene.add(pointLight)
  }

  const light = new THREEx.HemisphereLight(0xb1e1ff, 0xb97a20, 150)
  markerScene.add(light)

  const renderLight = () => {}

  return {
    renderLight,
  }
}
