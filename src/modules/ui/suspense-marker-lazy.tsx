import { useARMarker } from 'modules/arjs-react/ar-marker'
import { Suspense, useEffect, useState } from 'react'

type Props = {
  fallback: React.ReactNode
  children: React.ReactNode
}

export function SuspenseMarkerLazy({ fallback, children }: Props) {
  const [wasFoundOnce, setWasFoundOnce] = useState(false)
  const { isFound } = useARMarker()

  useEffect(() => {
    if (!wasFoundOnce && isFound) setWasFoundOnce(true)
  }, [wasFoundOnce, isFound])

  if (!wasFoundOnce) return

  return <Suspense fallback={fallback}>{children}</Suspense>
}
