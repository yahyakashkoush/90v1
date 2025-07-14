'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import AdminProductManager from '@/components/AdminProductManager'
import { ProductManager } from '@/lib/products'

interface DashboardStats {
  totalProducts: number
  totalUsers: number
  totalRevenue: number
  totalOrders: number
  featuredProducts: number
  outOfStockProducts: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    featuredProducts: 0,
    outOfStockProducts: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = () => {
    // Load real stats from ProductManager
    const productStats = ProductManager.getStats()
    
    setTimeout(() => {
      setStats({
        totalProducts: productStats.totalProducts,
        totalUsers: 2847, // Mock data
        totalRevenue: 125000, // Mock data
        totalOrders: 3420, // Mock data
        featuredProducts: productStats.featuredProducts,
        outOfStockProducts: productStats.outOfStockProducts
      })
      setIsLoading(false)
    }, 1000)
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'products', name: 'Products', icon: '📦' },
    { id: 'orders', name: 'Orders', icon: '🛍️' },
    { id: 'analytics', name: 'Analytics', icon: '📈' }
  ]

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: '📦',
      color: 'from-neon-pink to-neon-cyan',
      change: '+12%'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'from-neon-cyan to-neon-green',
      change: '+8%'
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: '💰',
      color: 'from-neon-green to-neon-orange',
      change: '+15%'
    },
    {
      title: 'Orders',
      value: stats.totalOrders,
      icon: '🛍️',
      color: 'from-neon-orange to-neon-purple',
      change: '+23%'
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-retro-dark">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-4xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan mb-4">
              LOADING DASHBOARD
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
              className="flex justify-between items-center"
            >
              <div>
                <h1 className="text-4xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan mb-2">
                  ADMIN DASHBOARD
                </h1>
                <p className="text-gray-400 font-cyber">
                  Manage your RetroFuture Fashion empire
                </p>
              </div>
              
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-cyber font-bold rounded-lg hover:scale-105 transition-transform duration-300">
                  Add Product
                </button>
                <button className="px-6 py-3 border border-neon-cyan text-neon-cyan font-cyber font-bold rounded-lg hover:bg-neon-cyan hover:text-black transition-colors duration-300">
                  Export Data
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex space-x-1 bg-gray-800/30 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-cyber text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-neon-pink to-neon-cyan text-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Content */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-neon-cyan transition-colors duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{card.icon}</div>
                    <div className={`text-sm font-cyber px-2 py-1 rounded bg-gradient-to-r ${card.color} text-black`}>
                      {card.change}
                    </div>
                  </div>
                  
                  <div className={`text-3xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r ${card.color} mb-2`}>
                    {card.value}
                  </div>
                  
                  <div className="text-gray-400 font-cyber text-sm uppercase tracking-wider">
                    {card.title}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-2 bg-gray-800/50 rounded-lg p-6 border border-gray-700"
              >
                <h3 className="text-xl font-cyber font-bold text-neon-cyan mb-6">
                  RECENT ORDERS
                </h3>
                
                <div className="space-y-4">
                  {[
                    { id: '#3421', customer: 'Alex Chen', product: 'Cyber Neon Jacket', amount: '$299', status: 'Processing' },
                    { id: '#3420', customer: 'Sarah Kim', product: 'Retro Wave Hoodie', amount: '$189', status: 'Shipped' },
                    { id: '#3419', customer: 'Mike Johnson', product: 'Quantum Sneakers', amount: '$399', status: 'Delivered' },
                    { id: '#3418', customer: 'Emma Davis', product: 'Digital Mesh Top', amount: '$159', status: 'Processing' }
                  ].map((order, index) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-neon-pink to-neon-cyan rounded-full flex items-center justify-center text-black font-bold">
                          {order.customer.charAt(0)}
                        </div>
                        <div>
                          <div className="font-cyber text-white font-bold">{order.id}</div>
                          <div className="text-sm text-gray-400">{order.customer}</div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-white">{order.product}</div>
                        <div className="text-neon-cyan font-bold">{order.amount}</div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-cyber font-bold ${
                        order.status === 'Delivered' ? 'bg-neon-green text-black' :
                        order.status === 'Shipped' ? 'bg-neon-cyan text-black' :
                        'bg-neon-orange text-black'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-6"
              >
                {/* Top Products */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-cyber font-bold text-neon-green mb-4">
                    TOP PRODUCTS
                  </h3>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'Cyber Neon Jacket', sales: 245 },
                      { name: 'Retro Wave Hoodie', sales: 189 },
                      { name: 'Quantum Sneakers', sales: 156 }
                    ].map((product, index) => (
                      <div key={product.name} className="flex justify-between items-center">
                        <div className="text-sm text-gray-300">{product.name}</div>
                        <div className="text-neon-cyan font-bold">{product.sales}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Try-On Stats */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-cyber font-bold text-neon-purple mb-4">
                    AI TRY-ON STATS
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Today</span>
                      <span className="text-neon-pink font-bold">127</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">This Week</span>
                      <span className="text-neon-cyan font-bold">892</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Success Rate</span>
                      <span className="text-neon-green font-bold">94.2%</span>
                    </div>
                  </div>
                </div>

                {/* System Status */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-cyber font-bold text-neon-orange mb-4">
                    SYSTEM STATUS
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">API Status</span>
                      <span className="text-neon-green font-bold">●</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">AI Service</span>
                      <span className="text-neon-green font-bold">●</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Database</span>
                      <span className="text-neon-green font-bold">●</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
              </>
            )}

            {activeTab === 'products' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <AdminProductManager onProductsChange={loadStats} />
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
              >
                <h2 className="text-2xl font-cyber font-bold text-neon-cyan mb-6">ORDER MANAGEMENT</h2>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛍️</div>
                  <p className="text-xl text-gray-400 font-cyber">Order management coming soon...</p>
                  <p className="text-gray-500 mt-2">This feature will allow you to manage customer orders, track shipments, and handle returns.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
              >
                <h2 className="text-2xl font-cyber font-bold text-neon-cyan mb-6">ANALYTICS & REPORTS</h2>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📈</div>
                  <p className="text-xl text-gray-400 font-cyber">Advanced analytics coming soon...</p>
                  <p className="text-gray-500 mt-2">This feature will provide detailed insights into sales, customer behavior, and performance metrics.</p>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}