import type * as THREE from 'three'
import { generateSphereCoordinates } from './generate-sphere-coordinates'

type Args = {
  scene: THREE.Scene
}

export const initThreeLight = (THREEx: typeof THREE, { scene }: Args) => {
  const ambientLight = new THREEx.AmbientLight(0xee99aa, 1.5)
  scene.add(ambientLight)

  const sphereCoordinates = generateSphereCoordinates(35, 3)
  for (let i = 0; i < sphereCoordinates.length; i++) {
    const pointLight = new THREEx.PointLight(0xffffff, 565, 155)
    pointLight.position.set(...sphereCoordinates[i])
    scene.add(pointLight)
  }

  // const light = new THREEx.HemisphereLight(0xffffff, 0xffffff, 150)
  // scene.add(light)

  const renderLight = () => {}

  return {
    renderLight,
  }
}
