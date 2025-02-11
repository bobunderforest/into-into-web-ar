export const generateSphereCoordinates = (radius: number, segments: number) => {
  const coordinates: [number, number, number][] = []
  for (let u = 0; u <= segments; u++) {
    let phi = Math.PI * (u / segments)
    for (let v = 0; v <= segments; v++) {
      let theta = 2 * Math.PI * (v / segments)
      let x = radius * Math.cos(theta) * Math.sin(phi)
      let y = radius * Math.sin(theta) * Math.sin(phi)
      let z = radius * Math.cos(phi)
      coordinates.push([x, y, z])
    }
  }
  return coordinates
}
