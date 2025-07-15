/**
 * Enhanced Product Management System
 * Integrates with backend API while maintaining fallback to localStorage
 */

import { Product } from '@/types'
import { ProductAPI, AdminAPI, ImageAPI, CachedAPI } from './api'

// Local storage key for offline fallback
const PRODUCTS_STORAGE_KEY = 'retro_fashion_products'
const OFFLINE_MODE_KEY = 'retro_fashion_offline_mode'

// Default products for fallback
const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Cyber Neon Jacket',
    description: 'Futuristic jacket with LED accents and holographic details. Perfect for the cyberpunk aesthetic.',
    price: 299,
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop&crop=center'
    ],
    category: 'Outerwear',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Neon Pink', 'Cyber Blue', 'Electric Green'],
    inStock: true,
    featured: true,
    model3D: '/models/cyber-jacket.glb',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Retro Wave Hoodie',
    description: 'Vintage-inspired hoodie with synthwave graphics and comfortable fit.',
    price: 189,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop&crop=center'
    ],
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Purple Haze', 'Sunset Orange', 'Midnight Black'],
    inStock: true,
    featured: true,
    model3D: '/models/retro-hoodie.glb',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Holographic Pants',
    description: 'Iridescent pants that shift colors in different lighting conditions.',
    price: 249,
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop&crop=center'
    ],
    category: 'Bottoms',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Rainbow', 'Silver Chrome', 'Gold Prism'],
    inStock: true,
    featured: false,
    model3D: '/models/holographic-pants.glb',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Digital Mesh Top',
    description: 'Transparent mesh top with embedded fiber optics for a futuristic look.',
    price: 159,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop&crop=center'
    ],
    category: 'Tops',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Neon Blue', 'Electric Pink', 'Laser Green'],
    inStock: true,
    featured: true,
    model3D: '/models/digital-mesh.glb',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'Quantum Sneakers',
    description: 'Self-lacing sneakers with reactive LED soles and smart technology.',
    price: 399,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=500&fit=crop&crop=center'
    ],
    category: 'Footwear',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Void Black', 'Plasma White', 'Neon Fusion'],
    inStock: true,
    featured: true,
    model3D: '/models/quantum-sneakers.glb',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    name: 'Cyberpunk Visor',
    description: 'AR-enabled visor with heads-up display and advanced optics.',
    price: 599,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=500&fit=crop&crop=center'
    ],
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Chrome', 'Matte Black', 'Neon Accent'],
    inStock: false,
    featured: false,
    model3D: '/models/cyberpunk-visor.glb',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

/**
 * Enhanced Product Manager with API Integration
 * Automatically falls back to localStorage when API is unavailable
 */
export class ProductManager {
  private static isOfflineMode(): boolean {
    if (typeof window === 'undefined') return true
    return localStorage.getItem(OFFLINE_MODE_KEY) === 'true'
  }

