'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Footer() {
  const footerLinks = {
    'Shop': [
      { name: 'New Arrivals', href: '/products?filter=new' },
      { name: 'Best Sellers', href: '/products?filter=bestsellers' },
      { name: 'Sale', href: '/products?filter=sale' },
      { name: 'Gift Cards', href: '/gift-cards' }
    ],
    'Technology': [
      { name: 'AI Try-On', href: '/try-on' },
      { name: 'Virtual Fitting', href: '/virtual-fitting' },
      { name: 'Size Guide', href: '/size-guide' },
      { name: 'Tech Specs', href: '/tech-specs' }
    ],
    'Support': [
      { name: 'Help Center', href: '/help' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
      { name: 'Contact Us', href: '/contact' }
    ],
    'Company': [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Sustainability', href: '/sustainability' }
    ]
  }

  const socialLinks = [
    { name: 'Instagram', href: '#', icon: '📷' },
    { name: 'Twitter', href: '#', icon: '🐦' },
    { name: 'TikTok', href: '#', icon: '🎵' },
    { name: 'Discord', href: '#', icon: '💬' }
  ]

  return (
    <footer className="bg-gradient-to-t from-black to-retro-dark border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <div className="relative">
                  <span className="text-3xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan">
                    RF
                  </span>
                  <div className="absolute inset-0 text-3xl font-cyber font-black text-neon-pink opacity-30 animate-pulse-neon">
                    RF
                  </div>
                </div>
                <span className="text-xl font-cyber text-white">
                  RetroFuture
                </span>
              </Link>
              
              <p className="text-gray-400 mb-6 max-w-sm">
                Pioneering the future of fashion with AI-powered virtual try-on technology 
                and cyberpunk-inspired designs.
              </p>

              {/* Newsletter Signup */}
              <div className="space-y-3">
                <h4 className="font-cyber text-neon-cyan font-bold uppercase tracking-wider">
                  Stay Connected
                </h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none"
                  />
                  <button className="px-6 py-2 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold rounded-lg hover:scale-105 transition-transform duration-300">
                    JOIN
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-cyber text-neon-cyan font-bold uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-neon-cyan transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {socialLinks.map((social) => (
            <Link
              key={social.name}
              href={social.href}
              className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-xl hover:bg-gradient-to-r hover:from-neon-pink hover:to-neon-cyan hover:text-black transition-all duration-300 group"
            >
              <span className="group-hover:scale-110 transition-transform duration-300">
                {social.icon}
              </span>
            </Link>
          ))}
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2024 RetroFuture Fashion. All rights reserved.
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-neon-cyan transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-neon-cyan transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-neon-cyan transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-30"></div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none"></div>
    </footer>
  )
}