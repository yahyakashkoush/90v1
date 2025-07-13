'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'

export default function AITryOnSection() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

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
    if (!uploadedImage) return
    
    setIsProcessing(true)
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false)
      // In real implementation, this would show the result
    }, 3000)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-retro-purple/20 to-retro-dark">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-green mb-4">
            AI VIRTUAL TRY-ON
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto font-cyber">
            Experience the future of fashion with our cutting-edge AI technology. 
            Upload your photo and see how our clothes look on you instantly.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-cyber font-bold text-neon-cyan mb-6">
              Upload Your Photo
            </h3>

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
                  <div className="relative w-48 h-64 mx-auto rounded-lg overflow-hidden">
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
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="font-cyber text-neon-cyan mb-3">Photo Requirements:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Stand straight facing the camera</li>
                <li>• Good lighting and clear image</li>
                <li>• Full body or upper body visible</li>
                <li>• Minimal background clutter</li>
              </ul>
            </div>

            {/* Try-On Button */}
            {uploadedImage && (
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
                    Processing...
                  </div>
                ) : (
                  'Start AI Try-On'
                )}
              </motion.button>
            )}
          </motion.div>

          {/* Demo/Features Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-cyber font-bold text-neon-green mb-6">
              AI-Powered Features
            </h3>

            {/* Feature Cards */}
            <div className="space-y-4">
              {[
                {
                  icon: '🎯',
                  title: 'Perfect Fit Detection',
                  description: 'AI analyzes your body shape for accurate sizing'
                },
                {
                  icon: '🌈',
                  title: 'Realistic Rendering',
                  description: 'Advanced algorithms ensure natural-looking results'
                },
                {
                  icon: '⚡',
                  title: 'Instant Results',
                  description: 'Get your virtual try-on in seconds'
                },
                {
                  icon: '🔄',
                  title: 'Multiple Angles',
                  description: 'See how clothes look from different perspectives'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-neon-cyan transition-colors duration-300"
                >
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <h4 className="font-cyber text-white font-bold mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center pt-6">
              <Link
                href="/try-on"
                className="inline-block px-8 py-3 border-2 border-neon-green text-neon-green font-cyber font-bold uppercase tracking-wider rounded-lg hover:bg-neon-green hover:text-black transition-colors duration-300"
              >
                Explore Full Try-On Experience
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-700"
        >
          {[
            { number: '99.2%', label: 'Accuracy Rate' },
            { number: '<2s', label: 'Processing Time' },
            { number: '50K+', label: 'Happy Users' },
            { number: '24/7', label: 'AI Availability' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 font-cyber text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}