  private static setOfflineMode(offline: boolean): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(OFFLINE_MODE_KEY, offline.toString())
  }

  /**
   * Get all products with pagination and filtering
   */
  static async getProducts(params?: {
    page?: number
    limit?: number
    category?: string
    minPrice?: number
    maxPrice?: number
    featured?: boolean
    inStock?: boolean
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{ products: Product[]; pagination?: any }> {
    try {
      // Try API first
      if (!this.isOfflineMode()) {
        const result = await CachedAPI.getProducts(params)
        return { products: result.data, pagination: result.pagination }
      }
    } catch (error) {
      console.warn('API unavailable, falling back to localStorage:', error)
      this.setOfflineMode(true)
    }

    // Fallback to localStorage
    return { products: this.getLocalProducts(), pagination: null }
  }

  /**
   * Get products from localStorage (fallback)
   */
  static getLocalProducts(): Product[] {
    if (typeof window === 'undefined') return defaultProducts
    
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY)
      if (stored) {
        const products = JSON.parse(stored)
        return products.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt)
        }))
      }
    } catch (error) {
      console.error('Error loading products from localStorage:', error)
    }
    
    // Initialize with default products
    this.saveLocalProducts(defaultProducts)
    return defaultProducts
  }

  /**
   * Save products to localStorage
   */
  static saveLocalProducts(products: Product[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
      // Trigger event for components to update
      window.dispatchEvent(new Event('productsUpdated'))
    } catch (error) {
      console.error('Error saving products to localStorage:', error)
    }
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(): Promise<Product[]> {
    try {
      if (!this.isOfflineMode()) {
        return await CachedAPI.getFeaturedProducts()
      }
    } catch (error) {
      console.warn('API unavailable for featured products, using localStorage')
      this.setOfflineMode(true)
    }

    // Fallback to localStorage
    return this.getLocalProducts().filter(p => p.featured && p.inStock)
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: string): Promise<Product | null> {
    try {
      if (!this.isOfflineMode()) {
        return await ProductAPI.getProductById(id)
      }
    } catch (error) {
      console.warn('API unavailable for product by ID, using localStorage')
      this.setOfflineMode(true)
    }

    // Fallback to localStorage
    const products = this.getLocalProducts()
    return products.find(p => p.id === id) || null
  }

  /**
   * Search products
   */
  static async searchProducts(query: string): Promise<Product[]> {
    try {
      if (!this.isOfflineMode()) {
        return await ProductAPI.searchProducts(query)
      }
    } catch (error) {
      console.warn('API unavailable for search, using localStorage')
      this.setOfflineMode(true)
    }

    // Fallback to localStorage search
    const products = this.getLocalProducts()
    const lowercaseQuery = query.toLowerCase()
    
    return products.filter(p => 
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery) ||
      p.category.toLowerCase().includes(lowercaseQuery)
    )
  }

  /**
   * Get product statistics
   */
  static async getStats(): Promise<any> {
    try {
      if (!this.isOfflineMode()) {
        const dashboardData = await AdminAPI.getDashboardStats()
        return dashboardData.stats || {}
      }
    } catch (error) {
      console.warn('API unavailable for stats, calculating from localStorage')
      this.setOfflineMode(true)
    }

    // Fallback to localStorage calculation
    const products = this.getLocalProducts()
    return {
      totalProducts: products.length,
      featuredProducts: products.filter(p => p.featured).length,
      outOfStockProducts: products.filter(p => !p.inStock).length,
      categories: [...new Set(products.map(p => p.category))].length,
      averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length
    }
  }

  /**
   * Force refresh from API
   */
  static async refreshFromAPI(): Promise<void> {
    try {
      this.setOfflineMode(false)
      CachedAPI.clearProductCache()
      await this.getProducts()
    } catch (error) {
      console.error('Failed to refresh from API:', error)
      this.setOfflineMode(true)
    }
  }

  /**
   * Check if currently in offline mode
   */
  static isCurrentlyOffline(): boolean {
    return this.isOfflineMode()
  }
}

/**
 * Admin Product Manager with full CRUD operations and localStorage fallback
 */
