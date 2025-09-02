import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'

const CartPage = () => {
  const { cart, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart()

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-mountain-50 pt-20">
        <div className="max-w-4xl mx-auto container-padding py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <ShoppingBag className="w-24 h-24 text-mountain-400 mx-auto mb-8" />
            <h1 className="font-display text-3xl md:text-4xl font-bold text-mountain-800 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-lg text-mountain-600 mb-8 max-w-2xl mx-auto">
              Looks like you haven't added any authentic Himalayan spices to your cart yet. 
              Explore our collection and discover the flavors from the top of the world.
            </p>
            <Link
              to="/products"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  const shipping = cartTotal > 50 ? 0 : 9.99
  const tax = cartTotal * 0.08
  const total = cartTotal + shipping + tax

  return (
    <div className="min-h-screen bg-mountain-50 pt-20">
      <div className="max-w-7xl mx-auto container-padding py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-mountain-800">
            Shopping Cart
          </h1>
          <Link
            to="/products"
            className="btn-outline inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Continue Shopping</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-mountain-800">
                  Cart Items ({cartCount})
                </h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 transition-colors duration-200 font-medium"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-4">
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-mountain-50 rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-earth-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                      {item.icon}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-mountain-800 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-mountain-600 mb-2">
                        ${item.price.toFixed(2)} each
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-mountain-200 hover:bg-mountain-300 flex items-center justify-center transition-colors duration-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-medium text-mountain-800 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-mountain-200 hover:bg-mountain-300 flex items-center justify-center transition-colors duration-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total and Remove */}
                    <div className="text-right">
                      <div className="font-semibold text-lg text-mountain-800 mb-2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 transition-colors duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="card sticky top-24"
            >
              <h2 className="font-display text-xl font-semibold text-mountain-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-mountain-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-mountain-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-mountain-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-mountain-200 pt-3">
                  <div className="flex justify-between font-semibold text-lg text-mountain-800">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {shipping > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
                    Add <strong>${(50 - cartTotal).toFixed(2)}</strong> more to qualify for free shipping!
                  </p>
                </div>
              )}

              <Link
                to="/checkout"
                className="w-full btn-primary inline-flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Security Features */}
              <div className="mt-6 space-y-3 text-sm text-mountain-600">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span>Free returns on all orders</span>
                </div>
              </div>
            </motion.div>

            {/* Recommended Products */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="card mt-8"
            >
              <h3 className="font-display text-lg font-semibold text-mountain-800 mb-4">
                You might also like
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Himalayan Pink Salt", price: "$9.99", icon: "🧂" },
                  { name: "Organic Cardamom", price: "$22.99", icon: "🫚" },
                ].map((product, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-mountain-50 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-earth-100 rounded-lg flex items-center justify-center text-2xl">
                      {product.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-mountain-800 text-sm">{product.name}</h4>
                      <p className="text-primary-600 font-semibold">{product.price}</p>
                    </div>
                    <button className="btn-outline text-xs px-3 py-1">
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
