export const deactivatePinchZoom = () => {
  document.addEventListener('gesturestart', (e) => {
    e.preventDefault()
    ;(document as any).body.style.zoom = 1
  })
  document.addEventListener('gesturechange', (e) => {
    e.preventDefault()
    ;(document as any).body.style.zoom = 1
  })
  document.addEventListener('gestureend', (e) => {
    e.preventDefault()
    ;(document as any).body.style.zoom = 1
  })
}
