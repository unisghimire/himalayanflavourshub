import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Mountain, Sparkles } from 'lucide-react'
import { productService } from '../../services/categoryService'

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch trending products
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setLoading(true);
        const trendingData = await productService.getTrendingProducts();
        setTrendingProducts(trendingData.slice(0, 3)); // Show only first 3 trending products
      } catch (error) {
        console.error('Error fetching trending products:', error);
        // Fallback to dummy data if fetch fails
        setTrendingProducts([
          { name: "Himalayan Black Pepper", icon: "🌶️", rating: "4.9", price: "$24.99", badge: "HOT" },
          { name: "Mountain Garam Masala", icon: "✨", rating: "5.0", price: "$18.99", badge: "BEST" },
          { name: "Wild Himalayan Thyme", icon: "🌿", rating: "4.8", price: "$16.99", badge: "NEW" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  // Auto-slide functionality
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Map database products to UI format
  const mapTrendingProducts = (products) => {
    return products.map((product, index) => {
      // Determine badge based on product properties
      let badge = "NEW";
      if (product.rating >= 4.9) badge = "BEST";
      else if (product.rating >= 4.7) badge = "HOT";
      
      // Determine icon based on category or product name
      let icon = "🌿";
      if (product.category_name?.toLowerCase().includes('spice')) icon = "🌶️";
      else if (product.category_name?.toLowerCase().includes('tea')) icon = "🍵";
      else if (product.category_name?.toLowerCase().includes('oil')) icon = "💧";
      else if (product.category_name?.toLowerCase().includes('salt')) icon = "🧂";
      else if (product.category_name?.toLowerCase().includes('blend')) icon = "✨";
      else if (product.name?.toLowerCase().includes('pepper')) icon = "🌶️";
      else if (product.name?.toLowerCase().includes('masala')) icon = "✨";
      else if (product.name?.toLowerCase().includes('thyme')) icon = "🌿";

      return {
        name: product.name,
        icon: icon,
        rating: product.rating || "4.8",
        price: `$${product.price}`,
        badge: badge,
        id: product.id
      };
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-earth-600 pt-20 md:pt-24 lg:pt-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-10" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, -10, 0],
            x: [0, 5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 left-1/4 w-20 h-20 bg-white/8 rounded-full blur-xl"
        />
      </div>

             <div className="relative z-10 max-w-7xl mx-auto container-padding">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 items-center">
           {/* Left Content - Image Carousel */}
           <div className="text-center lg:text-left lg:col-span-2 lg:pt-8 order-2 lg:order-1">
             {/* Image Carousel Container */}
             <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1, delay: 0.3 }}
               className="relative overflow-hidden rounded-3xl shadow-2xl"
             >
                               {/* Carousel Images */}
                <div className="relative h-64 sm:h-72 md:h-80 lg:h-[420px] overflow-hidden">
                                   {[
                    {
                      image: "/images/hero/himalayan-spices.jpg",
                      title: "Himalayan Spices",
                      subtitle: "Pure & Authentic"
                    },
                    {
                      image: "/images/hero/mountain-harvest.jpg",
                      title: "Mountain Harvest",
                      subtitle: "Fresh from Nature"
                    },
                    {
                      image: "/images/hero/traditional-methods.jpg",
                      title: "Traditional Methods",
                      subtitle: "Centuries Old Wisdom"
                    }
                  ].map((slide, index) => (
                                       <motion.div
                      key={index}
                      className="absolute inset-0"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ 
                        opacity: index === currentSlide ? 1 : 0,
                        x: index === currentSlide ? 0 : 100
                      }}
                      transition={{ 
                        duration: 0.8,
                        ease: "easeInOut"
                      }}
                    >
                     <div className="relative w-full h-full">
                       <img
                         src={slide.image}
                         alt={slide.title}
                         className="w-full h-full object-cover"
                       />
                       {/* Overlay */}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                       
                                               {/* Content */}
                        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
                          <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
                            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2"
                          >
                            {slide.title}
                          </motion.h3>
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.0 + index * 0.2 }}
                            className="text-white/90 text-sm sm:text-base md:text-lg"
                          >
                            {slide.subtitle}
                          </motion.p>
                        </div>
                     </div>
                   </motion.div>
                 ))}
               </div>

                               {/* Navigation Dots */}
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
                  {[0, 1, 2].map((index) => (
                    <motion.button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    />
                  ))}
                </div>

                               {/* Navigation Arrows */}
                <motion.button
                  onClick={prevSlide}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-lg sm:text-xl">‹</span>
                </motion.button>
                
                <motion.button
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-lg sm:text-xl">›</span>
                </motion.button>

                               {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg"
                >
                  Premium Quality
                </motion.div>
             </motion.div>

             
           </div>

                     {/* Right Side - Trending Products */}
           <motion.div
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="lg:col-span-1 lg:ml-auto lg:mr-0 order-1 lg:order-2"
           >
             <div className="relative bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border-2 border-white/30 shadow-2xl">
               {/* Glowing Border Effect */}
               <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 rounded-3xl blur-xl"></div>
               
               {/* Header with Animation */}
               <motion.div
                 initial={{ opacity: 0, y: -20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 0.6 }}
                 className="relative text-center mb-6"
               >
                 <motion.div
                   animate={{ 
                     scale: [1, 1.1, 1],
                     rotate: [0, 5, -5, 0]
                   }}
                   transition={{ 
                     duration: 3, 
                     repeat: Infinity, 
                     ease: "easeInOut" 
                   }}
                   className="inline-block text-3xl mb-3"
                 >
                   🔥
                 </motion.div>
                 <h3 className="text-white font-bold text-base sm:text-lg mb-2 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                   Trending Now
                 </h3>
                 <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mx-auto"></div>
               </motion.div>
               
               <div className="relative space-y-4">
                 {loading ? (
                   // Loading skeleton
                   Array.from({ length: 3 }).map((_, index) => (
                     <motion.div
                       key={index}
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="relative bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/40"
                     >
                       <div className="flex items-center space-x-4">
                         <div className="w-8 h-8 bg-white/20 rounded animate-pulse"></div>
                         <div className="flex-1">
                           <div className="h-4 bg-white/20 rounded animate-pulse mb-2"></div>
                           <div className="h-3 bg-white/20 rounded animate-pulse w-2/3"></div>
                         </div>
                         <div className="h-4 bg-white/20 rounded animate-pulse w-12"></div>
                       </div>
                     </motion.div>
                   ))
                 ) : (
                   mapTrendingProducts(trendingProducts).map((product, index) => (
                   <motion.div
                     key={index}
                     initial={{ opacity: 0, x: 30 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.6, delay: 0.8 + index * 0.15 }}
                     whileHover={{ 
                       scale: 1.02,
                       y: -2,
                       boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                     }}
                     className="relative bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/40 hover:border-white/60 transition-all duration-300 cursor-pointer group overflow-hidden"
                   >
                     {/* Hover Glow Effect */}
                     <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                     
                     {/* Badge */}
                     <div className="absolute top-3 right-3">
                       <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                         product.badge === 'HOT' ? 'bg-red-500 text-white' :
                         product.badge === 'BEST' ? 'bg-yellow-500 text-white' :
                         'bg-green-500 text-white'
                       }`}>
                         {product.badge}
                       </span>
                     </div>
                     
                     <div className="relative flex items-center space-x-4">
                       <motion.div 
                         className="text-3xl group-hover:scale-125 transition-transform duration-300"
                         animate={{ 
                           y: [0, -3, 0],
                           rotate: [0, 2, 0]
                         }}
                         transition={{ 
                           duration: 2, 
                           repeat: Infinity, 
                           delay: index * 0.5,
                           ease: "easeInOut" 
                         }}
                       >
                         {product.icon}
                       </motion.div>
                       <div className="flex-1">
                         <h4 className="text-white font-semibold text-xs sm:text-sm mb-1 group-hover:text-yellow-200 transition-colors">
                           {product.name}
                         </h4>
                         <div className="flex items-center space-x-2 mb-2">
                           <div className="flex items-center">
                             {[...Array(5)].map((_, i) => (
                               <motion.span 
                                 key={i} 
                                 className="text-yellow-300 text-sm"
                                 animate={{ 
                                   scale: [1, 1.2, 1],
                                   opacity: [0.7, 1, 0.7]
                                 }}
                                 transition={{ 
                                   duration: 2, 
                                   repeat: Infinity, 
                                   delay: i * 0.1,
                                   ease: "easeInOut" 
                                 }}
                               >
                                 {i < Math.floor(parseFloat(product.rating)) ? '★' : '☆'}
                               </motion.span>
                             ))}
                           </div>
                           <span className="text-white/80 text-xs font-medium">({product.rating})</span>
                         </div>
                       </div>
                       <div className="text-right">
                         <span className="text-white font-bold text-sm sm:text-base group-hover:text-yellow-200 transition-colors">
                           {product.price}
                         </span>
                       </div>
                     </div>
                   </motion.div>
                 ))
                 )}
               </div>

               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: 1.2 }}
                 className="relative mt-6 sm:mt-8 text-center"
               >
                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                 >
                   View All Products
                 </motion.button>
               </motion.div>
             </div>
           </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Bottom Wave - Connecting to BannerCarousel */}
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

export default HeroSection
