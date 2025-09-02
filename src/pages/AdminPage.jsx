import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Star,
  Calendar,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck,
  Shield,
  Database,
  FileText,
  Bell,
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { categoryService, productService } from '../services/categoryService'
import { storageService } from '../services/storageService'
import { heroBannerService } from '../services/heroBannerService'

// Product Management Component
const ProductManagement = () => {
  const [activeSection, setActiveSection] = useState('products')
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showViewProduct, setShowViewProduct] = useState(false)
  const [showEditProduct, setShowEditProduct] = useState(false)
  const [showViewCategory, setShowViewCategory] = useState(false)
  const [showEditCategory, setShowEditCategory] = useState(false)
  const [showHeroBanner, setShowHeroBanner] = useState(false)
  const [showEditHeroBanner, setShowEditHeroBanner] = useState(false)
  const [selectedHeroBanner, setSelectedHeroBanner] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [heroBanners, setHeroBanners] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Categories state - now loaded from database
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  // Products state - now loaded from database
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      low: 'bg-yellow-100 text-yellow-700',
      out: 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategoryFilter === 'all' || product.category === selectedCategoryFilter) &&
    (filterStatus === 'all' || product.status === filterStatus)
  )

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

    // Load categories, products, and hero banners from database
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories
        setCategoriesLoading(true)
        const categoriesData = await categoryService.getAllCategories()
        setCategories(categoriesData)

        // Load products
        setProductsLoading(true)
        const productsData = await productService.getAllProducts()
        setProducts(productsData)

        // Load hero banners from service
        const bannersData = await heroBannerService.getHeroBanners()
        setHeroBanners(bannersData)
      } catch (error) {
        console.error('Error loading data:', error)
        alert('Failed to load data')
      } finally {
        setCategoriesLoading(false)
        setProductsLoading(false)
      }
    }

    loadData()
  }, [])

  // Handler functions
  const handleViewProduct = (product) => {
    setSelectedProduct(product)
    setShowViewProduct(true)
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setShowEditProduct(true)
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        // Delete product from database
        await productService.deleteProduct(productId)
        
        // Update local state to remove the deleted product
        setProducts(prev => prev.filter(product => product.id !== productId))
        
        // Show success message
        alert('Product deleted successfully!')
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Failed to delete product. Please try again.')
      }
    }
  }

  const handleUpdateProduct = async (productId, formData) => {
    try {
      // Update product in database using service
      const updatedProduct = await productService.updateProduct(productId, {
        name: formData.name,
        description: formData.description,
        category_id: formData.category_id,
        price: parseFloat(formData.price),
        original_price: formData.original_price,
        stock_quantity: parseInt(formData.stock_quantity),
        image_url: formData.image_url,
        is_featured: formData.is_featured,
        is_trending: formData.is_trending,
        is_active: formData.is_active
      })

      // Update local state
      setProducts(prev => prev.map(prod => 
        prod.id === productId ? { ...prod, ...updatedProduct } : prod
      ))

      alert('Product updated successfully!')
      setShowEditProduct(false)
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product')
    }
  }

  const handleDeleteProductImage = async (productId, imageUrl) => {
    try {
      // Delete from Supabase Storage
      const deleteResult = await storageService.deleteProductImage(imageUrl)
      
      if (deleteResult.success) {
        // Update database to remove image URL
        await productService.updateProductImage(productId, null)
        
        // Update local state
        setProducts(products.map(product => 
          product.id === productId ? { ...product, image_url: null } : product
        ))
        
        // Update selected product if it's the current one
        if (selectedProduct && selectedProduct.id === productId) {
          setSelectedProduct({ ...selectedProduct, image_url: null })
        }
        
        alert('Image deleted successfully!')
      } else {
        alert('Failed to delete image: ' + deleteResult.error)
      }
    } catch (error) {
      console.error('Error deleting product image:', error)
      alert('Failed to delete image. Please try again.')
    }
  }

  const handleUploadHeroBanner = async (file, title, subtitle) => {
    try {
      // Validate file
      const validation = storageService.validateFile(file)
      if (!validation.valid) {
        alert(validation.error)
        return null
      }
      
      // Upload to Supabase Storage
      const uploadResult = await storageService.uploadHeroBanner(file)
      if (uploadResult.success) {
        const newBanner = {
          id: Date.now(), // Temporary ID
          image: uploadResult.url,
          title: title,
          subtitle: subtitle,
          order: heroBanners.length
        }
        
        // Update local state and service
        const updatedBanners = await heroBannerService.addHeroBanner(newBanner)
        setHeroBanners(updatedBanners)
        
        alert('Hero banner uploaded successfully!')
        return newBanner
      } else {
        alert('Failed to upload hero banner: ' + uploadResult.error)
        return null
      }
    } catch (error) {
      console.error('Error uploading hero banner:', error)
      alert('Failed to upload hero banner. Please try again.')
      return null
    }
  }

  const handleDeleteHeroBanner = async (bannerId, imageUrl) => {
    try {
      // Only delete from Supabase Storage if it's a Supabase URL
      if (imageUrl && imageUrl.includes('supabase.co')) {
        const deleteResult = await storageService.deleteHeroBanner(imageUrl)
        if (!deleteResult.success) {
          alert('Failed to delete hero banner: ' + deleteResult.error)
          return
        }
      }
      
      // Update local state and service
      const updatedBanners = await heroBannerService.deleteHeroBanner(bannerId)
      setHeroBanners(updatedBanners)
      alert('Hero banner deleted successfully!')
    } catch (error) {
      console.error('Error deleting hero banner:', error)
      alert('Failed to delete hero banner. Please try again.')
    }
  }

  const handleEditHeroBanner = (banner) => {
    setSelectedHeroBanner(banner)
    setShowEditHeroBanner(true)
  }

  const handleUpdateHeroBanner = async (bannerId, title, subtitle, newImageFile = null) => {
    try {
      let imageUrl = selectedHeroBanner.image
      
      // If new image file is provided, upload it
      if (newImageFile) {
        const uploadResult = await storageService.uploadHeroBanner(newImageFile)
        if (uploadResult.success) {
          imageUrl = uploadResult.url
        } else {
          alert('Failed to upload new image: ' + uploadResult.error)
          return
        }
      }
      
      // Update local state and service
      const updatedBanners = await heroBannerService.updateHeroBanner(bannerId, {
        title,
        subtitle,
        image: imageUrl
      })
      setHeroBanners(updatedBanners)
      
      alert('Hero banner updated successfully!')
      setShowEditHeroBanner(false)
      setSelectedHeroBanner(null)
    } catch (error) {
      console.error('Error updating hero banner:', error)
      alert('Failed to update hero banner. Please try again.')
    }
  }

  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
      alert('URL copied to clipboard!')
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('URL copied to clipboard!')
    }
  }

  // Category handler functions
  const handleViewCategory = (category) => {
    setSelectedCategory(category)
    setShowViewCategory(true)
  }

  const handleEditCategory = (category) => {
    setSelectedCategory(category)
    setShowEditCategory(true)
  }

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        // Delete category from database
        await categoryService.deleteCategory(categoryId)
        
        // Update local state to remove the deleted category
        setCategories(prev => prev.filter(cat => cat.id !== categoryId))
        
        // Show success message
        alert('Category deleted successfully!')
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Failed to delete category. Please try again.')
      }
    }
  }

  const handleUpdateCategory = async (categoryId, formData) => {
    try {
      // Update category in database using service
      const updatedCategory = await categoryService.updateCategory(categoryId, {
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        is_active: formData.is_active
      })

      // Update local state
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId ? { ...cat, ...updatedCategory } : cat
      ))

      alert('Category updated successfully!')
      setShowEditCategory(false)
    } catch (error) {
      console.error('Error updating category:', error)
      alert('Failed to update category')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-mountain-800">Product Management</h2>
            <p className="text-mountain-600">Manage your product catalog and categories</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddCategory(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
            <button
              onClick={() => setShowAddProduct(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveSection('products')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'products'
                ? 'bg-green-100 text-green-700'
                : 'text-mountain-600 hover:text-mountain-800 hover:bg-gray-50'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveSection('categories')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'categories'
                ? 'bg-green-100 text-green-700'
                : 'text-mountain-600 hover:text-mountain-800 hover:bg-gray-50'
            }`}
          >
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveSection('hero-banners')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'hero-banners'
                ? 'bg-green-100 text-green-700'
                : 'text-mountain-600 hover:text-mountain-800 hover:bg-gray-50'
            }`}
          >
            Hero Banners ({heroBanners.length})
          </button>
        </div>
      </div>

      {/* Products Section */}
      {activeSection === 'products' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mountain-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
                             <select
                 value={selectedCategoryFilter}
                 onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
               >
                 <option value="all">All Categories</option>
                 {categories.map(category => (
                   <option key={category.id} value={category.slug}>{category.name}</option>
                 ))}
               </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
          </div>

                               {/* Products Table */}
          <div className="overflow-x-auto">
            {productsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-2 text-mountain-600">Loading products...</span>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="text-left py-4 px-6 font-semibold text-mountain-800 text-sm uppercase tracking-wide">Product</th>
                    <th className="text-left py-4 px-4 font-semibold text-mountain-800 text-sm uppercase tracking-wide">Category</th>
                    <th className="text-left py-4 px-4 font-semibold text-mountain-800 text-sm uppercase tracking-wide">Price</th>
                    <th className="text-center py-4 px-4 font-semibold text-mountain-800 text-sm uppercase tracking-wide">Stock</th>
                    <th className="text-center py-4 px-4 font-semibold text-mountain-800 text-sm uppercase tracking-wide">Status</th>
                    <th className="text-center py-4 px-4 font-semibold text-mountain-800 text-sm uppercase tracking-wide">Rating</th>
                    <th className="text-center py-4 px-4 font-semibold text-mountain-800 text-sm uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                   <tr key={product.id} className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 group">
                     <td className="py-4 px-6">
                       <div className="flex items-start space-x-3">
                         <div className="w-12 h-12 flex-shrink-0 relative group">
                           {product.image_url ? (
                             <img 
                               src={product.image_url} 
                               alt={product.name}
                               className="w-12 h-12 object-cover rounded-lg border border-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                               onError={(e) => {
                                 e.target.style.display = 'none';
                                 e.target.nextSibling.style.display = 'flex';
                               }}
                               title={`Click to view full image\nURL: ${product.image_url}`}
                               onClick={() => window.open(product.image_url, '_blank')}
                             />
                           ) : null}
                           <div className={`w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-200 rounded-lg flex items-center justify-center ${product.image_url ? 'hidden' : 'flex'}`}>
                             <Package className="w-5 h-5 text-green-600" />
                           </div>
                           {/* Tooltip */}
                           {product.image_url && (
                             <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                               Click to view full image
                               <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                             </div>
                           )}
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="font-semibold text-mountain-800 text-sm truncate">{product.name}</p>
                           <p className="text-xs text-mountain-500">#{product.id.toString().padStart(3, '0')}</p>
                           <div className="flex flex-wrap gap-1 mt-1">
                             {product.image_url && (
                               <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                 📷 Image
                               </span>
                             )}
                             {product.isFeatured && (
                               <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                 <Star className="w-3 h-3 mr-1" />
                                 Featured
                               </span>
                             )}
                             {product.isTrending && (
                               <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                 <TrendingUp className="w-3 h-3 mr-1" />
                                 Trending
                               </span>
                             )}
                           </div>
                         </div>
                       </div>
                     </td>
                     <td className="py-4 px-4">
                       <div className="flex items-center">
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                           {categories.find(c => c.slug === product.category)?.name || product.category}
                         </span>
                       </div>
                     </td>
                     <td className="py-4 px-4">
                       <div className="text-right">
                         <p className="font-bold text-mountain-800 text-sm">${product.price}</p>
                         {product.originalPrice && (
                           <p className="text-xs text-mountain-400 line-through">${product.originalPrice}</p>
                         )}
                       </div>
                     </td>
                     <td className="py-4 px-4">
                       <div className="text-center">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                           product.stock > 50 ? 'bg-green-100 text-green-800' :
                           product.stock > 10 ? 'bg-yellow-100 text-yellow-800' :
                           'bg-red-100 text-red-800'
                         }`}>
                           {product.stock}
                         </span>
                       </div>
                     </td>
                     <td className="py-4 px-4">
                       <div className="text-center">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                           {product.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                           {product.status === 'low' && <AlertCircle className="w-3 h-3 mr-1" />}
                           {product.status === 'out' && <X className="w-3 h-3 mr-1" />}
                           {product.status}
                         </span>
                       </div>
                     </td>
                     <td className="py-4 px-4">
                       <div className="text-center">
                         <div className="flex items-center justify-center space-x-1">
                           <div className="flex items-center">
                             {[...Array(5)].map((_, i) => (
                               <Star
                                 key={i}
                                 className={`w-3 h-3 ${
                                   i < Math.floor(product.rating) 
                                     ? 'text-yellow-400 fill-current' 
                                     : 'text-gray-300'
                                 }`}
                               />
                             ))}
                           </div>
                           <span className="text-xs text-mountain-600 font-medium">({product.reviews})</span>
                         </div>
                       </div>
                     </td>
                                           <td className="py-4 px-4">
                        <div className="flex items-center justify-center space-x-1">
                          <button 
                            onClick={() => handleViewProduct(product)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-200" 
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors duration-200" 
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {product.image_url ? (
                            <button 
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this product image?')) {
                                  handleDeleteProductImage(product.id, product.image_url)
                                }
                              }}
                              className="p-1.5 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-md transition-colors duration-200" 
                              title="Delete Image"
                            >
                              🗑️
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-200" 
                              title="Add Image"
                            >
                              📷
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200" 
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                   </tr>
                 ))}
               </tbody>
             </table>
            )}
           </div>
        </div>
      )}

      {/* Hero Banners Section */}
      {activeSection === 'hero-banners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-mountain-800">Hero Banner Management</h2>
            <button
              onClick={() => setShowHeroBanner(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Hero Banner</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heroBanners.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Hero Banners</h3>
                  <p className="text-gray-500 mb-4">Upload your first hero banner image to get started.</p>
                  <button
                    onClick={() => setShowHeroBanner(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Hero Banner
                  </button>
                </div>
              ) : (
                heroBanners.map((banner, index) => (
                  <div key={banner.id} className="relative group">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                        <button
                          onClick={() => handleEditHeroBanner(banner)}
                          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                          title="Edit Banner"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this hero banner?')) {
                              handleDeleteHeroBanner(banner.id, banner.image)
                            }
                          }}
                          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                          title="Delete Banner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="font-semibold text-mountain-800">{banner.title}</h3>
                      <p className="text-sm text-mountain-600">{banner.subtitle}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Order: {banner.order + 1}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">#{index + 1}</span>
                            {banner.image.includes('supabase.co') ? (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Uploaded</span>
                            ) : (
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Local</span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-gray-500">Storage URL:</p>
                            <button
                              onClick={() => handleCopyUrl(banner.image)}
                              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                              title="Copy URL"
                            >
                              📋 Copy
                            </button>
                          </div>
                          <div className="bg-gray-50 rounded p-2 text-xs font-mono text-gray-700 break-all">
                            {banner.image}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Categories Section */}
      {activeSection === 'categories' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mountain-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="p-6">
            {categoriesLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-2 text-mountain-600">Loading categories...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                <div key={category.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                     <div className="flex items-start justify-between mb-4">
                     <div>
                       <h3 className="font-semibold text-mountain-800 mb-1">{category.name}</h3>
                       <p className="text-sm text-mountain-600">{category.description}</p>
                     </div>
                     <div className="flex space-x-2">
                       <button 
                         onClick={() => handleViewCategory(category)}
                         className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-200" 
                         title="View Details"
                       >
                         <Eye className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => handleEditCategory(category)}
                         className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors duration-200" 
                         title="Edit Category"
                       >
                         <Edit className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => handleDeleteCategory(category.id)}
                         className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200" 
                         title="Delete Category"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-mountain-600">Products:</span>
                      <span className="font-medium text-mountain-800">{category.productCount}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      category.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-mountain-800">Add New Product</h3>
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="text-mountain-400 hover:text-mountain-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <form className="space-y-6" onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                
                // Handle file upload if a file is selected
                let imageUrl = formData.get('imageUrl') || null
                const fileInput = e.target.querySelector('input[type="file"]')
                
                if (fileInput && fileInput.files && fileInput.files[0]) {
                  const file = fileInput.files[0]
                  
                  // Validate file
                  const validation = storageService.validateFile(file)
                  if (!validation.valid) {
                    alert(validation.error)
                    return
                  }
                  
                  // Upload file
                  const uploadResult = await storageService.uploadProductImage(file)
                  if (uploadResult.success) {
                    imageUrl = uploadResult.url
                  } else {
                    alert('Failed to upload image: ' + uploadResult.error)
                    return
                  }
                }
                
                // Find the category ID from the slug
                const selectedCategorySlug = formData.get('category')
                const selectedCategory = categories.find(cat => cat.slug === selectedCategorySlug)
                
                // Create product data
                const productData = {
                  name: formData.get('name'),
                  description: formData.get('description'),
                  category_id: selectedCategory ? selectedCategory.id : null,
                  price: parseFloat(formData.get('price')),
                  original_price: formData.get('originalPrice') ? parseFloat(formData.get('originalPrice')) : null,
                  stock_quantity: parseInt(formData.get('stock')),
                  image_url: imageUrl,
                  is_featured: formData.get('isFeatured') === 'on',
                  is_trending: formData.get('isTrending') === 'on',
                  is_active: formData.get('isActive') === 'on'
                }
                
                try {
                  // Create product in database
                  const newProduct = await productService.createProduct(productData)
                  
                  // Update local state
                  setProducts(prev => [newProduct, ...prev])
                  
                  // Close modal and show success
                  setShowAddProduct(false)
                  alert('Product created successfully!')
                } catch (error) {
                  console.error('Error creating product:', error)
                  alert('Failed to create product. Please try again.')
                }
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">Category</label>
                    <select name="category" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.slug}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">Original Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">Stock Quantity</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">Status</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">Description</label>
                  <textarea
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter product description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">Product Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg or /images/products/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter a full URL or relative path. Leave empty if uploading a file below.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">Or Upload Image</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload-add" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                          <span>Upload a file</span>
                          <input id="file-upload-add" name="file-upload" type="file" className="sr-only" accept="image/*" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input type="checkbox" name="isFeatured" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-mountain-700">Featured Product</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" name="isTrending" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-mountain-700">Trending</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" name="isActive" defaultChecked className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-mountain-700">Active</span>
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddProduct(false)}
                    className="px-4 py-2 text-mountain-600 hover:text-mountain-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-mountain-800">Add New Category</h3>
                <button
                  onClick={() => setShowAddCategory(false)}
                  className="text-mountain-400 hover:text-mountain-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">Category Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">Description</label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter category description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">Category Icon</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="🌶️ (emoji or icon)"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="category-active"
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    defaultChecked
                  />
                  <label htmlFor="category-active" className="ml-2 text-sm text-mountain-700">
                    Active Category
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(false)}
                    className="px-4 py-2 text-mountain-600 hover:text-mountain-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            </div>
          </div>
                 </div>
       )}

       {/* View Product Modal */}
       {showViewProduct && selectedProduct && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
             <div className="p-6 border-b border-gray-200">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-semibold text-mountain-800">Product Details</h3>
                 <button
                   onClick={() => setShowViewProduct(false)}
                   className="text-mountain-400 hover:text-mountain-600"
                 >
                   <X className="w-6 h-6" />
                 </button>
               </div>
             </div>
             <div className="p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Product Name</label>
                   <p className="text-mountain-800 font-medium">{selectedProduct.name}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Category</label>
                   <p className="text-mountain-800 font-medium">
                     {categories.find(c => c.slug === selectedProduct.category)?.name || selectedProduct.category}
                   </p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Price</label>
                   <p className="text-mountain-800 font-medium">${selectedProduct.price}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Original Price</label>
                   <p className="text-mountain-800 font-medium">${selectedProduct.originalPrice || 'N/A'}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Stock</label>
                   <p className="text-mountain-800 font-medium">{selectedProduct.stock}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Status</label>
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedProduct.status)}`}>
                     {selectedProduct.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                     {selectedProduct.status === 'low' && <AlertCircle className="w-3 h-3 mr-1" />}
                     {selectedProduct.status === 'out' && <X className="w-3 h-3 mr-1" />}
                     {selectedProduct.status}
                   </span>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Rating</label>
                   <div className="flex items-center space-x-1">
                     <div className="flex items-center">
                       {[...Array(5)].map((_, i) => (
                         <Star
                           key={i}
                           className={`w-3 h-3 ${
                             i < Math.floor(selectedProduct.rating) 
                               ? 'text-yellow-400 fill-current' 
                               : 'text-gray-300'
                           }`}
                         />
                       ))}
                     </div>
                     <span className="text-xs text-mountain-600 font-medium">({selectedProduct.reviews})</span>
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Sales</label>
                   <p className="text-mountain-800 font-medium">{selectedProduct.sales}</p>
                 </div>
               </div>
               <div className="mt-6">
                 <label className="block text-sm font-medium text-mountain-700 mb-2">Features</label>
                 <div className="flex flex-wrap gap-2">
                   {selectedProduct.isFeatured && (
                     <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                       <Star className="w-3 h-3 mr-1" />
                       Featured
                     </span>
                   )}
                   {selectedProduct.isTrending && (
                     <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                       <TrendingUp className="w-3 h-3 mr-1" />
                       Trending
                     </span>
                   )}
                 </div>
               </div>
               <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                 <button
                   onClick={() => setShowViewProduct(false)}
                   className="px-4 py-2 text-mountain-600 hover:text-mountain-800 transition-colors"
                 >
                   Close
                 </button>
                 <button
                   onClick={() => {
                     setShowViewProduct(false)
                     handleEditProduct(selectedProduct)
                   }}
                   className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                 >
                   Edit Product
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Edit Product Modal */}
       {showEditProduct && selectedProduct && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
             <div className="p-6 border-b border-gray-200">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-semibold text-mountain-800">Edit Product</h3>
                 <button
                   onClick={() => setShowEditProduct(false)}
                   className="text-mountain-400 hover:text-mountain-600"
                 >
                   <X className="w-6 h-6" />
                 </button>
               </div>
             </div>
             <div className="p-6">
               <form className="space-y-6" onSubmit={async (e) => {
                 e.preventDefault()
                 const formData = new FormData(e.target)
                 
                 // Handle file upload if a file is selected
                 let imageUrl = formData.get('imageUrl') || null
                 const fileInput = e.target.querySelector('input[type="file"]')
                 
                 if (fileInput && fileInput.files && fileInput.files[0]) {
                   const file = fileInput.files[0]
                   
                   // Validate file
                   const validation = storageService.validateFile(file)
                   if (!validation.valid) {
                     alert(validation.error)
                     return
                   }
                   
                   // Upload file
                   const uploadResult = await storageService.uploadProductImage(file, selectedProduct.id)
                   if (uploadResult.success) {
                     imageUrl = uploadResult.url
                   } else {
                     alert('Failed to upload image: ' + uploadResult.error)
                     return
                   }
                 }
                 
                 // Find the category ID from the slug
                 const selectedCategorySlug = formData.get('category')
                 const selectedCategory = categories.find(cat => cat.slug === selectedCategorySlug)
                 
                 const updateData = {
                   name: formData.get('name'),
                   description: formData.get('description'),
                   category_id: selectedCategory ? selectedCategory.id : null,
                   price: parseFloat(formData.get('price')),
                   original_price: formData.get('originalPrice') ? parseFloat(formData.get('originalPrice')) : null,
                   stock_quantity: parseInt(formData.get('stock')),
                   image_url: imageUrl,
                   is_featured: formData.get('isFeatured') === 'on',
                   is_trending: formData.get('isTrending') === 'on',
                   is_active: formData.get('isActive') === 'on'
                 }
                 handleUpdateProduct(selectedProduct.id, updateData)
               }}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-sm font-medium text-mountain-700 mb-2">Product Name</label>
                     <input
                       type="text"
                       name="name"
                       defaultValue={selectedProduct.name}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                       placeholder="Enter product name"
                       required
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-mountain-700 mb-2">Category</label>
                     <select 
                       name="category"
                       defaultValue={selectedProduct.categories?.slug || selectedProduct.category}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                     >
                       {categories.map(category => (
                         <option key={category.id} value={category.slug}>{category.name}</option>
                       ))}
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-mountain-700 mb-2">Price ($)</label>
                     <input
                       type="number"
                       name="price"
                       step="0.01"
                       defaultValue={selectedProduct.price}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                       placeholder="0.00"
                       required
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-mountain-700 mb-2">Original Price ($)</label>
                     <input
                       type="number"
                       name="originalPrice"
                       step="0.01"
                       defaultValue={selectedProduct.original_price || ''}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                       placeholder="0.00"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-mountain-700 mb-2">Stock Quantity</label>
                     <input
                       type="number"
                       name="stock"
                       defaultValue={selectedProduct.stock_quantity}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                       placeholder="0"
                       required
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-mountain-700 mb-2">Product Image URL</label>
                     <input
                       type="text"
                       name="imageUrl"
                       defaultValue={selectedProduct.image_url || ''}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                       placeholder="https://example.com/image.jpg or /images/products/..."
                     />
                     <p className="text-xs text-gray-500 mt-1">Enter a full URL or relative path. Leave empty if uploading a file below.</p>
                     {selectedProduct.image_url && (
                       <div className="mt-2">
                         <div className="flex items-center justify-between mb-2">
                           <p className="text-sm text-mountain-600">Current Image:</p>
                           <button
                             type="button"
                             onClick={() => {
                               if (confirm('Are you sure you want to delete this image?')) {
                                 handleDeleteProductImage(selectedProduct.id, selectedProduct.image_url)
                               }
                             }}
                             className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded border border-red-200 hover:border-red-300 transition-colors"
                           >
                             🗑️ Delete
                           </button>
                         </div>
                         <img 
                           src={selectedProduct.image_url} 
                           alt={selectedProduct.name}
                           className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                           onError={(e) => {
                             e.target.style.display = 'none';
                             e.target.nextSibling.style.display = 'block';
                           }}
                         />
                         <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 text-xs" style={{display: 'none'}}>
                           Image not found
                         </div>
                       </div>
                     )}
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-mountain-700 mb-2">Or Upload Image</label>
                     <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                       <div className="space-y-1 text-center">
                         <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                           <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                         </svg>
                         <div className="flex text-sm text-gray-600">
                           <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                             <span>Upload a file</span>
                             <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" />
                           </label>
                           <p className="pl-1">or drag and drop</p>
                         </div>
                         <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                       </div>
                     </div>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-mountain-700 mb-2">Status</label>
                     <select 
                       defaultValue={selectedProduct.status}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                     >
                       <option value="active">Active</option>
                       <option value="inactive">Inactive</option>
                       <option value="low">Low Stock</option>
                       <option value="out">Out of Stock</option>
                     </select>
                   </div>
                 </div>
                 <div className="flex items-center space-x-4">
                   <label className="flex items-center">
                     <input 
                       type="checkbox" 
                       name="isFeatured"
                       defaultChecked={selectedProduct.is_featured}
                       className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                     />
                     <span className="ml-2 text-sm text-mountain-700">Featured Product</span>
                   </label>
                   <label className="flex items-center">
                     <input 
                       type="checkbox" 
                       name="isTrending"
                       defaultChecked={selectedProduct.is_trending}
                       className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                     />
                     <span className="ml-2 text-sm text-mountain-700">Trending</span>
                   </label>
                   <label className="flex items-center">
                     <input 
                       type="checkbox" 
                       name="isActive"
                       defaultChecked={selectedProduct.is_active}
                       className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                     />
                     <span className="ml-2 text-sm text-mountain-700">Active</span>
                   </label>
                 </div>
                 <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                   <button
                     type="button"
                     onClick={() => setShowEditProduct(false)}
                     className="px-4 py-2 text-mountain-600 hover:text-mountain-800 transition-colors"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                   >
                     Update Product
                   </button>
                 </div>
               </form>
             </div>
           </div>
         </div>
       )}

       {/* View Category Modal */}
       {showViewCategory && selectedCategory && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
             <div className="p-6 border-b border-gray-200">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-semibold text-mountain-800">Category Details</h3>
                 <button
                   onClick={() => setShowViewCategory(false)}
                   className="text-mountain-400 hover:text-mountain-600"
                 >
                   <X className="w-6 h-6" />
                 </button>
               </div>
             </div>
             <div className="p-6">
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Category Name</label>
                   <p className="text-mountain-800 font-medium">{selectedCategory.name}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Description</label>
                   <p className="text-mountain-800 font-medium">{selectedCategory.description}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Slug</label>
                   <p className="text-mountain-800 font-medium">{selectedCategory.slug}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Product Count</label>
                   <p className="text-mountain-800 font-medium">{selectedCategory.productCount}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Status</label>
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                     selectedCategory.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                   }`}>
                     {selectedCategory.is_active ? 'Active' : 'Inactive'}
                   </span>
                 </div>
               </div>
               <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                 <button
                   onClick={() => setShowViewCategory(false)}
                   className="px-4 py-2 text-mountain-600 hover:text-mountain-800 transition-colors"
                 >
                   Close
                 </button>
                 <button
                   onClick={() => {
                     setShowViewCategory(false)
                     handleEditCategory(selectedCategory)
                   }}
                   className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                 >
                   Edit Category
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Edit Category Modal */}
       {showEditCategory && selectedCategory && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
             <div className="p-6 border-b border-gray-200">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-semibold text-mountain-800">Edit Category</h3>
                 <button
                   onClick={() => setShowEditCategory(false)}
                   className="text-mountain-400 hover:text-mountain-600"
                 >
                   <X className="w-6 h-6" />
                 </button>
               </div>
             </div>
             <div className="p-6">
               <form className="space-y-6" onSubmit={(e) => {
                 e.preventDefault()
                 const formData = new FormData(e.target)
                 const updateData = {
                   name: formData.get('name'),
                   description: formData.get('description'),
                   slug: formData.get('slug'),
                   is_active: formData.get('isActive') === 'on'
                 }
                 handleUpdateCategory(selectedCategory.id, updateData)
               }}>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Category Name</label>
                   <input
                     type="text"
                     name="name"
                     defaultValue={selectedCategory.name}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                     placeholder="Enter category name"
                     required
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Description</label>
                   <textarea
                     rows="3"
                     name="description"
                     defaultValue={selectedCategory.description}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                     placeholder="Enter category description"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Slug</label>
                   <input
                     type="text"
                     name="slug"
                     defaultValue={selectedCategory.slug}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                     placeholder="Enter category slug"
                     required
                   />
                 </div>
                 <div className="flex items-center">
                   <input
                     type="checkbox"
                     name="isActive"
                     id="category-active-edit"
                     defaultChecked={selectedCategory.is_active}
                     className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                   />
                   <label htmlFor="category-active-edit" className="ml-2 text-sm text-mountain-700">
                     Active Category
                   </label>
                 </div>
                 <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                   <button
                     type="button"
                     onClick={() => setShowEditCategory(false)}
                     className="px-4 py-2 text-mountain-600 hover:text-mountain-800 transition-colors"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                   >
                     Update Category
                   </button>
                 </div>
               </form>
             </div>
           </div>
         </div>
       )}

       {/* Add Hero Banner Modal */}
       {showHeroBanner && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
             <div className="p-6 border-b border-gray-200">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-semibold text-mountain-800">Add Hero Banner</h3>
                 <button
                   onClick={() => setShowHeroBanner(false)}
                   className="text-gray-400 hover:text-gray-600 transition-colors"
                 >
                   <X className="w-6 h-6" />
                 </button>
               </div>
             </div>
             <div className="p-6">
               <form className="space-y-6" onSubmit={async (e) => {
                 e.preventDefault()
                 const formData = new FormData(e.target)
                 const title = formData.get('title')
                 const subtitle = formData.get('subtitle')
                 const fileInput = e.target.querySelector('input[type="file"]')
                 
                 if (!fileInput || !fileInput.files || !fileInput.files[0]) {
                   alert('Please select an image file')
                   return
                 }
                 
                 const file = fileInput.files[0]
                 const result = await handleUploadHeroBanner(file, title, subtitle)
                 
                 if (result) {
                   setShowHeroBanner(false)
                   // Reset form
                   e.target.reset()
                 }
               }}>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Banner Title</label>
                   <input
                     type="text"
                     name="title"
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                     placeholder="e.g., Himalayan Spices"
                     required
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Banner Subtitle</label>
                   <input
                     type="text"
                     name="subtitle"
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                     placeholder="e.g., Pure & Authentic"
                     required
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Banner Image</label>
                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                     <input
                       type="file"
                       accept="image/*"
                       className="hidden"
                       id="hero-banner-upload"
                       required
                     />
                     <label htmlFor="hero-banner-upload" className="cursor-pointer">
                       <div className="text-gray-400 mb-2">
                         <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                         </svg>
                       </div>
                       <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                       <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                     </label>
                   </div>
                 </div>
                 <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                   <button
                     type="button"
                     onClick={() => setShowHeroBanner(false)}
                     className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                   >
                     Upload Banner
                   </button>
                 </div>
               </form>
             </div>
           </div>
         </div>
       )}

       {/* Edit Hero Banner Modal */}
       {showEditHeroBanner && selectedHeroBanner && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
             <div className="p-6 border-b border-gray-200">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-semibold text-mountain-800">Edit Hero Banner</h3>
                 <button
                   onClick={() => {
                     setShowEditHeroBanner(false)
                     setSelectedHeroBanner(null)
                   }}
                   className="text-gray-400 hover:text-gray-600 transition-colors"
                 >
                   <X className="w-6 h-6" />
                 </button>
               </div>
             </div>
             <div className="p-6">
               <form className="space-y-6" onSubmit={async (e) => {
                 e.preventDefault()
                 const formData = new FormData(e.target)
                 const title = formData.get('title')
                 const subtitle = formData.get('subtitle')
                 const fileInput = e.target.querySelector('input[type="file"]')
                 
                 const newImageFile = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null
                 
                 await handleUpdateHeroBanner(selectedHeroBanner.id, title, subtitle, newImageFile)
               }}>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Banner Title</label>
                   <input
                     type="text"
                     name="title"
                     defaultValue={selectedHeroBanner.title}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                     placeholder="e.g., Himalayan Spices"
                     required
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Banner Subtitle</label>
                   <input
                     type="text"
                     name="subtitle"
                     defaultValue={selectedHeroBanner.subtitle}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                     placeholder="e.g., Pure & Authentic"
                     required
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Current Image</label>
                   <div className="mb-4">
                     <img
                       src={selectedHeroBanner.image}
                       alt={selectedHeroBanner.title}
                       className="w-full h-32 object-cover rounded-lg border border-gray-200"
                     />
                   </div>
                   <div className="mt-2">
                     <div className="flex items-center justify-between mb-1">
                       <label className="block text-sm font-medium text-mountain-700">Current Image URL:</label>
                       <button
                         onClick={() => handleCopyUrl(selectedHeroBanner.image)}
                         className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                         title="Copy URL"
                       >
                         📋 Copy
                       </button>
                     </div>
                     <div className="bg-gray-50 rounded p-2 text-xs font-mono text-gray-700 break-all">
                       {selectedHeroBanner.image}
                     </div>
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-mountain-700 mb-2">Update Image (Optional)</label>
                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                     <input
                       type="file"
                       accept="image/*"
                       className="hidden"
                       id="edit-hero-banner-upload"
                     />
                     <label htmlFor="edit-hero-banner-upload" className="cursor-pointer">
                       <div className="text-gray-400 mb-2">
                         <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                         </svg>
                       </div>
                       <p className="text-sm text-gray-600 mb-1">Click to upload new image or drag and drop</p>
                       <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                     </label>
                   </div>
                 </div>
                 <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                   <button
                     type="button"
                     onClick={() => {
                       setShowEditHeroBanner(false)
                       setSelectedHeroBanner(null)
                     }}
                     className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                   >
                     Update Banner
                   </button>
                 </div>
               </form>
             </div>
           </div>
         </div>
       )}
     </div>
   )
 }

const AdminPage = () => {
  const { user, signInWithGoogle, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock data for demonstration
  const [products] = useState([
    { id: 1, name: 'Himalayan Black Pepper', category: 'Spices', price: 12.99, stock: 150, status: 'active', sales: 89 },
    { id: 2, name: 'Sacred Cinnamon', category: 'Spices', price: 18.99, stock: 75, status: 'active', sales: 67 },
    { id: 3, name: 'Mountain Garam Masala', category: 'Blends', price: 24.99, stock: 45, status: 'low', sales: 123 },
    { id: 4, name: 'Wild Himalayan Thyme', category: 'Herbs', price: 15.99, stock: 0, status: 'out', sales: 34 },
    { id: 5, name: 'Golden Turmeric', category: 'Spices', price: 14.99, stock: 200, status: 'active', sales: 156 }
  ])

  const [orders] = useState([
    { id: 'ORD-001', customer: 'John Doe', total: 45.97, status: 'completed', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Jane Smith', total: 32.50, status: 'processing', date: '2024-01-14' },
    { id: 'ORD-003', customer: 'Mike Johnson', total: 67.25, status: 'shipped', date: '2024-01-13' },
    { id: 'ORD-004', customer: 'Sarah Wilson', total: 28.99, status: 'pending', date: '2024-01-12' },
    { id: 'ORD-005', customer: 'David Brown', total: 89.75, status: 'completed', date: '2024-01-11' }
  ])

  const [analytics] = useState({
    totalSales: 15420.50,
    totalOrders: 234,
    totalCustomers: 189,
    averageOrder: 65.90,
    monthlyGrowth: 12.5,
    topProduct: 'Mountain Garam Masala',
    lowStock: 3
  })

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      low: 'bg-yellow-100 text-yellow-700',
      out: 'bg-red-100 text-red-700',
      completed: 'bg-green-100 text-green-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      pending: 'bg-yellow-100 text-yellow-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || product.status === filterStatus)
  )

  const filteredOrders = orders.filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || order.status === filterStatus)
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-mountain-800 mb-2">Admin Access</h1>
            <p className="text-mountain-600">Sign in to access the admin dashboard</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium text-gray-700">Sign in with Google</span>
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-mountain-500">
              Only authorized administrators can access this dashboard
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-mountain-800">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-mountain-600 hover:text-mountain-800 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <img 
                  src={user.photoURL || '/images/default-avatar.png'} 
                  alt="Admin" 
                  className="w-8 h-8 rounded-full"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-mountain-800">{user.displayName}</p>
                  <p className="text-xs text-mountain-600">{user.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-mountain-600 hover:text-red-600 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'products', label: 'Products', icon: Package },
                  { id: 'orders', label: 'Orders', icon: ShoppingCart },
                  { id: 'customers', label: 'Customers', icon: Users },
                  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'text-mountain-600 hover:bg-gray-50 hover:text-mountain-800'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </aside>

                     {/* Main Content */}
           <main className="flex-1">
             {activeTab === 'dashboard' && (
               <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                 <div className="text-center">
                   <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Shield className="w-8 h-8 text-white" />
                   </div>
                   <h2 className="text-2xl font-bold text-mountain-800 mb-4">Welcome to Admin Dashboard</h2>
                   <p className="text-mountain-600 mb-8 max-w-2xl mx-auto">
                     You have successfully logged in to the Himalayan Flavours Hub admin panel. 
                     This dashboard is ready for you to manage your e-commerce platform.
                   </p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                     <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                       <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                         <Package className="w-6 h-6 text-green-600" />
                       </div>
                       <h3 className="font-semibold text-mountain-800 mb-2">Products</h3>
                       <p className="text-sm text-mountain-600">Manage your product catalog</p>
                     </div>
                     
                     <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                       <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                         <ShoppingCart className="w-6 h-6 text-blue-600" />
                       </div>
                       <h3 className="font-semibold text-mountain-800 mb-2">Orders</h3>
                       <p className="text-sm text-mountain-600">Track customer orders</p>
                     </div>
                     
                     <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-6 border border-purple-200">
                       <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                         <Users className="w-6 h-6 text-purple-600" />
                       </div>
                       <h3 className="font-semibold text-mountain-800 mb-2">Customers</h3>
                       <p className="text-sm text-mountain-600">Manage customer data</p>
                     </div>
                     
                     <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-200">
                       <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                         <BarChart3 className="w-6 h-6 text-orange-600" />
                       </div>
                       <h3 className="font-semibold text-mountain-800 mb-2">Analytics</h3>
                       <p className="text-sm text-mountain-600">View business insights</p>
                     </div>
                   </div>
                   
                   <div className="mt-8 pt-8 border-t border-gray-200">
                     <p className="text-sm text-mountain-500">
                       Use the sidebar navigation to access different sections of the admin panel.
                     </p>
                   </div>
                 </div>
               </div>
             )}

             {activeTab === 'products' && (
               <ProductManagement />
             )}

             {activeTab === 'orders' && (
               <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                 <h2 className="text-lg font-semibold text-mountain-800 mb-4">Order Management</h2>
                 <p className="text-mountain-600">Order management features coming soon...</p>
               </div>
             )}

             {activeTab === 'customers' && (
               <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                 <h2 className="text-lg font-semibold text-mountain-800 mb-4">Customer Management</h2>
                 <p className="text-mountain-600">Customer management features coming soon...</p>
               </div>
             )}

             {activeTab === 'analytics' && (
               <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                 <h2 className="text-lg font-semibold text-mountain-800 mb-4">Analytics Dashboard</h2>
                 <p className="text-mountain-600">Advanced analytics features coming soon...</p>
               </div>
             )}

             {activeTab === 'settings' && (
               <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                 <h2 className="text-lg font-semibold text-mountain-800 mb-4">System Settings</h2>
                 <p className="text-mountain-600">System configuration options coming soon...</p>
               </div>
             )}
           </main>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
