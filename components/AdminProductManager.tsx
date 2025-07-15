'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Product } from '@/types'
import { AdminProductManager, uploadImage, isValidImageUrl, handleImageError } from '@/lib/products'

interface AdminProductManagerProps {
  onProductsChange?: () => void
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  hasNext: boolean
  hasPrev: boolean
}

export default function AdminProductManagerComponent({ onProductsChange }: AdminProductManagerProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  })

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [stockFilter, setStockFilter] = useState<boolean | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Outerwear',
    sizes: [] as string[],
    colors: [] as string[],
    images: [] as string[],
    inStock: true,
    featured: false
  })

  const categories = ['Outerwear', 'Hoodies', 'Tops', 'Bottoms', 'Footwear', 'Accessories']
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '7', '8', '9', '10', '11', '12', 'One Size']
  const availableColors = ['Neon Pink', 'Cyber Blue', 'Electric Green', 'Purple Haze', 'Sunset Orange', 'Midnight Black', 'Rainbow', 'Silver Chrome', 'Gold Prism', 'Void Black', 'Plasma White', 'Neon Fusion']

  // Load products with filters and pagination
  const loadProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: 12,
        ...(searchQuery && { search: searchQuery }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(stockFilter !== undefined && { inStock: stockFilter })
      }

      const result = await AdminProductManager.getProducts(params)
      setProducts(result.products)
      
      if (result.pagination) {
        setPagination(result.pagination)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
      toast.error('Failed to load products. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchQuery, categoryFilter, stockFilter])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1) // Reset to first page on search
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [categoryFilter, stockFilter])

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'Outerwear',
      sizes: [],
      colors: [],
      images: [],
      inStock: true,
      featured: false
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || formData.price <= 0) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.sizes.length === 0) {
      toast.error('Please select at least one size')
      return
    }

    if (formData.colors.length === 0) {
      toast.error('Please select at least one color')
      return
    }

    setIsSubmitting(true)
    
    try {
      if (editingProduct) {
        // Update existing product
        await AdminProductManager.updateProduct(editingProduct.id, formData)
        toast.success('Product updated successfully!')
        setEditingProduct(null)
      } else {
        // Add new product
        await AdminProductManager.createProduct(formData)
        toast.success('Product created successfully!')
        setIsAddingProduct(false)
      }

      resetForm()
      await loadProducts()
      onProductsChange?.()
    } catch (error) {
      console.error('Failed to save product:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save product')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    try {
      await AdminProductManager.deleteProduct(id)
      toast.success('Product deleted successfully!')
      await loadProducts()
      onProductsChange?.()
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete product')
    }
  }

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      images: product.images,
      inStock: product.inStock,
      featured: product.featured
    })
    setEditingProduct(product)
    setIsAddingProduct(true)
  }

  // Bulk operations
  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products first')
      return
    }

    const confirmMessage = action === 'delete' 
      ? `Are you sure you want to delete ${selectedProducts.length} products?`
      : `Are you sure you want to ${action} ${selectedProducts.length} products?`

    if (!confirm(confirmMessage)) {
      return
    }

    try {
      await AdminProductManager.bulkOperation(action, selectedProducts)
      toast.success(`Bulk ${action} completed successfully!`)
      setSelectedProducts([])
      await loadProducts()
      onProductsChange?.()
    } catch (error) {
      console.error('Bulk operation failed:', error)
      toast.error(error instanceof Error ? error.message : 'Bulk operation failed')
    }
  }

  // Product selection
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const selectAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(p => p.id))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const uploadPromises = Array.from(files).map(async (file) => {
      if (file.type.startsWith('image/')) {
        try {
          return await uploadImage(file)
        } catch (error) {
          console.error('Failed to upload image:', error)
          toast.error(`Failed to upload ${file.name}`)
          return null
        }
      }
      return null
    })

    const uploadedImages = await Promise.all(uploadPromises)
    const validImages = uploadedImages.filter(Boolean) as string[]

    if (validImages.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...validImages]
      }))
      toast.success(`${validImages.length} image(s) uploaded successfully`)
    }
  }

  const handleImageUrlAdd = () => {
    const url = prompt('Enter image URL:')
    if (url && isValidImageUrl(url)) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }))
      toast.success('Image URL added successfully')
    } else if (url) {
      toast.error('Please enter a valid image URL')
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const toggleColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-2xl font-cyber text-neon-cyan mb-4">Loading Products...</div>
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-cyber font-bold text-neon-cyan">PRODUCT MANAGEMENT</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddingProduct(true)}
              className="px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold rounded-lg hover:scale-105 transition-transform duration-300"
            >
              ADD PRODUCT
            </button>
            {selectedProducts.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('feature')}
                  className="px-4 py-2 bg-neon-green text-black font-cyber text-sm rounded hover:scale-105 transition-transform"
                >
                  FEATURE ({selectedProducts.length})
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-4 py-2 bg-red-500 text-white font-cyber text-sm rounded hover:scale-105 transition-transform"
                >
                  DELETE ({selectedProducts.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400"
          />
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select
            value={stockFilter === undefined ? '' : stockFilter.toString()}
            onChange={(e) => setStockFilter(e.target.value === '' ? undefined : e.target.value === 'true')}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value="">All Stock Status</option>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="selectAll"
              checked={selectedProducts.length === products.length && products.length > 0}
              onChange={selectAllProducts}
              className="w-4 h-4"
            />
            <label htmlFor="selectAll" className="text-sm text-gray-300 font-cyber">
              Select All
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm text-gray-400">
          <span>Total: {pagination.totalItems}</span>
          <span>Page: {pagination.currentPage} of {pagination.totalPages}</span>
          {selectedProducts.length > 0 && (
            <span className="text-neon-cyan">Selected: {selectedProducts.length}</span>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden"
          >
            {/* Selection checkbox */}
            <div className="absolute top-2 right-2 z-10">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={() => toggleProductSelection(product.id)}
                className="w-4 h-4"
              />
            </div>

            {/* Product Image */}
            <div className="relative aspect-[4/3]">
              {product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 flex items-center justify-center">
                  <div className="text-4xl text-neon-cyan/50">📷</div>
                </div>
              )}
              
              {/* Status badges */}
              <div className="absolute top-2 left-2 flex gap-2">
                {product.featured && (
                  <span className="px-2 py-1 bg-neon-pink text-black text-xs font-cyber font-bold rounded">
                    FEATURED
                  </span>
                )}
                {!product.inStock && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-cyber font-bold rounded">
                    OUT OF STOCK
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-cyber font-bold text-white text-lg">{product.name}</h3>
                <span className="text-neon-cyan font-cyber font-bold">${product.price}</span>
              </div>
              
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                <span>{product.category}</span>
                <span>{product.sizes.length} sizes</span>
                <span>{product.colors.length} colors</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 px-3 py-2 border border-neon-cyan text-neon-cyan font-cyber text-sm rounded hover:bg-neon-cyan hover:text-black transition-colors duration-300"
                >
                  EDIT
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 px-3 py-2 border border-red-500 text-red-500 font-cyber text-sm rounded hover:bg-red-500 hover:text-white transition-colors duration-300"
                >
                  DELETE
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          
          <span className="text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={!pagination.hasNext}
            className="px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {isAddingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-lg border border-gray-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-cyber font-bold text-neon-cyan">
                  {editingProduct ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddingProduct(false)
                    setEditingProduct(null)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-cyber text-gray-300 mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-cyber text-gray-300 mb-2">Price *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-cyber text-gray-300 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white h-24"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-cyber text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-cyber text-gray-300 mb-2">Images</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                      <button
                        type="button"
                        onClick={handleImageUrlAdd}
                        className="px-4 py-2 border border-neon-cyan text-neon-cyan rounded hover:bg-neon-cyan hover:text-black transition-colors"
                      >
                        Add URL
                      </button>
                    </div>
                    
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {formData.images.map((img, index) => (
                          <div key={index} className="relative aspect-square">
                            <Image
                              src={img}
                              alt={`Product image ${index + 1}`}
                              fill
                              className="object-cover rounded"
                              onError={handleImageError}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-cyber text-gray-300 mb-2">Sizes *</label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1 rounded text-sm font-cyber transition-colors ${
                          formData.sizes.includes(size)
                            ? 'bg-neon-cyan text-black'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-cyber text-gray-300 mb-2">Colors *</label>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => toggleColor(color)}
                        className={`px-3 py-1 rounded text-sm font-cyber transition-colors ${
                          formData.colors.includes(color)
                            ? 'bg-neon-pink text-black'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-cyber text-gray-300">In Stock</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-cyber text-gray-300">Featured</span>
                  </label>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold rounded-lg hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'SAVING...' : editingProduct ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingProduct(false)
                      setEditingProduct(null)
                      resetForm()
                    }}
                    className="px-6 py-3 border border-gray-600 text-gray-300 font-cyber rounded-lg hover:bg-gray-700 transition-colors duration-300"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}