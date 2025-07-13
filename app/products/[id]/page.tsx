'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Model3DViewer from '@/components/Model3DViewer'
import { Product } from '@/types'

// Mock product data
const mockProduct: Product = {
  id: '1',
  name: 'Cyber Neon Jacket',
  description: 'Step into the future with our signature Cyber Neon Jacket. This revolutionary piece combines cutting-edge LED technology with premium materials to create a garment that\'s both functional and visually stunning. Perfect for the modern cyberpunk enthusiast.',
  price: 299,
  images: ['/api/placeholder/600/800', '/api/placeholder/600/800', '/api/placeholder/600/800'],
  category: 'Outerwear',
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  colors: ['Neon Pink', 'Cyber Blue', 'Electric Green', 'Plasma Purple'],
  inStock: true,
  featured: true,
  model3D: '/models/cyber-jacket.glb',
  createdAt: new Date(),
  updatedAt: new Date()
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [showModel3D, setShowModel3D] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProduct(mockProduct)
      setSelectedColor(mockProduct.colors[0])
      setSelectedSize(mockProduct.sizes[2]) // Default to 'L'
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-retro-dark">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-4xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan mb-4">
              LOADING PRODUCT
            </h2>
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-retro-dark">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-4xl font-cyber font-black text-red-400 mb-4">
              PRODUCT NOT FOUND
            </h2>
            <Link
              href="/products"
              className="px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold rounded-lg hover:scale-105 transition-transform duration-300"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-retro-dark">
      <Navbar />
      
      <main className="pt-20">
        {/* Breadcrumb */}
        <section className="py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-neon-cyan transition-colors">
                Home
              </Link>
              <span className="text-gray-600">/</span>
              <Link href="/products" className="text-gray-400 hover:text-neon-cyan transition-colors">
                Products
              </Link>
              <span className="text-gray-600">/</span>
              <span className="text-neon-cyan">{product.name}</span>
            </nav>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Images and 3D Model */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                {/* Main Image/3D Toggle */}
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
                  {showModel3D ? (
                    <Model3DViewer
                      modelPath={product.model3D}
                      productName={product.name}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 flex items-center justify-center">
                      <div className="text-8xl text-neon-cyan/50">👕</div>
                    </div>
                  )}
                  
                  {/* 3D Toggle Button */}
                  <button
                    onClick={() => setShowModel3D(!showModel3D)}
                    className="absolute top-4 right-4 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg text-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors duration-300 font-cyber font-bold text-sm"
                  >
                    {showModel3D ? '2D VIEW' : '3D VIEW'}
                  </button>
                </div>

                {/* Thumbnail Images */}
                <div className="flex gap-4 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImage(index)
                        setShowModel3D(false)
                      }}
                      className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index && !showModel3D
                          ? 'border-neon-cyan'
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 flex items-center justify-center">
                        <div className="text-2xl text-neon-cyan/50">👕</div>
                      </div>
                    </button>
                  ))}
                  
                  {/* 3D Model Thumbnail */}
                  <button
                    onClick={() => setShowModel3D(true)}
                    className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                      showModel3D
                        ? 'border-neon-cyan'
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-neon-purple/20 to-neon-green/20 flex items-center justify-center">
                      <div className="text-lg text-neon-green">3D</div>
                    </div>
                  </button>
                </div>
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                {/* Header */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-neon-pink to-neon-cyan text-black text-xs font-cyber font-bold rounded-full">
                      {product.category}
                    </span>
                    {product.featured && (
                      <span className="px-3 py-1 bg-neon-green text-black text-xs font-cyber font-bold rounded-full">
                        FEATURED
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-4xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan mb-4">
                    {product.name}
                  </h1>
                  
                  <div className="text-3xl font-cyber font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-green mb-6">
                    ${product.price}
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Color Selection */}
                <div>
                  <h3 className="font-cyber text-neon-cyan font-bold mb-4">COLOR</h3>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors font-cyber text-sm ${
                          selectedColor === color
                            ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                            : 'border-gray-600 text-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <h3 className="font-cyber text-neon-cyan font-bold mb-4">SIZE</h3>
                  <div className="flex gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-lg border-2 transition-colors font-cyber font-bold ${
                          selectedSize === size
                            ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                            : 'border-gray-600 text-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <h3 className="font-cyber text-neon-cyan font-bold mb-4">QUANTITY</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-600 text-gray-300 hover:border-neon-cyan hover:text-neon-cyan transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-cyber font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-gray-600 text-gray-300 hover:border-neon-cyan hover:text-neon-cyan transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <button className="w-full py-4 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold text-lg uppercase tracking-wider rounded-lg hover:scale-105 transition-transform duration-300">
                    Add to Cart
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      href={`/products/${product.id}/try-on`}
                      className="py-3 border-2 border-neon-green text-neon-green font-cyber font-bold text-center rounded-lg hover:bg-neon-green hover:text-black transition-colors duration-300"
                    >
                      Try AI Fitting
                    </Link>
                    
                    <button className="py-3 border-2 border-neon-purple text-neon-purple font-cyber font-bold rounded-lg hover:bg-neon-purple hover:text-black transition-colors duration-300">
                      Add to Wishlist
                    </button>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="font-cyber text-neon-cyan font-bold mb-4">FEATURES</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="text-neon-green">✓</span>
                      LED accent lighting with app control
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-neon-green">✓</span>
                      Water-resistant nano coating
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-neon-green">✓</span>
                      Temperature regulating fabric
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-neon-green">✓</span>
                      Wireless charging pocket
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}