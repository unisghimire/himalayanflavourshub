import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  Search,
  Mountain,
  LogOut,
  Settings
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { cartCount } = useCart()
  const { user, isAdmin, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Use scrolled style only when actually scrolled
  const effectiveScrolledState = isScrolled

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const isActive = (path) => location.pathname === path

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        effectiveScrolledState
          ? 'bg-white shadow-xl border-b border-gray-100'
          : 'bg-gradient-to-r from-green-600 via-green-700 to-green-800 shadow-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto container-padding relative">
        {/* Animated Wavy Line - Extended for connection */}
        <div className="absolute bottom-0 left-0 right-0 h-12 w-screen -ml-[calc(50vw-50%)]">
          <svg
            viewBox="0 0 1200 50"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Main wave path with fill */}
            <path
              d="M0,25 Q150,5 300,25 T600,25 T900,25 T1200,25 L1200,50 L0,50 Z"
              fill="rgba(255, 255, 255, 0.15)"
              className="animate-pulse"
              style={{ animationDuration: '3s' }}
            />
            
            {/* Primary animated wave */}
            <path
              d="M0,25 Q150,5 300,25 T600,25 T900,25 T1200,25"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth="2.5"
              fill="none"
              className="animate-pulse"
              style={{ 
                animationDuration: '2s',
                filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.3))'
              }}
            />
            
            {/* Secondary wave with offset */}
            <path
              d="M0,25 Q150,45 300,25 T600,25 T900,25 T1200,25"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1.5"
              fill="none"
              className="animate-pulse"
              style={{ 
                animationDuration: '2.5s',
                animationDelay: '0.3s'
              }}
            />
            
            {/* Third wave layer */}
            <path
              d="M0,25 Q150,10 300,25 T600,25 T900,25 T1200,25"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
              fill="none"
              className="animate-pulse"
              style={{ 
                animationDuration: '3.5s',
                animationDelay: '0.7s'
              }}
            />
            
            {/* Floating particles */}
            <circle cx="200" cy="15" r="1" fill="rgba(255,255,255,0.8)" className="animate-ping" style={{ animationDuration: '2s' }} />
            <circle cx="400" cy="35" r="0.8" fill="rgba(255,255,255,0.6)" className="animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
            <circle cx="600" cy="10" r="1.2" fill="rgba(255,255,255,0.7)" className="animate-ping" style={{ animationDuration: '1.8s', animationDelay: '1s' }} />
            <circle cx="800" cy="40" r="0.6" fill="rgba(255,255,255,0.5)" className="animate-ping" style={{ animationDuration: '3s', animationDelay: '0.2s' }} />
            <circle cx="1000" cy="20" r="0.9" fill="rgba(255,255,255,0.6)" className="animate-ping" style={{ animationDuration: '2.2s', animationDelay: '0.8s' }} />
          </svg>
        </div>
        
                <div className="flex items-center justify-between h-20 md:h-24 lg:h-28 relative">
          {/* Desktop Navigation Container - Centered */}
          <div className="hidden lg:flex items-center justify-center space-x-8 lg:space-x-12 w-full">
            {/* Home */}
            <Link
              to="/"
              className={`font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 relative group px-4 py-2 rounded-lg ${
                isActive('/')
                  ? 'text-white bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg'
                  : effectiveScrolledState
                  ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  : 'text-white hover:text-yellow-300 hover:bg-white/10'
              }`}
            >
              Home
              {!isActive('/') && (
                <span
                  className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary-500 to-yellow-400 transition-all duration-300 ${
                    effectiveScrolledState ? 'w-0 group-hover:w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              )}
            </Link>

            {/* Products */}
            <Link
              to="/products"
              className={`font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 relative group px-4 py-2 rounded-lg ${
                isActive('/products')
                  ? 'text-white bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg'
                  : effectiveScrolledState
                  ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  : 'text-white hover:text-yellow-300 hover:bg-white/10'
              }`}
            >
              Products
              {!isActive('/products') && (
                <span
                  className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary-500 to-yellow-400 transition-all duration-300 ${
                    effectiveScrolledState ? 'w-0 group-hover:w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              )}
            </Link>

            {/* Center Logo - Desktop Version */}
            <div className="mx-8 lg:mx-12 mt-4">
              <Link to="/" className="group">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  {/* Outer Energy Field */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
                  
                  {/* Secondary Glow Ring */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  
                  {/* Main Arc Reactor Circle */}
                  <div className="relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-green-900 via-green-800 to-green-950 rounded-full border-2 border-green-400 shadow-2xl flex items-center justify-center group-hover:border-green-300 transition-all duration-500 overflow-hidden">
                    
                    {/* Inner Energy Core */}
                    <div className="absolute inset-2 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full animate-pulse"></div>
                    
                    {/* Outer Ring Pattern */}
                    <div className="absolute inset-1 rounded-full border border-green-400/50 animate-spin" style={{ animationDuration: '10s' }}></div>
                    <div className="absolute inset-2 rounded-full border border-green-300/30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
                    
                    {/* Energy Particles */}
                    <div className="absolute inset-0">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-green-400 rounded-full"
                          style={{
                            left: '50%',
                            top: '50%',
                            transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-8px)`,
                          }}
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Logo Image - Main Focus */}
                    <div className="relative z-30 flex items-center justify-center">
                      <img
                        src="/logo.png"
                        alt="Himalayan Flavours Hub"
                        className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <Mountain className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-green-300 opacity-90 group-hover:opacity-100 transition-opacity duration-300" style={{ display: 'none' }} />
                    </div>
                    
                    {/* Subtle Pulsing Core */}
                    <div className="absolute inset-3 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-full animate-ping"></div>
                  </div>
                  
                  {/* Rotating Energy Rings */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-green-400/30"
                  ></motion.div>
                  
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-emerald-400/20"
                  ></motion.div>
                </motion.div>
              </Link>
            </div>

            {/* About */}
            <Link
              to="/about"
              className={`font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 relative group px-4 py-2 rounded-lg ${
                isActive('/about')
                  ? 'text-white bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg'
                  : effectiveScrolledState
                  ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  : 'text-white hover:text-yellow-300 hover:bg-white/10'
              }`}
            >
              About
              {!isActive('/about') && (
                <span
                  className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary-500 to-yellow-400 transition-all duration-300 ${
                    effectiveScrolledState ? 'w-0 group-hover:w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              )}
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className={`font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 relative group px-4 py-2 rounded-lg ${
                isActive('/contact')
                  ? 'text-white bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg'
                  : effectiveScrolledState
                  ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  : 'text-white hover:text-yellow-300 hover:bg-white/10'
              }`}
            >
              Contact
              {!isActive('/contact') && (
                <span
                  className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary-500 to-yellow-400 transition-all duration-300 ${
                    effectiveScrolledState ? 'w-0 group-hover:w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              )}
            </Link>
          </div>

          {/* Mobile Layout - Centered Logo */}
          <div className="lg:hidden absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                {/* Mobile Iron Man Logo - Extra Large version */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-900 via-green-800 to-green-950 rounded-full border-2 border-green-400 shadow-lg flex items-center justify-center group-hover:border-green-300 transition-all duration-300 overflow-hidden">
                  
                  {/* Inner Energy Core */}
                  <div className="absolute inset-3 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full animate-pulse"></div>
                  
                  {/* Outer Ring Pattern */}
                  <div className="absolute inset-1.5 rounded-full border border-green-400/50 animate-spin" style={{ animationDuration: '8s' }}></div>
                  
                  {/* Logo Image */}
                  <div className="relative z-30 flex items-center justify-center">
                    <img
                      src="/logo.png"
                      alt="Himalayan Flavours Hub"
                      className="w-14 h-14 sm:w-18 sm:h-18 object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <Mountain className="w-14 h-14 sm:w-18 sm:h-18 text-green-300 opacity-90 group-hover:opacity-100 transition-opacity duration-300" style={{ display: 'none' }} />
                  </div>
                  
                  {/* Subtle Pulsing Core */}
                  <div className="absolute inset-3 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-full animate-ping"></div>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">
            {/* Search Button - Hidden on mobile */}
            <button
              className={`hidden sm:block p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                effectiveScrolledState
                  ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  : 'text-white hover:text-yellow-300 hover:bg-white/10'
              }`}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <Link
              to="/cart"
              className={`relative p-2 sm:p-3 rounded-xl transition-all duration-300 hover:scale-105 touch-manipulation ${
                effectiveScrolledState
                  ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  : 'text-white hover:text-yellow-300 hover:bg-white/10'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`p-2 sm:p-3 rounded-xl transition-all duration-300 hover:scale-105 touch-manipulation ${
                      effectiveScrolledState
                        ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                        : 'text-white hover:text-yellow-300 hover:bg-white/10'
                    }`}
                  >
                    <User className="w-5 h-5" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-mountain-200 py-2"
                      >
                        <div className="px-4 py-2 border-b border-mountain-100">
                          <p className="text-sm font-medium text-mountain-800">
                            {user.email}
                          </p>
                          {isAdmin && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-mountain-700 hover:bg-mountain-50"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                    effectiveScrolledState
                      ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      : 'text-white hover:text-yellow-300 hover:bg-white/10'
                  }`}
                >
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 sm:p-3 rounded-xl transition-all duration-300 touch-manipulation active:scale-95 ${
                effectiveScrolledState
                  ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  : 'text-white hover:text-yellow-300 hover:bg-white/10'
              }`}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t border-mountain-200 bg-white/95 backdrop-blur-md shadow-lg"
            >
              <nav className="py-6 px-4 space-y-3">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                                        <Link
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                      className={`mobile-menu-item no-select px-6 py-4 rounded-xl mobile-transition text-lg font-medium ${
                      isActive(item.href)
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105'
                          : 'text-mountain-700 hover:bg-mountain-50 hover:text-primary-600 hover:shadow-md active:scale-95'
                    }`}
                  >
                    {item.name}
                  </Link>
                  </motion.div>
                ))}
                
                {/* Mobile User Actions */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navigation.length * 0.1, duration: 0.3 }}
                  className="pt-4 border-t border-mountain-200 mt-6"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <Link
                        to="/cart"
                        onClick={() => setIsMenuOpen(false)}
                        className="mobile-menu-item no-select flex items-center space-x-2 text-mountain-700 hover:text-primary-600 mobile-transition active:scale-95"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span className="font-medium">Cart</span>
                        {cartCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button
                        className="mobile-menu-item no-select flex items-center space-x-2 text-mountain-700 hover:text-primary-600 mobile-transition active:scale-95"
                      >
                        <Search className="w-5 h-5" />
                        <span className="font-medium">Search</span>
                      </button>
                      
                      {user ? (
                        <button
                          onClick={() => {
                            setUserMenuOpen(!userMenuOpen)
                            setIsMenuOpen(false)
                          }}
                          className="mobile-menu-item no-select flex items-center space-x-2 text-mountain-700 hover:text-primary-600 mobile-transition active:scale-95"
                        >
                          <User className="w-5 h-5" />
                          <span className="font-medium">Account</span>
                        </button>
                      ) : (
                        <Link
                          to="/auth"
                          onClick={() => setIsMenuOpen(false)}
                          className="mobile-menu-item no-select flex items-center space-x-2 text-mountain-700 hover:text-primary-600 mobile-transition active:scale-95"
                        >
                          <User className="w-5 h-5" />
                          <span className="font-medium">Sign In</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header
