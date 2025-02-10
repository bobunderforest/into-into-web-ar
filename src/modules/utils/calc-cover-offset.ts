export function calcCoverOffset(
  sourceW: number,
  sourceH: number,
  targetW: number,
  targetH: number,
) {
  // compute sourceAspect
  const sourceAspect = sourceW / sourceH
  // compute screenAspect
  const screenAspect = targetW / targetH

  // if screenAspect < sourceAspect, then change the width, else change the height
  if (screenAspect < sourceAspect) {
    // compute newWidth and set .width/.marginLeft
    const newWidth = sourceAspect * targetH

    return {
      width: newWidth,
      marginLeft: -(newWidth - targetW) / 2,
      height: targetH,
      marginTop: 0,
    }
  } else {
    // compute newHeight and set .height/.marginTop
    var newHeight = 1 / (sourceAspect / targetW)

    return {
      width: targetW,
      marginLeft: 0,
      height: newHeight,
      marginTop: -(newHeight - targetH) / 2,
    }
  }
}
