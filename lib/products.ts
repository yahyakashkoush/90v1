import { Product } from '@/types'

// Local storage key for products
const PRODUCTS_STORAGE_KEY = 'retro_fashion_products'

// Default products with real image URLs
const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Cyber Neon Jacket',
    description: 'Futuristic jacket with LED accents and holographic details. Perfect for the cyberpunk aesthetic.',
    price: 299,
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center'
    ],
    category: 'Outerwear',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Neon Pink', 'Cyber Blue', 'Electric Green'],
    inStock: true,
    featured: true,
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
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Product management functions
export class ProductManager {
  // Get all products
  static getProducts(): Product[] {
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
      console.error('Error loading products:', error)
    }
    
    // Initialize with default products
    this.saveProducts(defaultProducts)
    return defaultProducts
  }

  // Save products to localStorage
  static saveProducts(products: Product[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
    } catch (error) {
      console.error('Error saving products:', error)
    }
  }

  // Get product by ID
  static getProductById(id: string): Product | null {
    const products = this.getProducts()
    return products.find(p => p.id === id) || null
  }

  // Add new product
  static addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const products = this.getProducts()
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    products.unshift(newProduct)
    this.saveProducts(products)
    return newProduct
  }

  // Update product
  static updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Product | null {
    const products = this.getProducts()
    const index = products.findIndex(p => p.id === id)
    
    if (index === -1) return null
    
    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date()
    }
    
    this.saveProducts(products)
    return products[index]
  }

  // Delete product
  static deleteProduct(id: string): boolean {
    const products = this.getProducts()
    const filteredProducts = products.filter(p => p.id !== id)
    
    if (filteredProducts.length === products.length) return false
    
    this.saveProducts(filteredProducts)
    return true
  }

  // Get featured products
  static getFeaturedProducts(): Product[] {
    return this.getProducts().filter(p => p.featured)
  }

  // Get products by category
  static getProductsByCategory(category: string): Product[] {
    if (category === 'All') return this.getProducts()
    return this.getProducts().filter(p => p.category === category)
  }

  // Search products
  static searchProducts(query: string): Product[] {
    const products = this.getProducts()
    const lowercaseQuery = query.toLowerCase()
    
    return products.filter(p => 
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery) ||
      p.category.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Get product statistics
  static getStats() {
    const products = this.getProducts()
    return {
      totalProducts: products.length,
      featuredProducts: products.filter(p => p.featured).length,
      outOfStockProducts: products.filter(p => !p.inStock).length,
      categories: [...new Set(products.map(p => p.category))].length,
      averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length
    }
  }
}

// Image upload utility
export const uploadImage = async (file: File): Promise<string> => {
  // For demo purposes, we'll use a placeholder service
  // In production, you'd upload to Cloudinary, AWS S3, etc.
  
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      // In a real app, you'd upload the file and get back a URL
      // For now, we'll use the data URL
      resolve(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}

// Validate image URL
export const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url)
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/i) !== null
  } catch {
    return false
  }
}