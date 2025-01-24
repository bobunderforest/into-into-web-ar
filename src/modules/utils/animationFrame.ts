export const animationFrame =
  (window as any).requestAnimationFrame ||
  (window as any).mozRequestAnimationFrame ||
  (window as any).webkitRequestAnimationFrame ||
  (window as any).msRequestAnimationFrame
