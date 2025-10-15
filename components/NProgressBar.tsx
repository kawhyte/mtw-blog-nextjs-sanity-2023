'use client'

import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import { useEffect } from 'react'

// Configure NProgress for optimal user experience
NProgress.configure({
  showSpinner: false, // Hide spinner, keep it clean
  minimum: 0.3, // Start at 30% to show immediate feedback
  easing: 'ease', // Smooth easing
  speed: 400, // Animation speed
  trickleSpeed: 200, // How often to trickle
})

/**
 * NProgress loading bar component
 * Shows a pink progress bar at the top during page navigation
 * Provides immediate visual feedback to users on slow connections
 */
export default function NProgressBar() {
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => NProgress.start()
    const handleComplete = () => NProgress.done()

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  return null // This component doesn't render anything
}
