import { RAFRenderer } from 'modules/utils/raf-renderer'
import { initThree } from 'modules/three-helpers/init-three'
import { initThreeLight } from 'modules/three-helpers/init-three-light'
import { markerSceneLoaders } from 'modules/three-helpers/load-marker-scenes'

import type { ARJSContext } from './types'

export const initThreeContext = async (context: ARJSContext) => {
  const threeContext = context.get('threeContext')
  const THREE = threeContext.get('THREE')

  const rafRenderer = new RAFRenderer()
  const { renderer, scene, camera } = initThree(THREE)

  const threeMarkerScenes = await Promise.all(
    context.get('config').controlConfig.map((_, i) =>
      (async () => {
        const markerGroup = new THREE.Group()
        scene.add(markerGroup)

        const markerScene = new THREE.Scene()
        markerGroup.add(markerScene)

        const markerSceneLoaded = await markerSceneLoaders[i]({
          markerScene,
          threeContext,
        })

        return {
          ...markerSceneLoaded,
          group: markerGroup,
          scene: markerScene,
        }
      })(),
    ),
  )

  const { renderLight } = initThreeLight(THREE, { scene })

  context.register('threeCamera', camera)
  context.register('threeRenderer', renderer)
  context.register('threeScene', scene)
  context.register('threeMarkerScenes', threeMarkerScenes)

  context.register('rafRenderer', rafRenderer)
  context.register('renderLight', renderLight)
}
