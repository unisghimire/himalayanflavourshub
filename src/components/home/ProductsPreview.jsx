import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { categoryProductsService, productService } from '../../services/categoryService'

const ProductsPreview = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  const { addToCart } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(Date.now())
  const [spicesScrollPosition, setSpicesScrollPosition] = useState(0)
  const [blendsScrollPosition, setBlendsScrollPosition] = useState(0)

  // Fetch categories and products from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [categoriesData, productsData, trendingData] = await Promise.all([
          categoryProductsService.getCategoryProducts(),
          productService.getAllProducts(),
          productService.getTrendingProducts()
        ])
        setCategories(categoriesData)
        setProducts(productsData)
        setTrendingProducts(trendingData)
        // Force refresh to prevent image caching issues
        setRefreshKey(Date.now())
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fallback categories if database is not available
  const fallbackCategories = [
    { 
      id: 'spices', 
      name: 'Pure Spices', 
      icon: '🌶️',
      description: 'Authentic single-origin spices',
      image: 'bg-gradient-to-br from-red-100 to-orange-100',
      count: 8
    },
    { 
      id: 'blends', 
      name: 'Signature Blends', 
      icon: '✨',
      description: 'Traditional spice mixtures',
      image: 'bg-gradient-to-br from-yellow-100 to-orange-100',
      count: 5
    },
    { 
      id: 'herbs', 
      name: 'Fresh Herbs', 
      icon: '🌿',
      description: 'Wild-harvested herbs',
      image: 'bg-gradient-to-br from-green-100 to-emerald-100',
      count: 4
    },
    { 
      id: 'teas', 
      name: 'Himalayan Teas', 
      icon: '🍵',
      description: 'High-altitude tea blends',
      image: 'bg-gradient-to-br from-green-100 to-teal-100',
      count: 6
    },
    { 
      id: 'salts', 
      name: 'Natural Salts', 
      icon: '🧂',
      description: 'Pink & rock salts',
      image: 'bg-gradient-to-br from-pink-100 to-rose-100',
      count: 3
    },
    { 
      id: 'oils', 
      name: 'Essential Oils', 
      icon: '💧',
      description: 'Pure aromatic oils',
              image: 'bg-gradient-to-br from-green-100 to-emerald-100',
      count: 4
    }
  ]

  // Fallback products if database is not available
  const fallbackProducts = [
    {
      id: 1,
      name: "Himalayan Black Pepper",
      category: "spices",
      description: "Premium black pepper from the high-altitude regions, known for its intense aroma and bold flavor.",
      price: "$12.99",
      image: "/images/products/spices/black-pepper.jpg",
      icon: "🌶️",
      rating: 4.9,
      reviews: 127,
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "Sacred Cinnamon",
      category: "spices",
      description: "Rare cinnamon bark from the sacred groves, with a sweet and warming aroma.",
      price: "$18.99",
      image: "/images/products/spices/cinnamon.jpg",
      icon: "🌿",
      rating: 4.8,
      reviews: 89,
      badge: "Premium"
    },
    {
      id: 3,
      name: "Mountain Garam Masala",
      category: "blends",
      description: "Our signature blend of 12 aromatic spices, perfect for authentic Indian cuisine.",
      price: "$24.99",
      image: "/images/products/blends/garam-masala.jpg",
      icon: "✨",
      rating: 5.0,
      reviews: 203,
      badge: "Signature"
    },
    {
      id: 4,
      name: "Wild Himalayan Thyme",
      category: "herbs",
      description: "Wild-harvested thyme with intense flavor and medicinal properties.",
      price: "$15.99",
      image: "/images/products/herbs/thyme.jpg",
      icon: "🌱",
      rating: 4.7,
      reviews: 76,
      badge: "Organic"
    },
    {
      id: 5,
      name: "Golden Turmeric",
      category: "spices",
      description: "Pure turmeric root powder with exceptional color and anti-inflammatory properties.",
      price: "$14.99",
      image: "",
      icon: "🟡",
      rating: 4.9,
      reviews: 156,
      badge: "Health"
    },
    {
      id: 6,
      name: "Spice Route Blend",
      category: "blends",
      description: "A tribute to the ancient spice routes, featuring rare spices from across the region.",
      price: "$29.99",
      image: "",
      icon: "🗺️",
      rating: 4.8,
      reviews: 92,
      badge: "Limited"
    }
  ]

  const getBadgeColor = (badge) => {
    const colors = {
      'Best Seller': 'bg-red-100 text-red-700',
      'Premium': 'bg-emerald-100 text-emerald-700',
      'Signature': 'bg-primary-100 text-primary-700',
      'Organic': 'bg-green-100 text-green-700',
      'Health': 'bg-earth-100 text-earth-700',
      'Limited': 'bg-green-100 text-green-700'
    }
    return colors[badge] || 'bg-mountain-100 text-mountain-700'
  }

  // Use database data or fallback data
  const displayCategories = categories.length > 0 ? categories : fallbackCategories

  // Carousel scroll functions
  const scrollSpices = (direction) => {
    const container = document.getElementById('spices-carousel')
    if (container) {
      const scrollAmount = 320 // Scroll by one product card width
      const currentScroll = container.scrollLeft
      const newPosition = direction === 'left' 
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      })
      setSpicesScrollPosition(newPosition)
    }
  }

  const scrollBlends = (direction) => {
    const container = document.getElementById('blends-carousel')
    if (container) {
      const scrollAmount = 320 // Scroll by one product card width
      const currentScroll = container.scrollLeft
      const newPosition = direction === 'left' 
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      })
      setBlendsScrollPosition(newPosition)
    }
  }
  
  // Map database products to include image field for compatibility
  const mappedProducts = products.length > 0 ? products.map(product => {
    // Force cache busting for Supabase images to prevent browser caching issues
    let imageUrl = product.image_url || product.image
    if (imageUrl && imageUrl.includes('supabase.co')) {
      // Add a unique cache-busting parameter for each product
      const separator = imageUrl.includes('?') ? '&' : '?'
      imageUrl = `${imageUrl}${separator}v=${refreshKey}&pid=${product.id}`
    }
    
    const mappedProduct = {
      ...product,
      image: imageUrl, // Use cache-busted image URL
      icon: product.icon || '🌿' // Add default icon if not present
    }
    // Debug log for uploaded images
    if (product.image_url && product.image_url.includes('supabase.co')) {
      console.log(`✅ ${product.name} (ID: ${product.id}) - Original: ${product.image_url}`)
      console.log(`🔄 ${product.name} (ID: ${product.id}) - Cache-busted: ${imageUrl}`)
    }
    return mappedProduct
  }) : []

  // Map trending products to include image field for compatibility
  const mappedTrendingProducts = trendingProducts.length > 0 ? trendingProducts.map(product => {
    // Force cache busting for Supabase images to prevent browser caching issues
    let imageUrl = product.image_url || product.image
    if (imageUrl && imageUrl.includes('supabase.co')) {
      // Add a unique cache-busting parameter for each product
      const separator = imageUrl.includes('?') ? '&' : '?'
      imageUrl = `${imageUrl}${separator}v=${refreshKey}&pid=${product.id}`
    }
    
    const mappedProduct = {
      ...product,
      image: imageUrl, // Use cache-busted image URL
      icon: product.icon || '🔥' // Add trending icon
    }
    return mappedProduct
  }) : []
  
  const displayProducts = mappedProducts.length > 0 ? mappedProducts : fallbackProducts

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all' 
    ? displayProducts 
    : displayProducts.filter(product => {
      // Handle database products (with categories object)
      if (product.categories && product.categories.slug) {
        return product.categories.slug === selectedCategory
      }
      // Handle fallback products (with category string)
      if (product.category) {
        return product.category === selectedCategory
      }
      // Handle direct category_id comparison (if needed)
      return product.category_id === selectedCategory
    })

  if (loading) {
    return (
      <section id="products-section" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-mountain-600">Loading products...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="products-section" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
                     <div className="flex items-center justify-center gap-4 mb-6">
             <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-mountain-800">
               Our <span className="text-gradient">Products</span>
             </h2>
             <button
               onClick={() => {
                 setRefreshKey(Date.now())
                 console.log('🔄 Manual refresh triggered')
               }}
               className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
               title="Refresh images to fix caching issues"
             >
               🔄 Refresh
             </button>
           </div>
          <p className="text-lg md:text-xl text-mountain-600 max-w-3xl mx-auto mb-10">
            Each product tells a story of tradition, quality, and the pristine Himalayan environment. 
            Discover flavors that have been cherished for generations.
          </p>

          {/* Shop by Category Section */}
          <div className="mb-16">
            <h3 className="font-display text-2xl font-bold text-mountain-800 mb-8 text-center">
              Shop by Category
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
              {displayCategories.map((category, index) => (
                <motion.button
                  key={category.category_id || category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => setSelectedCategory(category.category_slug || category.id)}
                  className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    selectedCategory === (category.category_slug || category.id)
                      ? 'ring-2 ring-primary-500 shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                >
                  <div className={`bg-gradient-to-br ${category.background_gradient || category.image} rounded-lg p-6 mb-3 transition-all duration-300 group-hover:scale-110`}>
                    <div className="text-4xl mb-2 transform transition-transform duration-300 group-hover:scale-110">
                      {category.category_icon || category.icon}
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm text-mountain-800 mb-1 leading-tight">
                    {category.category_name || category.name}
                  </h4>
                  <p className="text-xs text-mountain-600 mb-2">
                    {category.category_description || category.description}
                  </p>
                  <span className="inline-block bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full font-medium">
                    {category.product_count || category.count} items
                  </span>
                  
                  {/* Selection indicator */}
                  {selectedCategory === (category.category_slug || category.id) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
            
            {/* All Products Button */}
            <div className="text-center">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`inline-flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-mountain-100 text-mountain-700 hover:bg-primary-100 hover:text-primary-700'
                }`}
              >
                <span>View All Products</span>
                {selectedCategory === 'all' && <span className="text-sm">✓</span>}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Featured Products by Category */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-display text-2xl font-bold text-mountain-800 mb-2">
                {mappedTrendingProducts.length > 0 ? '🔥 Trending Products' : 'Pure Spices Collection'}
              </h3>
              <p className="text-mountain-600">
                {mappedTrendingProducts.length > 0 ? 'most popular and highly rated' : 'authentic flavors, pure quality'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => scrollSpices('left')}
                className="w-10 h-10 rounded-full bg-mountain-100 hover:bg-mountain-200 transition-colors flex items-center justify-center"
                title="Scroll left"
              >
                <span className="text-mountain-600">‹</span>
              </button>
              <button 
                onClick={() => scrollSpices('right')}
                className="w-10 h-10 rounded-full bg-mountain-100 hover:bg-mountain-200 transition-colors flex items-center justify-center"
                title="Scroll right"
              >
                <span className="text-mountain-600">›</span>
              </button>
            </div>
          </div>
          
          <div id="spices-carousel" className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {(mappedTrendingProducts.length > 0 ? mappedTrendingProducts : filteredProducts.slice(0, 5)).map((product, index) => (
              <motion.div
                key={`spices-${product.id}-${product.image}`}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden min-w-[280px] flex-shrink-0"
              >
                                 <div className="relative overflow-hidden">
                   {product.image ? (
                     <img
                       key={`img-spices-${product.id}-${product.image}`}
                       src={product.image}
                       alt={product.name}
                       className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                       onError={(e) => {
                         console.log(`❌ Image failed to load: ${product.name} - ${product.image}`);
                         e.target.style.display = 'none';
                         e.target.nextSibling.style.display = 'flex';
                       }}
                       onLoad={() => {
                         console.log(`✅ Image loaded successfully: ${product.name} - ${product.image}`);
                       }}
                     />
                   ) : null}
                   <div className={`w-full h-40 bg-gradient-to-br from-primary-100 to-earth-100 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 ${product.image ? 'hidden' : ''}`}>
                     {product.icon}
                   </div>
                  <div className="absolute top-3 left-3">
                    {mappedTrendingProducts.length > 0 ? (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        🔥 Trending
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Sale
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {Math.floor(Math.random() * 30) + 10}%
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-mountain-500 mb-2 block">
                    {mappedTrendingProducts.length > 0 
                      ? (product.category_name || product.categories?.name || 'Trending') 
                      : (product.category?.name || 'Pure Spices')
                    }
                  </span>
                  <h3 className="font-semibold text-mountain-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">
                        {i < Math.floor(product.rating || 0) ? '★' : i < (product.rating || 0) ? '☆' : '☆'}
                      </span>
                    ))}
                    <span className="text-xs text-mountain-600 ml-2">
                      {product.rating || 0} ({product.review_count || 0})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary-600">
                        ${product.original_price ? (product.price * 0.8).toFixed(2) : product.price}
                      </span>
                      {product.original_price && (
                        <span className="text-mountain-400 line-through text-sm">
                          ${product.original_price}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center space-x-1 text-sm"
                    >
                      <span className="text-lg">+</span>
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Signature Blends Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-display text-2xl font-bold text-mountain-800 mb-2">
                Signature Blends
              </h3>
              <p className="text-mountain-600">traditional mixtures, modern taste</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => scrollBlends('left')}
                className="w-10 h-10 rounded-full bg-mountain-100 hover:bg-mountain-200 transition-colors flex items-center justify-center"
                title="Scroll left"
              >
                <span className="text-mountain-600">‹</span>
              </button>
              <button 
                onClick={() => scrollBlends('right')}
                className="w-10 h-10 rounded-full bg-mountain-100 hover:bg-mountain-200 transition-colors flex items-center justify-center"
                title="Scroll right"
              >
                <span className="text-mountain-600">›</span>
              </button>
            </div>
          </div>
          
          <div id="blends-carousel" className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {filteredProducts.slice(1, 6).map((product, index) => (
              <motion.div
                key={`blends-${product.id}-${product.image}`}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden min-w-[280px] flex-shrink-0"
              >
                                 <div className="relative overflow-hidden">
                   {product.image ? (
                     <img
                       key={`img-blends-${product.id}-${product.image}`}
                       src={product.image}
                       alt={product.name}
                       className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                       onError={(e) => {
                         console.log(`❌ Image failed to load: ${product.name} - ${product.image}`);
                         e.target.style.display = 'none';
                         e.target.nextSibling.style.display = 'flex';
                       }}
                       onLoad={() => {
                         console.log(`✅ Image loaded successfully: ${product.name} - ${product.image}`);
                       }}
                     />
                   ) : null}
                   <div className={`w-full h-40 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 ${product.image ? 'hidden' : ''}`}>
                     {product.icon}
                   </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Sale
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {Math.floor(Math.random() * 25) + 15}%
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-mountain-500 mb-2 block">
                    Signature Blends
                  </span>
                  <h3 className="font-semibold text-mountain-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">
                        {i < Math.floor(product.rating) ? '★' : i < Math.floor(product.rating) ? '☆' : '☆'}
                      </span>
                    ))}
                    <span className="text-xs text-mountain-600 ml-2">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary-600">
                        ${(product.price * 0.85).toFixed(2)}
                      </span>
                      <span className="text-mountain-400 line-through text-sm">
                        ${product.price}
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center space-x-1 text-sm"
                    >
                      <span className="text-lg">+</span>
                      <span>Add</span>
                      </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center bg-gradient-to-r from-primary-500 to-earth-500 rounded-2xl p-8 md:p-12 text-white"
        >
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Experience the True Taste of the Himalayas
          </h3>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of customers who have discovered the authentic flavors of our region.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-primary-600 hover:bg-mountain-50 font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>View All Products</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-4 rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProductsPreview
