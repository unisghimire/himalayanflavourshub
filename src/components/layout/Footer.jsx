import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Mountain, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ArrowUp
} from 'lucide-react'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const quickLinks = [
    { text: 'Our Story', url: '/about' },
    { text: 'Products', url: '/products' },
    { text: 'Contact', url: '/contact' },
    { text: 'Cart', url: '/cart' }
  ]

  const categories = [
    { text: 'Pure Spices', url: '/products?category=spices' },
    { text: 'Signature Blends', url: '/products?category=blends' },
    { text: 'Fresh Herbs', url: '/products?category=herbs' },
    { text: 'Gift Sets', url: '/products?category=gifts' }
  ]

  const legalLinks = [
    { text: 'Privacy Policy', url: '#' },
    { text: 'Terms of Service', url: '#' },
    { text: 'Shipping Info', url: '#' },
    { text: 'Returns', url: '#' }
  ]

  const socialLinks = [
            { platform: 'Facebook', icon: Facebook, url: '#', color: 'hover:text-green-600' },
        { platform: 'Instagram', icon: Instagram, url: '#', color: 'hover:text-emerald-600' },
        { platform: 'Twitter', icon: Twitter, url: '#', color: 'hover:text-green-500' },
        { platform: 'LinkedIn', icon: Linkedin, url: '#', color: 'hover:text-green-700' }
  ]

  return (
    <footer className="bg-mountain-900 text-mountain-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto container-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 group mb-6">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Mountain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-white">
                  Himalayan Flavours
                </h1>
                <p className="text-sm text-mountain-400 -mt-1">From Top of the World</p>
              </div>
            </Link>
            <p className="text-mountain-300 mb-6 leading-relaxed">
              Bringing authentic Himalayan spices and flavors to your kitchen, 
              preserving traditional wisdom and quality for generations to come.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.platform}
                    href={social.url}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 bg-mountain-800 rounded-lg flex items-center justify-center transition-colors duration-200 ${social.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.text}>
                  <Link
                    to={link.url}
                    className="text-mountain-300 hover:text-primary-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.text}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="font-display font-semibold text-lg text-white mb-6">
              Categories
            </h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.text}>
                  <Link
                    to={category.url}
                    className="text-mountain-300 hover:text-primary-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {category.text}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-lg text-white mb-6">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-mountain-300">Himalayan Region</p>
                  <p className="text-mountain-400 text-sm">India</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a
                  href="mailto:info@himalayanflavours.com"
                  className="text-mountain-300 hover:text-primary-400 transition-colors duration-200"
                >
                  info@himalayanflavours.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-mountain-300 hover:text-primary-400 transition-colors duration-200"
                >
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-mountain-800">
        <div className="max-w-7xl mx-auto container-padding py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="font-display font-semibold text-lg text-white mb-2">
                Stay Connected
              </h4>
              <p className="text-mountain-300">
                Get updates on new products and special offers
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 rounded-l-lg bg-mountain-800 border border-mountain-700 text-white placeholder-mountain-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-r-lg transition-colors duration-200 font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-mountain-800">
        <div className="max-w-7xl mx-auto container-padding py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-wrap items-center justify-center md:justify-start space-x-6 mb-4 md:mb-0">
              <p className="text-mountain-400 text-sm">
                © 2025 Himalayan Flavours Hub. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Legal Links */}
              <div className="flex space-x-4">
                {legalLinks.map((link) => (
                  <a
                    key={link.text}
                    href={link.url}
                    className="text-mountain-400 hover:text-primary-400 text-sm transition-colors duration-200"
                  >
                    {link.text}
                  </a>
                ))}
              </div>
              
              {/* Scroll to Top */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-mountain-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <ArrowUp className="w-5 h-5 text-mountain-300" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
