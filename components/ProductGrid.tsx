'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { Product } from '@/types'
import { ProductManager } from '@/lib/products'

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(true)

  const categories = ['All', 'Outerwear', 'Hoodies', 'Tops', 'Bottoms', 'Footwear', 'Accessories']

  useEffect(() => {
    // Load real products from ProductManager
    const loadProducts = () => {
      try {
        const allProducts = ProductManager.getProducts()
        // Only show featured products on homepage
        const featuredProducts = allProducts.filter(product => product.featured && product.inStock)
        setProducts(featuredProducts)
        setFilteredProducts(featuredProducts)
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading products:', error)
        setProducts([])
        setFilteredProducts([])
        setIsLoading(false)
      }
    }

    // Initial load
    loadProducts()

    // Listen for product updates from admin
    const handleProductUpdate = () => {
      loadProducts()
    }

    window.addEventListener('productsUpdated', handleProductUpdate)
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductUpdate)
    }
  }, [])

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory))
    }
  }, [selectedCategory, products])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  if (isLoading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-retro-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan mb-4">
              LOADING COLLECTION
            </h2>
            <div className="flex justify-center">
              <div className="loading-dots">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-retro-dark to-retro-purple/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan mb-4">
            FEATURED COLLECTION
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto font-cyber">
            Discover our latest cyberpunk-inspired fashion pieces designed for the digital age
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 font-cyber text-sm uppercase tracking-wider rounded-lg transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-neon-pink to-neon-cyan text-black'
                  : 'border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* No products message */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-gray-400 font-cyber">
              No products found in this category
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}