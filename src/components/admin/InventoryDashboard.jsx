import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  DollarSign,
  X
} from 'lucide-react'
import inventoryService from '../../services/inventoryService'
import InventoryItemForm from './InventoryItemForm'
import AddStockForm from './AddStockForm'
import InventoryAccountingHistory from './InventoryAccountingHistory'

const InventoryDashboard = ({ onSwitchToAccounting }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [inventoryItems, setInventoryItems] = useState([])
  const [categories, setCategories] = useState([])
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({
    totalItems: 0,
    lowStockCount: 0,
    expiryCount: 0,
    totalValue: 0,
    lowStockItems: [],
    expiryItems: []
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showAddItem, setShowAddItem] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [showAddStock, setShowAddStock] = useState(false)
  const [selectedItemForStock, setSelectedItemForStock] = useState(null)
  const [showAccountingHistory, setShowAccountingHistory] = useState(false)
  const [selectedItemForHistory, setSelectedItemForHistory] = useState(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [itemsData, categoriesData, summaryData] = await Promise.all([
        inventoryService.getAllItems(),
        inventoryService.getAllCategories(),
        inventoryService.getInventorySummary()
      ])

      setInventoryItems(itemsData || [])
      setCategories(categoriesData || [])
      setSummary({
        totalItems: summaryData?.totalItems || 0,
        lowStockCount: summaryData?.lowStockCount || 0,
        expiryCount: summaryData?.expiryCount || 0,
        totalValue: summaryData?.totalValue || 0,
        lowStockItems: summaryData?.lowStockItems || [],
        expiryItems: summaryData?.expiryItems || []
      })
    } catch (error) {
      console.error('Error loading inventory data:', error)
      // Set default values on error
      setInventoryItems([])
      setCategories([])
      setSummary({
        totalItems: 0,
        lowStockCount: 0,
        expiryCount: 0,
        totalValue: 0,
        lowStockItems: [],
        expiryItems: []
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return `Rs.${new Intl.NumberFormat('en-NP', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)}`
  }

  const handleAddItem = () => {
    console.log('Add Item clicked')
    setEditingItem(null)
    setShowAddItem(true)
  }

  const handleEditItem = (item) => {
    setEditingItem(item)
    setShowAddItem(true)
  }

  const handleFormSuccess = () => {
    setShowAddItem(false)
    setEditingItem(null)
    loadInitialData()
  }

  const handleAddStock = (item) => {
    console.log('Add Stock clicked for item:', item)
    setSelectedItemForStock(item)
    setShowAddStock(true)
  }

  const handleStockSuccess = () => {
    setShowAddStock(false)
    setSelectedItemForStock(null)
    loadInitialData()
  }

  const handleViewAccountingHistory = (item) => {
    setSelectedItemForHistory(item)
    setShowAccountingHistory(true)
  }

  const handleOpenExpenseForm = (inventoryItem) => {
    if (onSwitchToAccounting) {
      onSwitchToAccounting(inventoryItem)
    }
  }

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'low': return 'text-red-600 bg-red-100'
      case 'high': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-green-600 bg-green-100'
    }
  }

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || item.category_name === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-mountain-800">Inventory Management</h2>
            <p className="text-mountain-600 mt-1">Track raw materials, stock levels, and inventory transactions</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleAddItem}
              className="bg-mountain-600 text-white px-4 py-2 rounded-lg hover:bg-mountain-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
            <button 
              onClick={() => {
                if (inventoryItems.length === 0) {
                  alert('No inventory items available. Please add an item first.')
                  return
                }
                setSelectedItemForStock(null)
                setShowAddStock(true)
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stock</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          className="bg-white border border-gray-200 rounded-lg p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mountain-600">Total Items</p>
              <p className="text-xl font-bold text-mountain-800">{summary.totalItems}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white border border-gray-200 rounded-lg p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mountain-600">Low Stock</p>
              <p className="text-xl font-bold text-red-600">{summary.lowStockCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white border border-gray-200 rounded-lg p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mountain-600">Expiring Soon</p>
              <p className="text-xl font-bold text-yellow-600">{summary.expiryCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white border border-gray-200 rounded-lg p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mountain-600">Total Value</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(summary.totalValue)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'items', name: 'Inventory Items', icon: Package },
              { id: 'transactions', name: 'Transactions', icon: TrendingUp },
              { id: 'alerts', name: 'Alerts', icon: AlertTriangle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-mountain-500 text-mountain-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-mountain-800">Inventory Overview</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Items */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-red-800 mb-3">Low Stock Items</h4>
                  {summary.lowStockItems && summary.lowStockItems.length > 0 ? (
                    <div className="space-y-2">
                      {summary.lowStockItems.slice(0, 5).map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <span className="text-red-700">{item.name}</span>
                          <span className="text-red-600 font-medium">
                            {item.current_stock} {item.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-600 text-sm">No low stock items</p>
                  )}
                </div>

                {/* Expiring Items */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-yellow-800 mb-3">Expiring Soon</h4>
                  {summary.expiryItems && summary.expiryItems.length > 0 ? (
                    <div className="space-y-2">
                      {summary.expiryItems.slice(0, 5).map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <span className="text-yellow-700">{item.name}</span>
                          <span className="text-yellow-600 font-medium">
                            {item.days_until_expiry} days
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-yellow-600 text-sm">No items expiring soon</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Inventory Items Tab */}
          {activeTab === 'items' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-mountain-800">Inventory Items</h3>
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-mountain-100 rounded-lg flex items-center justify-center mr-3">
                              <Package className="w-4 h-4 text-mountain-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-mountain-900">{item.name}</div>
                              <div className="text-sm text-mountain-500">{item.sku || 'No SKU'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                          {item.category_name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                          <div className="space-y-1">
                            <div className="font-medium">Physical: {item.current_stock} {item.unit}</div>
                            <div className="text-xs text-gray-500">Invoiced: {item.invoiced_quantity || 0} {item.unit}</div>
                            <div className="text-xs font-medium text-green-600">
                              Available: {(parseFloat(item.current_stock || 0) - parseFloat(item.invoiced_quantity || 0)).toFixed(2)} {item.unit}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                          {formatCurrency(item.unit_cost)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-mountain-900">
                          {formatCurrency(item.current_stock * item.unit_cost)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStockStatusColor(item.stock_status)}`}>
                            {item.stock_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewAccountingHistory(item)}
                              className="text-mountain-600 hover:text-mountain-900"
                              title="View Accounting History"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditItem(item)}
                              className="text-mountain-600 hover:text-mountain-900"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleAddStock(item)}
                              className="text-green-600 hover:text-green-900"
                              title="Add Stock"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-mountain-800">Inventory Transactions</h3>
              <p className="text-mountain-600">Transaction history will be displayed here</p>
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-mountain-800">Inventory Alerts</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alerts */}
                <div className="bg-white border border-red-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-red-800 mb-4">Low Stock Alerts</h4>
                  {summary.lowStockItems && summary.lowStockItems.length > 0 ? (
                    <div className="space-y-3">
                      {summary.lowStockItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                          <div>
                            <div className="font-medium text-red-900">{item.name}</div>
                            <div className="text-sm text-red-600">
                              Current: {item.current_stock} {item.unit} | Min: {item.minimum_stock} {item.unit}
                            </div>
                          </div>
                          <div className="text-red-600 font-semibold">
                            -{item.shortage_quantity} {item.unit}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-600">No low stock alerts</p>
                  )}
                </div>

                {/* Expiry Alerts */}
                <div className="bg-white border border-yellow-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-4">Expiry Alerts</h4>
                  {summary.expiryItems && summary.expiryItems.length > 0 ? (
                    <div className="space-y-3">
                      {summary.expiryItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                          <div>
                            <div className="font-medium text-yellow-900">{item.name}</div>
                            <div className="text-sm text-yellow-600">
                              Stock: {item.current_stock} {item.unit}
                            </div>
                          </div>
                          <div className="text-yellow-600 font-semibold">
                            {item.days_until_expiry} days
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-yellow-600">No expiry alerts</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-mountain-800">
                  {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
                </h3>
                <button
                  onClick={() => setShowAddItem(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <InventoryItemForm
                isOpen={showAddItem}
                onClose={() => setShowAddItem(false)}
                onSuccess={handleFormSuccess}
                editingData={editingItem}
                onOpenExpenseForm={handleOpenExpenseForm}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Stock Modal */}
      {showAddStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-mountain-800">
                  Add Stock to Inventory Item
                </h3>
                <button
                  onClick={() => setShowAddStock(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <AddStockForm
                isOpen={showAddStock}
                onClose={() => setShowAddStock(false)}
                onSuccess={handleStockSuccess}
                selectedItem={selectedItemForStock}
                inventoryItems={inventoryItems}
              />
            </div>
          </div>
        </div>
      )}

      {/* Accounting History Modal */}
      {showAccountingHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <InventoryAccountingHistory
                inventoryItem={selectedItemForHistory}
                onClose={() => setShowAccountingHistory(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryDashboard
