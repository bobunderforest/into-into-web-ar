import type * as THREE from 'three'

export const initThree = (THREEx: typeof THREE) => {
  const pixelRatio = window.devicePixelRatio
    ? Math.max(Number(window.devicePixelRatio), 1)
    : 1

  // init renderer
  const renderer = new THREEx.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: document.querySelector('#ar-canvas')!,
  })

  renderer.setClearColor(new THREEx.Color('lightgrey'), 0)
  renderer.setPixelRatio(pixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  // We should be able to specify an html element to append AR.js related elements to.
  // document.body.appendChild(renderer.domElement)

  // init scene and camera
  const scene = new THREEx.Scene()

  // Create a camera
  const camera = new THREEx.Camera()
  scene.add(camera)

  // Create a marker
  const markerGroup = new THREEx.Group()
  scene.add(markerGroup)

  const markerScene = new THREEx.Scene()
  markerGroup.add(markerScene)

  return {
    renderer,
    scene,
    camera,
    markerGroup,
    markerScene,
  }
}
