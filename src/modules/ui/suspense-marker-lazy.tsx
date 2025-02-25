import { useARMarker } from 'modules/arjs-react/ar-marker'
import { Suspense, useEffect, useState } from 'react'
import { LoadingAnimation } from './loading-animation'

type Props = {
  isPreloaded?: boolean
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function SuspenseMarkerLazy({ isPreloaded, fallback, children }: Props) {
  const [wasFoundOnce, setWasFoundOnce] = useState(false)
  const { isFound } = useARMarker()

  useEffect(() => {
    if ((!wasFoundOnce && isFound) || isPreloaded) setWasFoundOnce(true)
  }, [wasFoundOnce, isFound, isPreloaded])

  if (!wasFoundOnce) return null

  return (
    <Suspense fallback={fallback || <LoadingAnimation />}>{children}</Suspense>
  )
}
