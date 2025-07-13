export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  sizes: string[]
  colors: string[]
  inStock: boolean
  featured: boolean
  model3D?: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  isAdmin: boolean
  createdAt: Date
}

export interface TryOnResult {
  id: string
  userId: string
  productId: string
  originalImage: string
  resultImage: string
  confidence: number
  createdAt: Date
}

export interface CartItem {
  productId: string
  quantity: number
  size: string
  color: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface AITryOnRequest {
  userImage: File
  productId: string
  options?: {
    preserveFace?: boolean
    adjustFit?: boolean
    enhanceQuality?: boolean
  }
}

export interface AITryOnResponse {
  success: boolean
  resultImage?: string
  confidence?: number
  error?: string
  processingTime?: number
}