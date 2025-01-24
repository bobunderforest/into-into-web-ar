import { RAFRenderer } from 'modules/utils/raf-renderer'
import { initThree } from 'modules/three-helpers/init-three'
import { initThreeLight } from 'modules/three-helpers/init-three-light'
import { loadModels } from 'modules/three-helpers/load-models'

import type { ARJSContext } from './types'

export const initThreeContext = async (context: ARJSContext) => {
  const threeContext = context.get('threeContext')
  const THREE = threeContext.get('THREE')

  const rafRenderer = new RAFRenderer()
  const { renderer, scene, camera, markerGroup, markerScene } = initThree(THREE)
  const { renderModels, kastet } = await loadModels({
    markerScene,
    threeContext,
  })

  const { renderLight } = initThreeLight(THREE, {
    markerScene,
  })

  console.log(camera)
  context.register('threeCamera', camera)
  context.register('threeRenderer', renderer)
  context.register('threeScene', scene)
  context.register('threeMarkerScene', markerScene)
  context.register('threeMarkerGroup', markerGroup)

  context.register('modelKastet', kastet.scene)

  context.register('rafRenderer', rafRenderer)
  context.register('renderModels', renderModels)
  context.register('renderLight', renderLight)
}
