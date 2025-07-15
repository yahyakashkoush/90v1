'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
import { Product } from '@/types'
import { ProductManager } from '@/lib/products'
import { ProductAPI } from '@/lib/api'

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  hasNext: boolean
  hasPrev: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState('newest')
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  })

  const [categories, setCategories] = useState(['All', 'Outerwear', 'Hoodies', 'Tops', 'Bottoms', 'Footwear', 'Accessories'])
  const [maxPrice, setMaxPrice] = useState(1000)

  // Load products with filters and pagination
  const loadProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: 12,
        ...(selectedCategory !== 'All' && { category: selectedCategory }),
        ...(priceRange[0] > 0 && { minPrice: priceRange[0] }),
        ...(priceRange[1] < maxPrice && { maxPrice: priceRange[1] }),
        ...(searchQuery && { search: searchQuery }),
        sortBy: sortBy === 'newest' ? 'createdAt' : 
               sortBy === 'price-low' ? 'price' :
               sortBy === 'price-high' ? 'price' : 'name',
        sortOrder: sortBy === 'price-high' ? 'desc' : 'asc'
      }

      const result = await ProductManager.getProducts(params)
      setProducts(result.products)
      
      if (result.pagination) {
        setPagination(result.pagination)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
      toast.error('Failed to load products. Please try again.')
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, selectedCategory, priceRange, sortBy, searchQuery, maxPrice])

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      // Load categories and price range
      const [categoriesData, priceRangeData] = await Promise.all([
        ProductAPI.getCategories(),
        ProductAPI.getPriceRange()
      ])

      setCategories(['All', ...categoriesData])
      setMaxPrice(priceRangeData.maxPrice)
      setPriceRange([priceRangeData.minPrice, priceRangeData.maxPrice])
    } catch (error) {
      console.warn('Failed to load metadata, using defaults:', error)
    }

    // Load products
    loadProducts()
  }

  // Reload products when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1) // Reset to first page when filters change
    }, 300)

    return () => clearTimeout(timer)
  }, [selectedCategory, priceRange, sortBy, searchQuery])

  // Load products when page changes
  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  // Handle search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        loadProducts()
      } else {
        setCurrentPage(1)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handlePriceRangeChange = (newRange: number[]) => {
    setPriceRange(newRange)
  }

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-retro-dark">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-4xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan mb-4">
              LOADING PRODUCTS
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
              className="text-4xl sm:text-5xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan mb-4"
            >
              ALL PRODUCTS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              Discover our complete collection of cyberpunk-inspired fashion
            </motion.p>
          </div>
        </section>

        {/* Search Bar */}
        <section className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-md mx-auto"
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none transition-colors"
              />
            </motion.div>
          </div>
        </section>

        {/* Filters and Products */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:w-64 space-y-6"
              >
                {/* Category Filter */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="font-cyber text-neon-cyan font-bold mb-4">CATEGORY</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                          selectedCategory === category
                            ? 'bg-neon-cyan text-black'
                            : 'text-gray-300 hover:text-neon-cyan'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="font-cyber text-neon-cyan font-bold mb-4">PRICE RANGE</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                        min="0"
                        max={maxPrice}
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value) || maxPrice])}
                        className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                        min="0"
                        max={maxPrice}
                      />
                    </div>
                    <div className="text-sm text-gray-400">
                      ${priceRange[0]} - ${priceRange[1]}
                    </div>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="font-cyber text-neon-cyan font-bold mb-4">SORT BY</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>

                {/* Quick Stats */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="font-cyber text-neon-green font-bold mb-4">STATS</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Products:</span>
                      <span className="text-neon-cyan">{pagination.totalItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Page:</span>
                      <span className="text-neon-cyan">{pagination.currentPage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Pages:</span>
                      <span className="text-neon-cyan">{pagination.totalPages}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Products Grid */}
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <p className="text-gray-400">
                    Showing {products.length} of {pagination.totalItems} products
                    {searchQuery && ` for "${searchQuery}"`}
                    {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                  </p>
                  
                  {isLoading && (
                    <div className="text-neon-cyan text-sm">Loading...</div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>

                {products.length === 0 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-xl text-gray-400 font-cyber mb-2">
                      No products found
                    </p>
                    <p className="text-gray-500">
                      Try adjusting your search criteria or filters
                    </p>
                    {(searchQuery || selectedCategory !== 'All') && (
                      <button
                        onClick={() => {
                          setSearchQuery('')
                          setSelectedCategory('All')
                          setPriceRange([0, maxPrice])
                        }}
                        className="mt-4 px-6 py-2 bg-neon-cyan text-black font-cyber rounded-lg hover:scale-105 transition-transform"
                      >
                        Clear Filters
                      </button>
                    )}
                  </motion.div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 flex justify-center items-center gap-4"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="px-6 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors font-cyber"
                    >
                      Previous
                    </button>
                    
                    <div className="flex gap-2">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const page = i + 1
                        const isActive = page === pagination.currentPage
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-12 h-12 rounded-lg font-cyber transition-colors ${
                              isActive
                                ? 'bg-gradient-to-r from-neon-pink to-neon-cyan text-black'
                                : 'bg-gray-800 border border-gray-600 text-white hover:bg-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="px-6 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors font-cyber"
                    >
                      Next
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}