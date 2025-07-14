'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Model3DViewer from '@/components/Model3DViewer'
import { Product } from '@/types'
import { ProductManager } from '@/lib/products'
import { CartManager } from '@/lib/cart'

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [showModel3D, setShowModel3D] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  useEffect(() => {
    const productId = params.id as string
    
    // Load product from ProductManager
    setTimeout(() => {
      const foundProduct = ProductManager.getProductById(productId)
      if (foundProduct) {
        setProduct(foundProduct)
        setSelectedColor(foundProduct.colors[0] || '')
        setSelectedSize(foundProduct.sizes[0] || '')
      }
      setIsLoading(false)
    }, 500)
  }, [params.id])

  const handleAddToCart = async () => {
    if (!product || !selectedSize || !selectedColor) return
    
    setIsAddingToCart(true)
    
    try {
      const success = CartManager.addToCart(product.id, quantity, selectedSize, selectedColor)
      if (success) {
        // Show success feedback
        alert('Product added to cart!')
      } else {
        alert('Failed to add product to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add product to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

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
                  ) : product.images.length > 0 ? (
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/api/placeholder/600/800'
                      }}
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
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={96}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/api/placeholder/80/96'
                        }}
                      />
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
                  <button 
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !selectedSize || !selectedColor || !product.inStock}
                    className="w-full py-4 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold text-lg uppercase tracking-wider rounded-lg hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingToCart ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="loading-dots scale-50">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                        Adding...
                      </div>
                    ) : !product.inStock ? (
                      'Out of Stock'
                    ) : (
                      'Add to Cart'
                    )}
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