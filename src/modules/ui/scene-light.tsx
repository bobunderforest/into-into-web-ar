import { generateSphereCoordinates } from 'modules/utils/generate-sphere-coordinates'

const sphereCoordinates = generateSphereCoordinates(20, 3)

export function SceneLight() {
  return (
    <>
      <ambientLight intensity={1.5} />
      {sphereCoordinates.map((coord, i) => (
        <pointLight
          key={i}
          position={coord}
          color={0xffffff}
          intensity={1}
          distance={155}
        />
      ))}
      {/* <hemisphereLight color={0xffffff} groundColor={0xffffff} intensity={15} /> */}
    </>
  )
}
