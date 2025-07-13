'use client'

import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

interface Model3DViewerProps {
  modelPath?: string
  productName: string
  className?: string
}

// Simple 3D model placeholder (in real app, you'd load actual GLTF models)
function ProductModel({ color = '#ff00ff' }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <group>
      {/* Main garment shape */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <boxGeometry args={[1.5, 2, 0.3]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Neon accents */}
      <mesh position={[0, 0.5, 0.16]}>
        <boxGeometry args={[1.2, 0.1, 0.05]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
        />
      </mesh>

      <mesh position={[0, -0.5, 0.16]}>
        <boxGeometry args={[1.2, 0.1, 0.05]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Sleeves */}
      <mesh position={[-1, 0.3, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 1.2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[1, 0.3, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 1.2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}

function Scene({ productName }: { productName: string }) {
  const getModelColor = (name: string) => {
    if (name.toLowerCase().includes('neon') || name.toLowerCase().includes('cyber')) {
      return '#ff00ff'
    }
    if (name.toLowerCase().includes('retro') || name.toLowerCase().includes('wave')) {
      return '#8b00ff'
    }
    if (name.toLowerCase().includes('digital') || name.toLowerCase().includes('mesh')) {
      return '#00ffff'
    }
    if (name.toLowerCase().includes('quantum')) {
      return '#00ff00'
    }
    return '#ff1493'
  }

  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
        color="#00ffff"
      />
      <spotLight
        position={[-10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={0.5}
        color="#ff00ff"
      />
      
      <ProductModel color={getModelColor(productName)} />
      
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
      />
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <div className="loading-dots mb-4">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p className="text-neon-cyan font-cyber text-sm">Loading 3D Model...</p>
      </div>
    </div>
  )
}

export default function Model3DViewer({ modelPath, productName, className = '' }: Model3DViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-700 ${className}`}
    >
      {/* 3D Canvas */}
      <div className="w-full h-full min-h-[400px]">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          onCreated={() => setIsLoading(false)}
        >
          <Suspense fallback={null}>
            <Scene productName={productName} />
          </Suspense>
        </Canvas>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <LoadingFallback />
        </div>
      )}

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
        <p className="text-xs text-gray-300 font-cyber">
          🖱️ Drag to rotate • 🔍 Scroll to zoom
        </p>
      </div>

      {/* Model info */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
        <p className="text-xs text-neon-cyan font-cyber font-bold">
          3D MODEL
        </p>
      </div>

      {/* Neon border effect */}
      <div className="absolute inset-0 rounded-xl border border-neon-cyan opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Corner decorations */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-neon-cyan opacity-50"></div>
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-neon-pink opacity-50"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-neon-green opacity-50"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-neon-orange opacity-50"></div>
    </motion.div>
  )
}