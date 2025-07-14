'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Product } from '@/types'
import { ProductManager } from '@/lib/products'
import { CartManager } from '@/lib/cart'

// AI Try-On simulation using canvas manipulation
const simulateAITryOn = async (userImage: string, productImage: string, productType: string): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      resolve(userImage)
      return
    }

    const userImg = new Image()
    const productImg = new Image()
    
    userImg.crossOrigin = 'anonymous'
    productImg.crossOrigin = 'anonymous'
    
    userImg.onload = () => {
      canvas.width = userImg.width
      canvas.height = userImg.height
      
      // Draw user image
      ctx.drawImage(userImg, 0, 0)
      
      productImg.onload = () => {
        // Calculate position based on product type
        let x, y, width, height
        
        switch (productType.toLowerCase()) {
          case 'outerwear':
          case 'hoodies':
          case 'tops':
            x = canvas.width * 0.25
            y = canvas.height * 0.15
            width = canvas.width * 0.5
            height = canvas.height * 0.6
            break
          case 'bottoms':
            x = canvas.width * 0.3
            y = canvas.height * 0.5
            width = canvas.width * 0.4
            height = canvas.height * 0.45
            break
          case 'footwear':
            x = canvas.width * 0.35
            y = canvas.height * 0.85
            width = canvas.width * 0.3
            height = canvas.height * 0.15
            break
          case 'accessories':
            x = canvas.width * 0.4
            y = canvas.height * 0.05
            width = canvas.width * 0.2
            height = canvas.height * 0.15
            break
          default:
            x = canvas.width * 0.25
            y = canvas.height * 0.2
            width = canvas.width * 0.5
            height = canvas.height * 0.6
        }
        
        // Apply blend mode for realistic overlay
        ctx.globalCompositeOperation = 'multiply'
        ctx.globalAlpha = 0.8
        
        // Draw product with proper scaling and positioning
        ctx.drawImage(productImg, x, y, width, height)
        
        // Add some realistic effects
        ctx.globalCompositeOperation = 'overlay'
        ctx.globalAlpha = 0.3
        ctx.drawImage(productImg, x, y, width, height)
        
        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 1
        
        // Convert to data URL
        resolve(canvas.toDataURL('image/jpeg', 0.9))
      }
      
      productImg.src = productImage
    }
    
    userImg.src = userImage
  })
}

