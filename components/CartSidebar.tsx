'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { CartManager, CartItemWithProduct } from '@/lib/cart'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([])
  const [cartSummary, setCartSummary] = useState({
    totalItems: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  })

  useEffect(() => {
    loadCart()
    
    const handleCartUpdate = () => loadCart()
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  const loadCart = () => {
    const summary = CartManager.getCartSummary()
    setCartItems(summary.items)
    setCartSummary({
      totalItems: summary.totalItems,
      subtotal: summary.subtotal,
      tax: summary.tax,
      shipping: summary.shipping,
      total: summary.total
    })
  }

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    CartManager.updateQuantity(productId, size, color, quantity)
    loadCart()
  }

  const removeItem = (productId: string, size: string, color: string) => {
    CartManager.removeFromCart(productId, size, color)
    loadCart()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-gray-700 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-cyber font-bold text-neon-cyan">
                SHOPPING CART ({cartSummary.totalItems})
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-400 font-cyber mb-4">Your cart is empty</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold rounded-lg hover:scale-105 transition-transform duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product.images.length > 0 ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              width={64}
                              height={80}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/api/placeholder/64/80'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 flex items-center justify-center">
                              <div className="text-lg text-neon-cyan/50">👕</div>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-cyber font-bold text-white text-sm mb-1 truncate">
                            {item.product.name}
                          </h3>
                          <div className="text-xs text-gray-400 mb-2">
                            {item.size} • {item.color}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-cyber font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan">
                              ${item.product.price}
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                                className="w-6 h-6 rounded border border-gray-600 text-gray-300 hover:border-neon-cyan hover:text-neon-cyan transition-colors text-xs"
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-sm font-cyber text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                                className="w-6 h-6 rounded border border-gray-600 text-gray-300 hover:border-neon-cyan hover:text-neon-cyan transition-colors text-xs"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          {/* Subtotal and Remove */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-sm font-cyber font-bold text-neon-green">
                              ${item.subtotal.toFixed(2)}
                            </div>
                            <button
                              onClick={() => removeItem(item.productId, item.size, item.color)}
                              className="text-xs text-red-400 hover:text-red-300 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-700 p-6 space-y-4">
                {/* Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal:</span>
                    <span>${cartSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax:</span>
                    <span>${cartSummary.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping:</span>
                    <span>{cartSummary.shipping === 0 ? 'Free' : `$${cartSummary.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-cyber font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan border-t border-gray-700 pt-2">
                    <span>Total:</span>
                    <span>${cartSummary.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="block w-full py-3 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold text-center rounded-lg hover:scale-105 transition-transform duration-300"
                  >
                    Checkout
                  </Link>
                  <button
                    onClick={onClose}
                    className="w-full py-3 border border-neon-cyan text-neon-cyan font-cyber font-bold rounded-lg hover:bg-neon-cyan hover:text-black transition-colors duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}