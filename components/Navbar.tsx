'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import CartSidebar from './CartSidebar'
import { CartManager } from '@/lib/cart'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    const updateCartCount = () => {
      setCartItemCount(CartManager.getCartItemCount())
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('cartUpdated', updateCartCount)
    
    // Initial cart count
    updateCartCount()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'AI Try-On', href: '/try-on' },
    { name: 'Admin', href: '/admin' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-retro-dark/90 backdrop-blur-md border-b border-neon-cyan/30' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <span className="text-2xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan">
                RF
              </span>
              <div className="absolute inset-0 text-2xl font-cyber font-black text-neon-pink opacity-30 animate-pulse-neon">
                RF
              </div>
            </div>
            <span className="hidden sm:block text-lg font-cyber text-white">
              RetroFuture
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative group text-white hover:text-neon-cyan transition-colors duration-300"
              >
                <span className="font-cyber text-sm uppercase tracking-wider">
                  {item.name}
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-pink to-neon-cyan group-hover:w-full transition-all duration-300"></div>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white hover:text-neon-cyan transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4.01" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-pink text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>

            <Link
              href="/try-on"
              className="relative px-6 py-2 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold text-sm uppercase tracking-wider rounded-lg overflow-hidden group"
            >
              <span className="relative z-10">Try AI</span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center"
          >
            <span className={`block w-6 h-0.5 bg-neon-cyan transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-neon-cyan transition-all duration-300 mt-1 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-neon-cyan transition-all duration-300 mt-1 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-retro-dark/95 backdrop-blur-md border-t border-neon-cyan/30"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-white hover:text-neon-cyan transition-colors duration-300 font-cyber text-sm uppercase tracking-wider"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/try-on"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold text-sm uppercase tracking-wider rounded-lg mt-4"
              >
                Try AI
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </motion.nav>
  )
}