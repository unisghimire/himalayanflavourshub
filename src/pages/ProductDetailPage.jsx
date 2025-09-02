import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  ArrowLeft,
  Plus,
  Minus,
  Award,
  Leaf,
  Mountain
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

const ProductDetailPage = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedTab, setSelectedTab] = useState('description')
  const [isFavorite, setIsFavorite] = useState(false)

  // Mock product data - in real app, fetch from API
  const product = {
    id: parseInt(id),
    name: "Himalayan Black Pepper",
    category: "spices",
    description: "Premium black pepper from the high-altitude regions, known for its intense aroma and bold flavor. Harvested from ancient pepper vines that grow wild in the Himalayan foothills, this black pepper carries the essence of the mountains.",
    longDescription: "Our Himalayan Black Pepper is sourced from the pristine high-altitude regions where ancient pepper vines have grown wild for centuries. The unique climatic conditions and mineral-rich soil of the Himalayas give this pepper its distinctive intense aroma and complex flavor profile. Each peppercorn is hand-harvested at the perfect moment of ripeness and carefully processed using traditional methods to preserve its natural oils and potency.",
    price: "$12.99",
    priceValue: 12.99,
    originalPrice: "$15.99",
    image: "",
    icon: "🌶️",
    rating: 4.9,
    reviews: 127,
    badge: "Best Seller",
    inStock: true,
    weight: "100g",
    origin: "Himalayan Foothills, Nepal",
    harvestDate: "October 2024",
    shelfLife: "3 years",
    ingredients: ["100% Pure Himalayan Black Pepper"],
    allergens: "None",
    certifications: ["Organic", "Fair Trade", "Non-GMO"],
    nutritionalInfo: {
      servingSize: "1 tsp (2g)",
      calories: 6,
      protein: "0.3g",
      carbs: "1.4g",
      fat: "0.1g",
      fiber: "0.6g"
    },
    benefits: [
      "Rich in antioxidants and anti-inflammatory compounds",
      "Supports digestive health and metabolism",
      "May help reduce inflammation",
      "Contains piperine for enhanced nutrient absorption"
    ],
    usageInstructions: [
      "Grind fresh for maximum flavor and aroma",
      "Perfect for seasoning meats, vegetables, and soups",
      "Add to marinades and spice blends",
      "Store in a cool, dry place away from direct sunlight"
    ]
  }

  const relatedProducts = [
    { id: 2, name: "Sacred Cinnamon", price: "$18.99", icon: "🌿" },
    { id: 5, name: "Golden Turmeric", price: "$14.99", icon: "🟡" },
    { id: 3, name: "Mountain Garam Masala", price: "$24.99", icon: "✨" }
  ]

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2 weeks ago",
      review: "This is the best black pepper I've ever used! The aroma is incredible and it really elevates every dish. Worth every penny.",
      verified: true
    },
    {
      id: 2,
      name: "Chef Marco",
      rating: 5,
      date: "1 month ago",
      review: "As a professional chef, I can say this pepper is exceptional. The freshness and intensity of flavor is unmatched. Highly recommend!",
      verified: true
    },
    {
      id: 3,
      name: "Lisa Chen",
      rating: 4,
      date: "2 months ago",
      review: "Great quality pepper with amazing packaging. The flavor is definitely superior to regular store-bought pepper.",
      verified: true
    }
  ]

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'ingredients', label: 'Ingredients & Info' },
    { id: 'usage', label: 'Usage & Benefits' },
    { id: 'reviews', label: `Reviews (${reviews.length})` }
  ]

  return (
    <div className="min-h-screen bg-mountain-50 pt-20">
      <div className="max-w-7xl mx-auto container-padding py-12">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-2 text-sm text-mountain-600 mb-8"
        >
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600">Products</Link>
          <span>/</span>
          <span className="text-mountain-800">{product.name}</span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-earth-100 rounded-2xl flex items-center justify-center text-9xl mb-4">
                {product.icon}
              </div>
              {product.badge && (
                <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {product.badge}
                </span>
              )}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  isFavorite ? 'bg-red-500 text-white' : 'bg-white text-mountain-600 hover:text-red-500'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            {/* Product Features */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {product.certifications.map((cert, index) => (
                <div key={index} className="text-center p-3 bg-white rounded-lg border border-mountain-200">
                  <div className="w-8 h-8 mx-auto mb-2">
                    {cert === 'Organic' && <Leaf className="w-8 h-8 text-green-600" />}
                    {cert === 'Fair Trade' && <Award className="w-8 h-8 text-green-600" />}
                    {cert === 'Non-GMO' && <Shield className="w-8 h-8 text-emerald-600" />}
                  </div>
                  <span className="text-xs font-medium text-mountain-700">{cert}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-500 fill-current'
                        : 'text-mountain-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-mountain-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-mountain-800 mb-4">
              {product.name}
            </h1>

            <p className="text-lg text-mountain-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="font-display text-3xl font-bold text-primary-600">
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-mountain-400 line-through">
                  {product.originalPrice}
                </span>
              )}
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                Save 19%
              </span>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <span className="text-mountain-500">Weight:</span>
                <span className="ml-2 font-medium text-mountain-800">{product.weight}</span>
              </div>
              <div>
                <span className="text-mountain-500">Origin:</span>
                <span className="ml-2 font-medium text-mountain-800">{product.origin}</span>
              </div>
              <div>
                <span className="text-mountain-500">Harvest:</span>
                <span className="ml-2 font-medium text-mountain-800">{product.harvestDate}</span>
              </div>
              <div>
                <span className="text-mountain-500">Shelf Life:</span>
                <span className="ml-2 font-medium text-mountain-800">{product.shelfLife}</span>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-mountain-700">Quantity:</span>
                <div className="flex items-center border border-mountain-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-mountain-100 transition-colors duration-200"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-mountain-100 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleShare}
                className="btn-outline flex items-center justify-center space-x-2"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>

            {/* Shipping Info */}
            <div className="space-y-3 text-sm text-mountain-600">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-green-600" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mountain className="w-5 h-5 text-primary-600" />
                <span>Sourced directly from Himalayan farmers</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <div className="border-b border-mountain-200 mb-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    selectedTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-mountain-500 hover:text-mountain-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="card">
            {selectedTab === 'description' && (
              <div>
                <h3 className="font-display text-xl font-semibold text-mountain-800 mb-4">
                  Product Description
                </h3>
                <p className="text-mountain-600 leading-relaxed">
                  {product.longDescription}
                </p>
              </div>
            )}

            {selectedTab === 'ingredients' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-display text-xl font-semibold text-mountain-800 mb-4">
                    Ingredients
                  </h3>
                  <ul className="space-y-2">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-mountain-600">{ingredient}</li>
                    ))}
                  </ul>
                  
                  <h4 className="font-semibold text-mountain-800 mt-6 mb-2">Allergens</h4>
                  <p className="text-mountain-600">{product.allergens}</p>
                </div>
                
                <div>
                  <h3 className="font-display text-xl font-semibold text-mountain-800 mb-4">
                    Nutritional Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-mountain-600">Serving Size</span>
                      <span className="font-medium">{product.nutritionalInfo.servingSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mountain-600">Calories</span>
                      <span className="font-medium">{product.nutritionalInfo.calories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mountain-600">Protein</span>
                      <span className="font-medium">{product.nutritionalInfo.protein}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mountain-600">Carbohydrates</span>
                      <span className="font-medium">{product.nutritionalInfo.carbs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mountain-600">Fat</span>
                      <span className="font-medium">{product.nutritionalInfo.fat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mountain-600">Fiber</span>
                      <span className="font-medium">{product.nutritionalInfo.fiber}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'usage' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-display text-xl font-semibold text-mountain-800 mb-4">
                    Usage Instructions
                  </h3>
                  <ul className="space-y-3">
                    {product.usageInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-mountain-600">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-display text-xl font-semibold text-mountain-800 mb-4">
                    Health Benefits
                  </h3>
                  <ul className="space-y-3">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-mountain-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div>
                <h3 className="font-display text-xl font-semibold text-mountain-800 mb-6">
                  Customer Reviews
                </h3>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-mountain-200 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-200 to-earth-200 rounded-full flex items-center justify-center">
                            <span className="font-display font-bold text-primary-700">
                              {review.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-mountain-800">{review.name}</h4>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                ))}
                              </div>
                              {review.verified && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-mountain-500">{review.date}</span>
                      </div>
                      <p className="text-mountain-600 leading-relaxed">{review.review}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="font-display text-2xl font-bold text-mountain-800 mb-8">
            You might also like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/products/${relatedProduct.id}`}
                className="card group hover:scale-105 transition-transform duration-300"
              >
                <div className="aspect-square bg-gradient-to-br from-primary-100 to-earth-100 rounded-xl flex items-center justify-center text-6xl mb-4">
                  {relatedProduct.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-mountain-800 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                  {relatedProduct.name}
                </h3>
                <p className="text-primary-600 font-semibold text-xl">
                  {relatedProduct.price}
                </p>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProductDetailPage
