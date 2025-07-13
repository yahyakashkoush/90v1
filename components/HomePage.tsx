'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import ProductGrid from './ProductGrid'
import Hero from './Hero'
import AITryOnSection from './AITryOnSection'
import Footer from './Footer'

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-retro-dark"
    >
      <Navbar />
      <Hero />
      <ProductGrid />
      <AITryOnSection />
      <Footer />
    </motion.div>
  )
}