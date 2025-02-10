export function backgroundCover(
  sourceW: number,
  sourceH: number,
  targetW: number,
  targetH: number,
) {
  const sourceRatio = sourceW / sourceH
  const targetRatio = targetW / targetH

  let width: number
  let height: number

  if (targetRatio > sourceRatio) {
    width = targetW
    height = targetW / sourceRatio
  } else {
    width = targetH * sourceRatio
    height = targetH
  }

  return [width, height] as const
}
