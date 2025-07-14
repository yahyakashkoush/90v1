'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Product } from '@/types'
import { ProductManager, uploadImage, isValidImageUrl } from '@/lib/products'

interface AdminProductManagerProps {
  onProductsChange?: () => void
}

export default function AdminProductManager({ onProductsChange }: AdminProductManagerProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    setIsLoading(true)
    setTimeout(() => {
      const loadedProducts = ProductManager.getProducts()
      setProducts(loadedProducts)
      setIsLoading(false)
    }, 500)
  }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || formData.price <= 0) {
      alert('Please fill in all required fields')
      return
    }

    if (editingProduct) {
      // Update existing product
      ProductManager.updateProduct(editingProduct.id, formData)
      setEditingProduct(null)
    } else {
      // Add new product
      ProductManager.addProduct(formData)
      setIsAddingProduct(false)
    }

    resetForm()
    loadProducts()
    onProductsChange?.()
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      ProductManager.deleteProduct(id)
      loadProducts()
      onProductsChange?.()
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith('image/')) {
        const imageUrl = await uploadImage(file)
        newImages.push(imageUrl)
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }))
  }

  const handleImageUrlAdd = () => {
    const url = prompt('Enter image URL:')
    if (url && isValidImageUrl(url)) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }))
    } else if (url) {
      alert('Please enter a valid image URL')
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-cyber font-bold text-neon-cyan">PRODUCT MANAGEMENT</h2>
        <button
          onClick={() => setIsAddingProduct(true)}
          className="px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold rounded-lg hover:scale-105 transition-transform duration-300"
        >
          ADD PRODUCT
        </button>
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
            {/* Product Image */}
            <div className="relative aspect-[4/3]">
              {product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/api/placeholder/400/300'
                  }}
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
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/api/placeholder/100/100'
                              }}
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
                  <label className="block text-sm font-cyber text-gray-300 mb-2">Sizes</label>
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
                  <label className="block text-sm font-cyber text-gray-300 mb-2">Colors</label>
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
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold rounded-lg hover:scale-105 transition-transform duration-300"
                  >
                    {editingProduct ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
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