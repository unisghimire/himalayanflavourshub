import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Search, Filter, Star, ShoppingCart, Grid, List } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Link, useSearchParams } from 'react-router-dom'

const ProductsPage = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  const { addToCart } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState('grid')
  const [priceRange, setPriceRange] = useState([0, 50])

  const categories = [
    { 
      id: 'all', 
      name: 'All Products', 
      icon: '🛍️',
      description: 'Complete collection',
      image: 'bg-gradient-to-br from-primary-100 to-earth-100',
      count: 30
    },
    { 
      id: 'spices', 
      name: 'Pure Spices', 
      icon: '🌶️',
      description: 'Single-origin spices',
      image: 'bg-gradient-to-br from-red-100 to-orange-100',
      count: 8
    },
    { 
      id: 'blends', 
      name: 'Signature Blends', 
      icon: '✨',
      description: 'Traditional mixtures',
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
      description: 'High-altitude teas',
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

  const products = [
    {
      id: 1,
      name: "Himalayan Black Pepper",
      category: "spices",
      description: "Premium black pepper from the high-altitude regions, known for its intense aroma and bold flavor. Harvested from ancient pepper vines that grow wild in the Himalayan foothills.",
      price: "$12.99",
      priceValue: 12.99,
      image: "",
      icon: "🌶️",
      rating: 4.9,
      reviews: 127,
      badge: "Best Seller",
      inStock: true,
      weight: "100g"
    },
    {
      id: 2,
      name: "Sacred Cinnamon",
      category: "spices",
      description: "Rare cinnamon bark from the sacred groves, with a sweet and warming aroma. This cinnamon comes from trees that have been growing for generations in protected groves.",
      price: "$18.99",
      priceValue: 18.99,
      image: "",
      icon: "🌿",
      rating: 4.8,
      reviews: 89,
      badge: "Premium",
      inStock: true,
      weight: "50g"
    },
    {
      id: 3,
      name: "Mountain Garam Masala",
      category: "blends",
      description: "Our signature blend of 12 aromatic spices, perfect for authentic Indian cuisine. This blend represents centuries of culinary wisdom.",
      price: "$24.99",
      priceValue: 24.99,
      image: "",
      icon: "✨",
      rating: 5.0,
      reviews: 203,
      badge: "Signature",
      inStock: true,
      weight: "150g"
    },
    {
      id: 4,
      name: "Wild Himalayan Thyme",
      category: "herbs",
      description: "Wild-harvested thyme with intense flavor and medicinal properties. Collected from wild thyme that grows naturally in the alpine meadows.",
      price: "$15.99",
      priceValue: 15.99,
      image: "",
      icon: "🌱",
      rating: 4.7,
      reviews: 76,
      badge: "Organic",
      inStock: true,
      weight: "75g"
    },
    {
      id: 5,
      name: "Golden Turmeric",
      category: "spices",
      description: "Pure turmeric root powder with exceptional color and anti-inflammatory properties. Grown in the rich, mineral-dense soil of the Himalayas.",
      price: "$14.99",
      priceValue: 14.99,
      image: "",
      icon: "🟡",
      rating: 4.9,
      reviews: 156,
      badge: "Health",
      inStock: true,
      weight: "200g"
    },
    {
      id: 6,
      name: "Spice Route Blend",
      category: "blends",
      description: "A tribute to the ancient spice routes, featuring rare spices from across the region. This blend recreates the flavors that traveled along the ancient spice routes.",
      price: "$29.99",
      priceValue: 29.99,
      image: "",
      icon: "🗺️",
      rating: 4.8,
      reviews: 92,
      badge: "Limited",
      inStock: false,
      weight: "100g"
    }
  ]

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const matchesPrice = product.priceValue >= priceRange[0] && product.priceValue <= priceRange[1]
      return matchesSearch && matchesCategory && matchesPrice
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.priceValue - b.priceValue
        case 'price-high':
          return b.priceValue - a.priceValue
        case 'rating':
          return b.rating - a.rating
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

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

  return (
    <div className="min-h-screen bg-mountain-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-earth-600 text-white py-16">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our <span className="text-yellow-200">Products</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Discover our complete collection of authentic Himalayan spices, 
              signature blends, and traditional herbs
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto container-padding py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="card sticky top-24">
              <h3 className="font-display text-xl font-semibold text-mountain-800 mb-6">
                Filters
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mountain-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search spices..."
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-mountain-700 mb-3">
                  Categories
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`group relative overflow-hidden rounded-lg p-3 transition-all duration-300 hover:scale-105 text-left ${
                        selectedCategory === category.id
                          ? 'ring-2 ring-primary-500 shadow-lg bg-primary-50'
                          : 'hover:shadow-md bg-white border border-mountain-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`${category.image} rounded-lg p-2 transition-all duration-300 group-hover:scale-110`}>
                          <span className="text-lg">{category.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-mountain-800 mb-1">
                            {category.name}
                          </h4>
                          <p className="text-xs text-mountain-600">
                            {category.description}
                          </p>
                        </div>
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                          {category.count}
                        </span>
                      </div>
                      
                      {/* Selection indicator */}
                      {selectedCategory === category.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-mountain-700 mb-3">
                  Price Range
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-mountain-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-mountain-600">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field w-auto"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>

                {/* View Mode */}
                <div className="flex border border-mountain-200 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-mountain-600'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-mountain-600'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <motion.div
              ref={ref}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-6'
              }
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`group card ${viewMode === 'list' ? 'flex items-center space-x-6' : 'h-full'} ${
                    !product.inStock ? 'opacity-75' : ''
                  }`}
                >
                  {/* Product Image */}
                  <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'mb-6'}`}>
                    <div className={`${viewMode === 'list' ? 'w-32 h-32' : 'aspect-product'} bg-gradient-to-br from-primary-100 to-earth-100 rounded-xl flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300`}>
                      {product.icon}
                    </div>
                    {product.badge && (
                      <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(product.badge)}`}>
                        {product.badge}
                      </span>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                        <span className="text-white font-medium">Out of Stock</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium text-mountain-700">{product.rating}</span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className={`flex-1 ${viewMode === 'list' ? '' : 'flex flex-col'}`}>
                    <Link
                      to={`/products/${product.id}`}
                      className="font-display text-xl font-semibold text-mountain-800 mb-3 group-hover:text-primary-600 transition-colors duration-200 block"
                    >
                      {product.name}
                    </Link>
                    <p className={`text-mountain-600 text-sm mb-4 leading-relaxed ${viewMode === 'list' ? 'line-clamp-2' : 'flex-1'}`}>
                      {product.description}
                    </p>
                    
                    {/* Details */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-xs text-mountain-500 bg-mountain-100 px-2 py-1 rounded">
                          {product.weight}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-mountain-600">({product.reviews})</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <span className="font-display text-2xl font-bold text-primary-600">
                        {product.price}
                      </span>
                      <div className="flex space-x-2">
                        <Link
                          to={`/products/${product.id}`}
                          className="btn-outline text-sm"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="bg-primary-500 hover:bg-primary-600 disabled:bg-mountain-300 text-white p-2 rounded-lg transition-colors duration-200"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Filter className="w-16 h-16 text-mountain-400 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-mountain-800 mb-2">
                  No products found
                </h3>
                <p className="text-mountain-600">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
