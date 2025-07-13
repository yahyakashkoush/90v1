'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentPhase, setCurrentPhase] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Particle system for cyberpunk effect
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      alpha: number
    }> = []

    const colors = ['#ff00ff', '#00ffff', '#ff1493', '#1e90ff', '#00ff00']

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random()
      })
    }

    let animationId: number

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)'
      ctx.lineWidth = 1
      const gridSize = 20

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        particle.alpha = Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.5 + 0.5

        ctx.save()
        ctx.globalAlpha = particle.alpha
        ctx.fillStyle = particle.color
        ctx.shadowBlur = 10
        ctx.shadowColor = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Phase transitions
    const phaseTimer1 = setTimeout(() => setCurrentPhase(1), 1000)
    const phaseTimer2 = setTimeout(() => setCurrentPhase(2), 2000)
    const phaseTimer3 = setTimeout(() => setCurrentPhase(3), 3000)

    return () => {
      cancelAnimationFrame(animationId)
      clearTimeout(phaseTimer1)
      clearTimeout(phaseTimer2)
      clearTimeout(phaseTimer3)
    }
  }, [])

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.5, rotateY: 180 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotateY: 0,
      transition: { 
        duration: 1.5, 
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }
    }
  }

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1, 
        delay: 0.5,
        ease: "easeOut"
      }
    }
  }

  const glitchVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        delay: 1.5
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-retro-dark overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <AnimatePresence>
          {currentPhase >= 0 && (
            <motion.div
              variants={logoVariants}
              initial="hidden"
              animate="visible"
              className="text-center mb-8"
            >
              <div className="relative">
                <h1 className="text-6xl md:text-8xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-green">
                  RETRO
                </h1>
                <div className="absolute inset-0 text-6xl md:text-8xl font-cyber font-black text-neon-pink opacity-50 animate-pulse-neon">
                  RETRO
                </div>
              </div>
            </motion.div>
          )}

          {currentPhase >= 1 && (
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-center mb-8"
            >
              <h2 className="text-3xl md:text-5xl font-cyber font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-orange">
                FUTURE
              </h2>
            </motion.div>
          )}

          {currentPhase >= 2 && (
            <motion.div
              variants={glitchVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <p className="text-lg md:text-xl font-cyber text-neon-cyan neon-text">
                FASHION BEYOND TIME
              </p>
              <div className="mt-4 flex justify-center">
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </motion.div>
          )}

          {currentPhase >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-10 text-center"
            >
              <div className="glitch" data-text="INITIALIZING...">
                INITIALIZING...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* VHS scan lines effect */}
      <div className="absolute inset-0 vhs-effect pointer-events-none" />
      
      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-neon-cyan"></div>
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-neon-pink"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-neon-green"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-neon-orange"></div>
    </div>
  )
}