export class AdminProductManager {
  /**
   * Get all products for admin with pagination
   */
  static async getProducts(params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
    inStock?: boolean
  }): Promise<{ products: Product[]; pagination?: any }> {
    try {
      // Try API first
      const result = await AdminAPI.getAdminProducts(params)
      return { products: result.data, pagination: result.pagination }
    } catch (error) {
      console.warn('Admin API unavailable, using localStorage fallback:', error)
      
      // Fallback to localStorage with filtering
      let products = ProductManager.getLocalProducts()
      
      // Apply filters
      if (params?.search) {
        const query = params.search.toLowerCase()
        products = products.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        )
      }
      
      if (params?.category) {
        products = products.filter(p => p.category === params.category)
      }
      
      if (params?.inStock !== undefined) {
        products = products.filter(p => p.inStock === params.inStock)
      }
      
      // Simple pagination
      const page = params?.page || 1
      const limit = params?.limit || 12
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedProducts = products.slice(startIndex, endIndex)
      
      return {
        products: paginatedProducts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(products.length / limit),
          totalItems: products.length,
          hasNext: endIndex < products.length,
          hasPrev: page > 1
        }
      }
    }
  }

  /**
   * Create new product with localStorage fallback
   */
  static async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      // Try API first
      const product = await AdminAPI.createProduct(productData)
      
      // Clear cache to ensure fresh data
      CachedAPI.clearProductCache()
      
      // Trigger update event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('productsUpdated'))
      }
      
      return product
    } catch (error) {
      console.warn('Admin API unavailable, using localStorage fallback:', error)
      
      // Fallback to localStorage
      const products = ProductManager.getLocalProducts()
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      products.unshift(newProduct)
      ProductManager.saveLocalProducts(products)
      
      return newProduct
    }
  }

  /**
   * Update existing product with localStorage fallback
   */
  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      // Try API first
      const product = await AdminAPI.updateProduct(id, updates)
      
      // Clear cache to ensure fresh data
      CachedAPI.clearProductCache()
      
      // Trigger update event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('productsUpdated'))
      }
      
      return product
    } catch (error) {
      console.warn('Admin API unavailable, using localStorage fallback:', error)
      
      // Fallback to localStorage
      const products = ProductManager.getLocalProducts()
      const index = products.findIndex(p => p.id === id)
      
      if (index === -1) {
        throw new Error('Product not found')
      }
      
      products[index] = {
        ...products[index],
        ...updates,
        updatedAt: new Date()
      }
      
      ProductManager.saveLocalProducts(products)
      return products[index]
    }
  }

  /**
   * Delete product with localStorage fallback
   */
  static async deleteProduct(id: string): Promise<void> {
    try {
      // Try API first
      await AdminAPI.deleteProduct(id)
      
      // Clear cache to ensure fresh data
      CachedAPI.clearProductCache()
      
      // Trigger update event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('productsUpdated'))
      }
    } catch (error) {
      console.warn('Admin API unavailable, using localStorage fallback:', error)
      
      // Fallback to localStorage
      const products = ProductManager.getLocalProducts()
      const filteredProducts = products.filter(p => p.id !== id)
      
      if (filteredProducts.length === products.length) {
        throw new Error('Product not found')
      }
      
      ProductManager.saveLocalProducts(filteredProducts)
    }
  }

  /**
   * Bulk operations with localStorage fallback
   */
  static async bulkOperation(action: string, productIds: string[], updates?: any): Promise<void> {
    try {
      // Try API first
      await AdminAPI.bulkOperation(action, productIds, updates)
      
      // Clear cache to ensure fresh data
      CachedAPI.clearProductCache()
      
      // Trigger update event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('productsUpdated'))
      }
    } catch (error) {
      console.warn('Admin API unavailable, using localStorage fallback:', error)
      
      // Fallback to localStorage
      const products = ProductManager.getLocalProducts()
      
      switch (action) {
        case 'delete':
          const filteredProducts = products.filter(p => !productIds.includes(p.id))
          ProductManager.saveLocalProducts(filteredProducts)
          break
          
        case 'feature':
        case 'unfeature':
          const updatedProducts = products.map(p => 
            productIds.includes(p.id) 
              ? { ...p, featured: action === 'feature', updatedAt: new Date() }
              : p
          )
          ProductManager.saveLocalProducts(updatedProducts)
          break
          
        case 'update':
          const modifiedProducts = products.map(p => 
            productIds.includes(p.id) 
              ? { ...p, ...updates, updatedAt: new Date() }
              : p
          )
          ProductManager.saveLocalProducts(modifiedProducts)
          break
          
        default:
          throw new Error(`Unsupported bulk action: ${action}`)
      }
    }
  }
}

/**
 * Enhanced image upload with proper error handling
 */
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file')
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('Image file is too large. Please select a file under 10MB.')
    }

    // Try API upload first
    try {
      return await ImageAPI.uploadImage(file)
    } catch (apiError) {
      console.warn('API upload failed, using fallback:', apiError)
    }

    // Fallback to data URL for offline mode
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target?.result as string)
      }
      reader.onerror = () => {
        reject(new Error('Failed to read image file'))
      }
      reader.readAsDataURL(file)
    })
  } catch (error) {
    console.error('Image upload failed:', error)
    throw error
  }
}

/**
 * Enhanced image URL validation
 */
export const isValidImageUrl = (url: string): boolean => {
  return ImageAPI.isValidImageUrl(url)
}

/**
 * Get optimized image URL
 */
export const getOptimizedImageUrl = (url: string, width?: number, height?: number): string => {
  return ImageAPI.getOptimizedImageUrl(url, width, height)
}

/**
 * Image error handler for React components
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.target as HTMLImageElement
  if (!target.src.includes('placeholder')) {
    target.src = '/api/placeholder/400/500'
  }
}