'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CartManager, CartItemWithProduct } from '@/lib/cart'

interface CheckoutForm {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  paymentMethod: 'card' | 'paypal' | 'apple_pay'
  cardNumber: string
  expiryDate: string
  cvv: string
  cardName: string
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([])
  const [cartSummary, setCartSummary] = useState({
    totalItems: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CheckoutForm>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })

  useEffect(() => {
    loadCart()
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
    setIsLoading(false)
  }

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.email && formData.firstName && formData.lastName)
      case 2:
        return !!(formData.address && formData.city && formData.state && formData.zipCode)
      case 3:
        if (formData.paymentMethod === 'card') {
          return !!(formData.cardNumber && formData.expiryDate && formData.cvv && formData.cardName)
        }
        return true
      default:
        return false
    }
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Clear cart after successful payment
      CartManager.clearCart()
      
      // Redirect to success page
      alert('Order placed successfully!')
      window.location.href = '/'
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-retro-dark">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-4xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan mb-4">
              LOADING CHECKOUT
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-retro-dark">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-4xl font-cyber font-black text-red-400 mb-4">
              CART IS EMPTY
            </h2>
            <p className="text-gray-400 mb-8">Add some items to your cart before checkout</p>
            <Link
              href="/products"
              className="px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold rounded-lg hover:scale-105 transition-transform duration-300"
            >
              Continue Shopping
            </Link>
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
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-retro-dark to-retro-purple/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan mb-4">
                SECURE CHECKOUT
              </h1>
              <p className="text-gray-400 font-cyber">
                Complete your order with our secure payment system
              </p>
            </motion.div>
          </div>
        </section>

        {/* Progress Steps */}
        <section className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-8">
              {[
                { step: 1, title: 'Contact Info' },
                { step: 2, title: 'Shipping' },
                { step: 3, title: 'Payment' }
              ].map((item, index) => (
                <div key={item.step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-cyber font-bold ${
                    currentStep >= item.step
                      ? 'bg-gradient-to-r from-neon-pink to-neon-cyan text-black'
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {item.step}
                  </div>
                  <span className={`ml-2 font-cyber text-sm ${
                    currentStep >= item.step ? 'text-neon-cyan' : 'text-gray-400'
                  }`}>
                    {item.title}
                  </span>
                  {index < 2 && (
                    <div className={`w-16 h-0.5 ml-4 ${
                      currentStep > item.step ? 'bg-neon-cyan' : 'bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Checkout Content */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
                >
                  {/* Step 1: Contact Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-cyber font-bold text-neon-cyan">
                        CONTACT INFORMATION
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-cyber text-gray-300 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-cyber text-gray-300 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-cyber text-gray-300 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                            placeholder="John"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-cyber text-gray-300 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                            placeholder="Doe"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Shipping Information */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-cyber font-bold text-neon-cyan">
                        SHIPPING ADDRESS
                      </h2>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-cyber text-gray-300 mb-2">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                            placeholder="123 Main Street"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-cyber text-gray-300 mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              value={formData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                              placeholder="New York"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-cyber text-gray-300 mb-2">
                              State *
                            </label>
                            <input
                              type="text"
                              value={formData.state}
                              onChange={(e) => handleInputChange('state', e.target.value)}
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                              placeholder="NY"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-cyber text-gray-300 mb-2">
                              ZIP Code *
                            </label>
                            <input
                              type="text"
                              value={formData.zipCode}
                              onChange={(e) => handleInputChange('zipCode', e.target.value)}
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                              placeholder="10001"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-cyber text-gray-300 mb-2">
                            Country *
                          </label>
                          <select
                            value={formData.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                          >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment Information */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-cyber font-bold text-neon-cyan">
                        PAYMENT METHOD
                      </h2>
                      
                      {/* Payment Method Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { id: 'card', name: 'Credit Card', icon: '💳' },
                          { id: 'paypal', name: 'PayPal', icon: '🅿️' },
                          { id: 'apple_pay', name: 'Apple Pay', icon: '🍎' }
                        ].map((method) => (
                          <button
                            key={method.id}
                            onClick={() => handleInputChange('paymentMethod', method.id as any)}
                            className={`p-4 rounded-lg border-2 transition-colors ${
                              formData.paymentMethod === method.id
                                ? 'border-neon-cyan bg-neon-cyan/10'
                                : 'border-gray-600 hover:border-gray-400'
                            }`}
                          >
                            <div className="text-2xl mb-2">{method.icon}</div>
                            <div className="font-cyber text-sm">{method.name}</div>
                          </button>
                        ))}
                      </div>

                      {/* Credit Card Form */}
                      {formData.paymentMethod === 'card' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-cyber text-gray-300 mb-2">
                              Card Number *
                            </label>
                            <input
                              type="text"
                              value={formData.cardNumber}
                              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                              placeholder="1234 5678 9012 3456"
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-cyber text-gray-300 mb-2">
                                Expiry Date *
                              </label>
                              <input
                                type="text"
                                value={formData.expiryDate}
                                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                                placeholder="MM/YY"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-cyber text-gray-300 mb-2">
                                CVV *
                              </label>
                              <input
                                type="text"
                                value={formData.cvv}
                                onChange={(e) => handleInputChange('cvv', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                                placeholder="123"
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-cyber text-gray-300 mb-2">
                              Cardholder Name *
                            </label>
                            <input
                              type="text"
                              value={formData.cardName}
                              onChange={(e) => handleInputChange('cardName', e.target.value)}
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                              placeholder="John Doe"
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t border-gray-700">
                    <button
                      onClick={handlePrevStep}
                      disabled={currentStep === 1}
                      className="px-6 py-3 border border-gray-600 text-gray-300 font-cyber rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {currentStep < 3 ? (
                      <button
                        onClick={handleNextStep}
                        disabled={!validateStep(currentStep)}
                        className="px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold rounded-lg hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next Step
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={!validateStep(3) || isProcessing}
                        className="px-6 py-3 bg-gradient-to-r from-neon-green to-neon-cyan text-black font-cyber font-bold rounded-lg hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <div className="flex items-center gap-2">
                            <div className="loading-dots scale-50">
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                            </div>
                            Processing...
                          </div>
                        ) : (
                          'Complete Order'
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 h-fit"
              >
                <h2 className="text-xl font-cyber font-bold text-neon-cyan mb-6">
                  ORDER SUMMARY
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item, index) => (
                    <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
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
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-cyber font-bold text-white text-sm truncate">
                          {item.product.name}
                        </h3>
                        <div className="text-xs text-gray-400 mb-1">
                          {item.size} • {item.color}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">Qty: {item.quantity}</span>
                          <span className="text-sm font-cyber font-bold text-neon-green">
                            ${item.subtotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="space-y-3 border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white">${cartSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping:</span>
                    <span className="text-white">
                      {cartSummary.shipping === 0 ? 'Free' : `$${cartSummary.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax:</span>
                    <span className="text-white">${cartSummary.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-cyber font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan border-t border-gray-700 pt-3">
                    <span>Total:</span>
                    <span>${cartSummary.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-neon-green">🔒</span>
                    <span className="font-cyber text-sm text-neon-green">Secure Checkout</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}