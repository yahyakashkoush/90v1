'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'

// Mock featured products for try-on
const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Cyber Neon Jacket',
    description: 'Futuristic jacket with LED accents',
    price: 299,
    images: ['/api/placeholder/400/500'],
    category: 'Outerwear',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Neon Pink', 'Cyber Blue'],
    inStock: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Retro Wave Hoodie',
    description: 'Vintage-inspired hoodie',
    price: 189,
    images: ['/api/placeholder/400/500'],
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Purple Haze', 'Sunset Orange'],
    inStock: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export default function TryOnPage() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        setUploadedImage(file)
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      }
    }
  })

  const handleTryOn = async () => {
    if (!uploadedImage || !selectedProduct) return
    
    setIsProcessing(true)
    
    try {
      const formData = new FormData()
      formData.append('userImage', uploadedImage)
      formData.append('productId', selectedProduct.id)
      formData.append('options', JSON.stringify({
        preserveFace: true,
        adjustFit: true,
        enhanceQuality: true
      }))

      // Mock API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setResult({
        success: true,
        resultImage: previewUrl, // Mock result
        confidence: 0.95,
        processingTime: 2.8
      })
    } catch (error) {
      console.error('Try-on failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-retro-dark">
      <Navbar />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-retro-dark to-retro-purple/20">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-green mb-4"
            >
              AI VIRTUAL TRY-ON
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-gray-300 max-w-3xl mx-auto"
            >
              Experience the future of fashion. Upload your photo and see how our clothes look on you with cutting-edge AI technology.
            </motion.p>
          </div>
        </section>

        {/* Try-On Interface */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Upload Section */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-cyber font-bold text-neon-cyan">
                  Step 1: Upload Your Photo
                </h2>

                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive 
                      ? 'border-neon-pink bg-neon-pink/10' 
                      : 'border-neon-cyan hover:border-neon-pink hover:bg-neon-cyan/5'
                  }`}
                >
                  <input {...getInputProps()} />
                  
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="relative w-64 h-80 mx-auto rounded-lg overflow-hidden">
                        <img
                          src={previewUrl}
                          alt="Uploaded preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-neon-cyan font-cyber">
                        Photo uploaded successfully!
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setUploadedImage(null)
                          setPreviewUrl(null)
                        }}
                        className="text-neon-pink hover:text-white transition-colors"
                      >
                        Remove photo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto text-neon-cyan">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-cyber text-white mb-2">
                          {isDragActive ? 'Drop your photo here' : 'Drag & drop your photo here'}
                        </p>
                        <p className="text-sm text-gray-400">
                          or click to browse (JPG, PNG, WebP)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Requirements */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h4 className="font-cyber text-neon-cyan mb-3">Photo Requirements:</h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-neon-green">✓</span>
                      Stand straight facing the camera
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-neon-green">✓</span>
                      Good lighting and clear image
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-neon-green">✓</span>
                      Full body or upper body visible
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-neon-green">✓</span>
                      Minimal background clutter
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Product Selection */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-cyber font-bold text-neon-cyan">
                  Step 2: Select Product
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featuredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`cursor-pointer rounded-lg border-2 transition-all duration-300 ${
                        selectedProduct?.id === product.id
                          ? 'border-neon-pink bg-neon-pink/10'
                          : 'border-gray-600 hover:border-neon-cyan'
                      }`}
                    >
                      <div className="p-4">
                        <div className="aspect-[4/5] bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 rounded-lg flex items-center justify-center mb-3">
                          <div className="text-4xl text-neon-cyan/50">👕</div>
                        </div>
                        <h3 className="font-cyber font-bold text-white mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">
                          {product.description}
                        </p>
                        <div className="text-lg font-cyber font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan">
                          ${product.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Try-On Button */}
                {uploadedImage && selectedProduct && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleTryOn}
                    disabled={isProcessing}
                    className="w-full py-4 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold text-lg uppercase tracking-wider rounded-lg hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="loading-dots scale-50">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                        Processing AI Try-On...
                      </div>
                    ) : (
                      'Start AI Try-On'
                    )}
                  </motion.button>
                )}
              </motion.div>
            </div>

            {/* Results Section */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mt-16 text-center"
              >
                <h2 className="text-3xl font-cyber font-bold text-neon-green mb-8">
                  TRY-ON RESULT
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div>
                    <h3 className="text-lg font-cyber text-neon-cyan mb-4">Original</h3>
                    <div className="aspect-[4/5] rounded-lg overflow-hidden">
                      <img
                        src={previewUrl!}
                        alt="Original"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-cyber text-neon-cyan mb-4">With {selectedProduct?.name}</h3>
                    <div className="aspect-[4/5] rounded-lg overflow-hidden">
                      <img
                        src={result.resultImage}
                        alt="Try-on result"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center gap-8 text-sm">
                  <div>
                    <span className="text-gray-400">Confidence: </span>
                    <span className="text-neon-green font-bold">
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Processing Time: </span>
                    <span className="text-neon-cyan font-bold">
                      {result.processingTime}s
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setResult(null)
                      setUploadedImage(null)
                      setPreviewUrl(null)
                      setSelectedProduct(null)
                    }}
                    className="px-6 py-3 border border-neon-cyan text-neon-cyan font-cyber font-bold rounded-lg hover:bg-neon-cyan hover:text-black transition-colors duration-300"
                  >
                    Try Another
                  </button>
                  
                  <button className="px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold rounded-lg hover:scale-105 transition-transform duration-300">
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-retro-purple/20 to-transparent">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-cyber font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-green mb-4">
                AI-POWERED FEATURES
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🎯',
                  title: 'Perfect Fit Detection',
                  description: 'AI analyzes your body shape for accurate sizing recommendations'
                },
                {
                  icon: '🌈',
                  title: 'Realistic Rendering',
                  description: 'Advanced algorithms ensure natural-looking results with proper lighting'
                },
                {
                  icon: '⚡',
                  title: 'Instant Results',
                  description: 'Get your virtual try-on in seconds with our optimized AI pipeline'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 bg-gray-800/30 rounded-lg border border-gray-700"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-cyber font-bold text-neon-cyan mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}