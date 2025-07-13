'use client'

import { useState, useEffect } from 'react'
import SplashScreen from '@/components/SplashScreen'
import HomePage from '@/components/HomePage'

export default function Page() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 4000) // 4 seconds splash duration

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-retro-dark">
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <HomePage />
      )}
    </main>
  )
}