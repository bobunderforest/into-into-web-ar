import { ArToolkitSource } from './arjs-endpoint'

type Args = {
  arSource: ArToolkitSource
}

export const getSourceOrientation = ({ arSource }: Args) => {
  const { videoWidth, videoHeight } = arSource.domElement
  const sourceOrientation = videoWidth > videoHeight ? 'landscape' : 'portrait'

  console.info(
    '[source orientation]',
    sourceOrientation,
    videoWidth,
    videoHeight,
  )

  return sourceOrientation
}
