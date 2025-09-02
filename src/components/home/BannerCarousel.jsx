import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: "Himalayan Spice Combo",
      subtitle: "Authentic flavors from the mountains",
      description: "Discover premium spices sourced from high-altitude regions & you're guaranteed authentic taste before you cook!",
              backgroundColor: "bg-gradient-to-br from-green-300 to-emerald-200",
      textColor: "text-gray-800",
      buttonBg: "bg-gray-800",
      buttonText: "text-white",
      illustration: "🏔️🌶️🧂✨",
      features: ["Premium Quality", "Mountain Sourced", "Traditional Methods"]
    },
    {
      id: 2,
      title: "Essential Oils Collection",
      subtitle: "Pure aromatic wellness",
      description: "Experience therapeutic essential oils extracted from wild Himalayan herbs & you're guaranteed natural healing!",
      backgroundColor: "bg-gradient-to-br from-green-300 to-emerald-200",
      textColor: "text-gray-800",
      buttonBg: "bg-gray-800",
      buttonText: "text-white",
      illustration: "💧🌿🍃💚",
      features: ["100% Pure", "Therapeutic Grade", "Wild Harvested"]
    },
    {
      id: 3,
      title: "Tea Blend Varieties",
      subtitle: "High-altitude tea experience",
      description: "Savor premium tea blends from mountain gardens & you're guaranteed exceptional flavor before you sip!",
      backgroundColor: "bg-gradient-to-br from-orange-300 to-yellow-200",
      textColor: "text-gray-800",
      buttonBg: "bg-gray-800",
      buttonText: "text-white",
      illustration: "🍵🫖🌱🏔️",
      features: ["High Altitude", "Hand Picked", "Traditional Blend"]
    },
    {
      id: 4,
      title: "Natural Salt Collection",
      subtitle: "Pink himalayan treasures",
      description: "Pure pink salt crystals from ancient rock formations & you're guaranteed mineral richness before you taste!",
      backgroundColor: "bg-gradient-to-br from-pink-300 to-rose-200",
      textColor: "text-gray-800",
      buttonBg: "bg-gray-800",
      buttonText: "text-white",
      illustration: "🧂💎🌸✨",
      features: ["Ancient Rock", "Mineral Rich", "Unprocessed"]
    }
  ]

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <section className="relative h-[80vh] md:h-[70vh] overflow-hidden">
      {/* Animated Connecting Wave from Header */}
      <div className="absolute top-0 left-0 right-0 h-12 -mt-12 z-20">
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
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`absolute inset-0 ${slides[currentSlide].backgroundColor} flex items-center`}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div className={`${slides[currentSlide].textColor} space-y-6`}>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                >
                  {slides[currentSlide].title}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-lg md:text-xl opacity-80 max-w-lg"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-sm md:text-base opacity-70 max-w-md leading-relaxed"
                >
                  {slides[currentSlide].description}
                </motion.p>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-wrap gap-4"
                >
                  {slides[currentSlide].features.map((feature, index) => (
                    <span key={index} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                      {feature}
                    </span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Link
                    to="/products"
                    className={`inline-flex items-center space-x-2 ${slides[currentSlide].buttonBg} ${slides[currentSlide].buttonText} px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg`}
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>

              {/* Right Illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex justify-center lg:justify-end"
              >
                <div className="relative">
                  {/* Main illustration container */}
                  <div className="w-80 h-80 md:w-96 md:h-96 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center text-8xl md:text-9xl shadow-2xl">
                    {slides[currentSlide].illustration}
                  </div>
                  
                  {/* Floating elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl"
                  >
                    ✨
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-6 -left-6 w-12 h-12 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center text-xl"
                  >
                    🌟
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-gray-800 scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Animated Bottom Wave - Connecting to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-12">
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
    </section>
  )
}

export default BannerCarousel
