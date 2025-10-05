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
  X,
  ShoppingCart,
  Receipt
} from 'lucide-react'
import inventoryService from '../../services/inventoryService'
import { accountingService } from '../../services/accountingService'
import ExcelLikeInventoryForm from './ExcelLikeInventoryForm'

const SimplifiedAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [inventoryItems, setInventoryItems] = useState([])
  const [categories, setCategories] = useState([])
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState({
    totalItems: 0,
    lowStockCount: 0,
    expiryCount: 0,
    totalValue: 0,
    totalExpenses: 0,
    lowStockItems: [],
    expiryItems: []
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showSimpleForm, setShowSimpleForm] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [itemsData, categoriesData, dashboardData, expensesData] = await Promise.all([
        inventoryService.getAllItems(),
        inventoryService.getAllCategories(),
        inventoryService.getSimplifiedDashboardData(),
        accountingService.getExpenses()
      ])

      setInventoryItems(itemsData || [])
      setCategories(categoriesData || [])
      setExpenses(expensesData || [])
      setSummary({
        totalItems: dashboardData?.total_items || 0,
        lowStockCount: dashboardData?.low_stock_count || 0,
        expiryCount: dashboardData?.expiry_count || 0,
        totalValue: dashboardData?.total_inventory_value || 0,
        totalExpenses: dashboardData?.total_expenses || 0,
        lowStockItems: dashboardData?.low_stock_items || [],
        expiryItems: dashboardData?.expiry_items || []
      })
    } catch (error) {
      console.error('Error loading data:', error)
      setInventoryItems([])
      setCategories([])
      setExpenses([])
      setSummary({
        totalItems: 0,
        lowStockCount: 0,
        expiryCount: 0,
        totalValue: 0,
        totalExpenses: 0,
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
    setShowSimpleForm(true)
  }

  const handleFormSuccess = () => {
    setShowSimpleForm(false)
    loadInitialData()
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
            <h2 className="text-2xl font-bold text-mountain-800">Simplified Inventory & Expense Management</h2>
            <p className="text-mountain-600 mt-1">Manage inventory items and expenses in one unified interface</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleAddItem}
              className="bg-mountain-600 text-white px-4 py-2 rounded-lg hover:bg-mountain-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Items (Excel Style)</span>
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
              <p className="text-sm font-medium text-mountain-600">Total Value</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(summary.totalValue)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
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
              <p className="text-sm font-medium text-mountain-600">Total Expenses</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(summary.totalExpenses)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6 text-red-600" />
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
              { id: 'expenses', name: 'Recent Expenses', icon: Receipt }
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
              <h3 className="text-lg font-semibold text-mountain-800">Business Overview</h3>
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

                {/* Recent Expenses */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-blue-800 mb-3">Recent Expenses</h4>
                  {expenses.slice(0, 5).map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center text-sm mb-2">
                      <span className="text-blue-700">{expense.description?.split(' - ')[0] || 'Expense'}</span>
                      <span className="text-blue-600 font-medium">{formatCurrency(expense.amount)}</span>
                    </div>
                  ))}
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
                            <button className="text-mountain-600 hover:text-mountain-900">
                              <Eye className="w-4 h-4" />
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

          {/* Recent Expenses Tab */}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-mountain-800">Recent Expenses</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.slice(0, 20).map((expense) => (
                      <tr key={expense.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                          {new Date(expense.expense_date).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-sm text-mountain-900">{expense.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                          {expense.accounting_heads?.name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                          <div className="flex space-x-2">
                            <button className="text-mountain-600 hover:text-mountain-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-mountain-600 hover:text-mountain-900">
                              <Edit className="w-4 h-4" />
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
        </div>
      </div>

      {/* Excel-like Form Modal */}
      {showSimpleForm && (
        <ExcelLikeInventoryForm
          isOpen={showSimpleForm}
          onClose={() => setShowSimpleForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}

export default SimplifiedAdminDashboard