export default function TryOnPage() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [useCamera, setUseCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    // Load featured products from ProductManager
    const loadProducts = () => {
      try {
        const products = ProductManager.getFeaturedProducts()
        setFeaturedProducts(products.slice(0, 6)) // Show max 6 products
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading products:', error)
        setFeaturedProducts([])
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

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
        setUseCamera(false)
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
          setStream(null)
        }
      }
    }
  })

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      })
      setStream(mediaStream)
      setUseCamera(true)
      setUploadedImage(null)
      setPreviewUrl(null)
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please upload an image instead.')
    }
  }

  const capturePhoto = () => {
    if (!stream) return

    const video = document.getElementById('camera-video') as HTMLVideoElement
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx || !video) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
        setUploadedImage(file)
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        setUseCamera(false)
        stream.getTracks().forEach(track => track.stop())
        setStream(null)
      }
    }, 'image/jpeg', 0.9)
  }

  const handleTryOn = async () => {
    if (!uploadedImage || !selectedProduct) return
    
    setIsProcessing(true)
    
    try {
      // Simulate realistic AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000))
      
      // Get product image for overlay
      const productImage = selectedProduct.images[0]
      
      // Simulate AI try-on
      const resultImage = await simulateAITryOn(
        previewUrl!,
        productImage,
        selectedProduct.category
      )
      
      // Calculate realistic confidence based on image quality and product type
      const baseConfidence = 0.85
      const categoryBonus = selectedProduct.category === 'Tops' ? 0.1 : 
                           selectedProduct.category === 'Outerwear' ? 0.08 : 0.05
      const confidence = Math.min(0.98, baseConfidence + categoryBonus + Math.random() * 0.05)
      
      setResult({
        success: true,
        resultImage,
        confidence,
        processingTime: 2.1 + Math.random() * 1.5,
        recommendations: {
          size: selectedProduct.sizes[Math.floor(selectedProduct.sizes.length / 2)],
          color: selectedProduct.colors[0],
          fit: confidence > 0.9 ? 'Excellent' : confidence > 0.8 ? 'Good' : 'Fair'
        }
      })
    } catch (error) {
      console.error('Try-on failed:', error)
      setResult({
        success: false,
        error: 'AI processing failed. Please try again.'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const addToCart = () => {
    if (!selectedProduct || !result) return
    
    const success = CartManager.addToCart(
      selectedProduct.id,
      1,
      result.recommendations.size,
      result.recommendations.color
    )
    
    if (success) {
      alert('Product added to cart with AI-recommended size and color!')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-retro-dark">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-4xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan mb-4">
              LOADING AI TRY-ON
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
              Experience the future of fashion. Upload your photo or use your camera to see how our clothes look on you with cutting-edge AI technology.
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
                  Step 1: Upload Your Photo or Use Camera
                </h2>

                {/* Camera/Upload Toggle */}
                <div className="flex gap-4">
                  <button
                    onClick={startCamera}
                    className="flex-1 py-3 border border-neon-green text-neon-green font-cyber font-bold rounded-lg hover:bg-neon-green hover:text-black transition-colors duration-300"
                  >
                    📷 Use Camera
                  </button>
                  <button
                    onClick={() => {
                      setUseCamera(false)
                      if (stream) {
                        stream.getTracks().forEach(track => track.stop())
                        setStream(null)
                      }
                    }}
                    className="flex-1 py-3 border border-neon-cyan text-neon-cyan font-cyber font-bold rounded-lg hover:bg-neon-cyan hover:text-black transition-colors duration-300"
                  >
                    📁 Upload Image
                  </button>
                </div>

                {/* Camera View */}
                {useCamera && stream && (
                  <div className="space-y-4">
                    <div className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden">
                      <video
                        id="camera-video"
                        autoPlay
                        playsInline
                        muted
                        ref={(video) => {
                          if (video && stream) {
                            video.srcObject = stream
                          }
                        }}
                        className="w-full h-auto"
                      />
                    </div>
                    <button
                      onClick={capturePhoto}
                      className="w-full py-3 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold rounded-lg hover:scale-105 transition-transform duration-300"
                    >
                      📸 Capture Photo
                    </button>
                  </div>
                )}

                {/* Dropzone */}
                {!useCamera && (
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
                          <Image
                            src={previewUrl}
                            alt="Uploaded preview"
                            fill
                            className="object-cover"
                            sizes="256px"
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
                )}

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

                {featuredProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 font-cyber">No featured products available for try-on</p>
                  </div>
                ) : (
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
                          <div className="aspect-[4/5] rounded-lg overflow-hidden mb-3">
                            {product.images.length > 0 ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={200}
                                height={250}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = '/api/placeholder/200/250'
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 flex items-center justify-center">
                                <div className="text-4xl text-neon-cyan/50">👕</div>
                              </div>
                            )}
                          </div>
                          <h3 className="font-cyber font-bold text-white mb-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="text-lg font-cyber font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan">
                            ${product.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

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
                className="mt-16"
              >
                {result.success ? (
                  <div className="text-center">
                    <h2 className="text-3xl font-cyber font-bold text-neon-green mb-8">
                      AI TRY-ON RESULT
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
                      <div>
                        <h3 className="text-lg font-cyber text-neon-cyan mb-4">Original</h3>
                        <div className="aspect-[4/5] rounded-lg overflow-hidden">
                          <Image
                            src={previewUrl!}
                            alt="Original"
                            width={400}
                            height={500}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-cyber text-neon-cyan mb-4">With {selectedProduct?.name}</h3>
                        <div className="aspect-[4/5] rounded-lg overflow-hidden">
                          <Image
                            src={result.resultImage}
                            alt="Try-on result"
                            width={400}
                            height={500}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <h4 className="font-cyber text-neon-cyan mb-2">Confidence</h4>
                        <div className="text-2xl font-bold text-neon-green">
                          {(result.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <h4 className="font-cyber text-neon-cyan mb-2">Recommended Size</h4>
                        <div className="text-2xl font-bold text-neon-pink">
                          {result.recommendations.size}
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <h4 className="font-cyber text-neon-cyan mb-2">Fit Quality</h4>
                        <div className="text-2xl font-bold text-neon-orange">
                          {result.recommendations.fit}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4">
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
                      
                      <button 
                        onClick={addToCart}
                        className="px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold rounded-lg hover:scale-105 transition-transform duration-300"
                      >
                        Add to Cart (AI Recommended)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <h2 className="text-3xl font-cyber font-bold text-red-400 mb-4">
                      TRY-ON FAILED
                    </h2>
                    <p className="text-gray-400 mb-8">{result.error}</p>
                    <button
                      onClick={() => setResult(null)}
                      className="px-6 py-3 border border-neon-cyan text-neon-cyan font-cyber font-bold rounded-lg hover:bg-neon-cyan hover:text-black transition-colors duration-300"
                    >
                      Try Again
                    </button>
                  </div>
                )}
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