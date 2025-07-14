import { CartItem, Product } from '@/types'
import { ProductManager } from './products'

const CART_STORAGE_KEY = 'retro_fashion_cart'

export interface CartItemWithProduct extends CartItem {
  product: Product
  subtotal: number
}

export class CartManager {
  // Get cart items
  static getCartItems(): CartItem[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading cart:', error)
      return []
    }
  }

  // Save cart items
  static saveCartItems(items: CartItem[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      // Trigger storage event for other components
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.error('Error saving cart:', error)
    }
  }

  // Add item to cart
  static addToCart(productId: string, quantity: number, size: string, color: string): boolean {
    try {
      const items = this.getCartItems()
      const existingItemIndex = items.findIndex(
        item => item.productId === productId && item.size === size && item.color === color
      )

      if (existingItemIndex >= 0) {
        // Update existing item
        items[existingItemIndex].quantity += quantity
      } else {
        // Add new item
        items.push({ productId, quantity, size, color })
      }

      this.saveCartItems(items)
      return true
    } catch (error) {
      console.error('Error adding to cart:', error)
      return false
    }
  }

  // Update item quantity
  static updateQuantity(productId: string, size: string, color: string, quantity: number): boolean {
    try {
      const items = this.getCartItems()
      const itemIndex = items.findIndex(
        item => item.productId === productId && item.size === size && item.color === color
      )

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          items.splice(itemIndex, 1)
        } else {
          items[itemIndex].quantity = quantity
        }
        this.saveCartItems(items)
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating cart:', error)
      return false
    }
  }

  // Remove item from cart
  static removeFromCart(productId: string, size: string, color: string): boolean {
    try {
      const items = this.getCartItems()
      const filteredItems = items.filter(
        item => !(item.productId === productId && item.size === size && item.color === color)
      )
      
      this.saveCartItems(filteredItems)
      return true
    } catch (error) {
      console.error('Error removing from cart:', error)
      return false
    }
  }

  // Get cart items with product details
  static getCartItemsWithProducts(): CartItemWithProduct[] {
    const cartItems = this.getCartItems()
    const itemsWithProducts: CartItemWithProduct[] = []

    cartItems.forEach(item => {
      const product = ProductManager.getProductById(item.productId)
      if (product) {
        itemsWithProducts.push({
          ...item,
          product,
          subtotal: product.price * item.quantity
        })
      }
    })

    return itemsWithProducts
  }

  // Get cart summary
  static getCartSummary() {
    const items = this.getCartItemsWithProducts()
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
    const tax = subtotal * 0.1 // 10% tax
    const shipping = subtotal > 100 ? 0 : 15 // Free shipping over $100
    const total = subtotal + tax + shipping

    return {
      items,
      totalItems,
      subtotal,
      tax,
      shipping,
      total
    }
  }

  // Clear cart
  static clearCart(): void {
    this.saveCartItems([])
  }

  // Get cart item count
  static getCartItemCount(): number {
    const items = this.getCartItems()
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }
}