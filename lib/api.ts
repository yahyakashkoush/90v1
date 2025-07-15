/**
 * API Service Layer
 * Centralized API communication with proper error handling and caching
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { Product } from '@/types'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken')
        window.location.href = '/admin/login'
      }
    }
    
    // Log error for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
    })
    
    return Promise.reject(error)
  }
)

// API Response Types
interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Product API Service
export class ProductAPI {
  /**
   * Get all products with filtering and pagination
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
  }): Promise<PaginatedResponse<Product>> {
    try {
      const response = await apiClient.get('/products', { params })
      return {
        data: response.data.products || [],
        pagination: response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          hasNext: false,
          hasPrev: false,
        },
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      throw new Error('Failed to load products. Please try again.')
    }
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get('/products/featured')
      return response.data || []
    } catch (error) {
      console.error('Failed to fetch featured products:', error)
      return []
    }
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await apiClient.get(`/products/${id}`)
      return response.data || null
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error)
      return null
    }
  }

  /**
   * Search products
   */
  static async searchProducts(query: string, limit = 10): Promise<Product[]> {
    try {
      const response = await apiClient.get(`/products/search/${encodeURIComponent(query)}`, {
        params: { limit },
      })
      return response.data || []
    } catch (error) {
      console.error('Failed to search products:', error)
      return []
    }
  }

  /**
   * Get product categories
   */
  static async getCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get('/products/meta/categories')
      return response.data || []
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      return ['Outerwear', 'Hoodies', 'Tops', 'Bottoms', 'Footwear', 'Accessories']
    }
  }

  /**
   * Get price range
   */
  static async getPriceRange(): Promise<{ minPrice: number; maxPrice: number }> {
    try {
      const response = await apiClient.get('/products/meta/price-range')
      return response.data || { minPrice: 0, maxPrice: 1000 }
    } catch (error) {
      console.error('Failed to fetch price range:', error)
      return { minPrice: 0, maxPrice: 1000 }
    }
  }
}

// Admin API Service
export class AdminAPI {
  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<any> {
    try {
      const response = await apiClient.get('/admin/dashboard')
      return response.data || {}
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
      throw new Error('Failed to load dashboard data')
    }
  }

  /**
   * Get all products for admin
   */
  static async getAdminProducts(params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
    inStock?: boolean
  }): Promise<PaginatedResponse<Product>> {
    try {
      const response = await apiClient.get('/admin/products', { params })
      return {
        data: response.data.products || [],
        pagination: response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          hasNext: false,
          hasPrev: false,
        },
      }
    } catch (error) {
      console.error('Failed to fetch admin products:', error)
      throw new Error('Failed to load products')
    }
  }

  /**
   * Create new product
   */
  static async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const response = await apiClient.post('/admin/products', productData)
      return response.data.product
    } catch (error) {
      console.error('Failed to create product:', error)
      throw new Error(error.response?.data?.error || 'Failed to create product')
    }
  }

  /**
   * Update product
   */
  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const response = await apiClient.put(`/admin/products/${id}`, updates)
      return response.data.product
    } catch (error) {
      console.error('Failed to update product:', error)
      throw new Error(error.response?.data?.error || 'Failed to update product')
    }
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/products/${id}`)
    } catch (error) {
      console.error('Failed to delete product:', error)
      throw new Error(error.response?.data?.error || 'Failed to delete product')
    }
  }

  /**
   * Bulk operations on products
   */
  static async bulkOperation(action: string, productIds: string[], updates?: any): Promise<void> {
    try {
      await apiClient.post('/admin/products/bulk', {
        action,
        productIds,
        updates,
      })
    } catch (error) {
      console.error('Failed to perform bulk operation:', error)
      throw new Error(error.response?.data?.error || 'Failed to perform bulk operation')
    }
  }
}

// Image Upload Service
export class ImageAPI {
  /**
   * Upload image file
   */
  static async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await apiClient.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data.url
    } catch (error) {
      console.error('Failed to upload image:', error)
      throw new Error('Failed to upload image')
    }
  }

  /**
   * Validate image URL
   */
  static isValidImageUrl(url: string): boolean {
    try {
      new URL(url)
      return /\.(jpeg|jpg|gif|png|webp)$/i.test(url)
    } catch {
      return false
    }
  }

  /**
   * Get optimized image URL
   */
  static getOptimizedImageUrl(url: string, width?: number, height?: number): string {
    // If it's already an optimized URL or external URL, return as is
    if (url.includes('cloudinary') || url.includes('unsplash') || url.startsWith('http')) {
      return url
    }

    // For local images, add optimization parameters
    const params = new URLSearchParams()
    if (width) params.append('w', width.toString())
    if (height) params.append('h', height.toString())
    params.append('q', '80') // Quality

    return `${url}${params.toString() ? '?' + params.toString() : ''}`
  }
}

// Health Check Service
export class HealthAPI {
  /**
   * Check API health
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const response = await apiClient.get('/health')
      return response.data.status === 'OK'
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }
}

// Cache Management
class CacheManager {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  static set(key: string, data: any, ttlMinutes = 5): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    })
  }

  static get<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data as T
  }

  static clear(): void {
    this.cache.clear()
  }

  static delete(key: string): void {
    this.cache.delete(key)
  }
}

// Cached API calls for better performance
export class CachedAPI {
  /**
   * Get cached products or fetch from API
   */
  static async getProducts(params?: any): Promise<PaginatedResponse<Product>> {
    const cacheKey = `products_${JSON.stringify(params || {})}`
    const cached = CacheManager.get<PaginatedResponse<Product>>(cacheKey)
    
    if (cached) {
      return cached
    }

    const result = await ProductAPI.getProducts(params)
    CacheManager.set(cacheKey, result, 2) // Cache for 2 minutes
    return result
  }

  /**
   * Get cached featured products
   */
  static async getFeaturedProducts(): Promise<Product[]> {
    const cacheKey = 'featured_products'
    const cached = CacheManager.get<Product[]>(cacheKey)
    
    if (cached) {
      return cached
    }

    const result = await ProductAPI.getFeaturedProducts()
    CacheManager.set(cacheKey, result, 5) // Cache for 5 minutes
    return result
  }

  /**
   * Clear product cache
   */
  static clearProductCache(): void {
    // Clear all product-related cache entries
    const keys = Array.from(CacheManager['cache'].keys())
    keys.forEach(key => {
      if (key.includes('products') || key.includes('featured')) {
        CacheManager.delete(key)
      }
    })
  }
}

export { CacheManager }