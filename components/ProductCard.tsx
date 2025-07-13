'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleImageHover = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-neon-cyan transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <div
          className="w-full h-full bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 flex items-center justify-center"
          onMouseEnter={handleImageHover}
        >
          <div className="text-6xl text-neon-cyan/50">👕</div>
        </div>
        
        {/* Overlay effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <Link
            href={`/products/${product.id}/try-on`}
            className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-neon-pink hover:bg-neon-pink hover:text-black transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Link>
        </div>

        {/* Stock status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-red-400 font-cyber text-lg font-bold">OUT OF STOCK</span>
          </div>
        )}

        {/* Featured badge */}
        {product.featured && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-gradient-to-r from-neon-pink to-neon-cyan text-black text-xs font-cyber font-bold rounded-full">
              FEATURED
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-2">
          <span className="text-xs text-neon-cyan font-cyber uppercase tracking-wider">
            {product.category}
          </span>
        </div>
        
        <h3 className="text-xl font-cyber font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors duration-300">
          {product.name}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Colors */}
        <div className="flex gap-2 mb-4">
          {product.colors.slice(0, 3).map((color, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded-full border-2 border-gray-600"
              style={{
                background: color.includes('Neon') || color.includes('Electric') 
                  ? `linear-gradient(45deg, #ff00ff, #00ffff)` 
                  : color.includes('Black') 
                  ? '#000000'
                  : color.includes('White')
                  ? '#ffffff'
                  : `linear-gradient(45deg, #ff6600, #ffd700)`
              }}
            />
          ))}
          {product.colors.length > 3 && (
            <span className="text-xs text-gray-400 self-center">
              +{product.colors.length - 3}
            </span>
          )}
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-cyber font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan">
            ${product.price}
          </div>
          
          <div className="flex gap-2">
            <Link
              href={`/products/${product.id}`}
              className="px-4 py-2 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold text-sm rounded-lg hover:scale-105 transition-transform duration-300"
            >
              VIEW
            </Link>
            
            {product.inStock && (
              <button className="px-4 py-2 border border-neon-cyan text-neon-cyan font-cyber font-bold text-sm rounded-lg hover:bg-neon-cyan hover:text-black transition-colors duration-300">
                ADD
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-xl border border-neon-cyan shadow-[0_0_20px_rgba(0,255,255,0.3)]" />
      </div>
    </motion.div>
  )
}