import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Package, 
  DollarSign,
  Calendar,
  BarChart3
} from 'lucide-react'
import { accountingService } from '../../services/accountingService'

const ProductCostAnalysis = () => {
  const [productCosts, setProductCosts] = useState([])
  const [productSummary, setProductSummary] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    productName: '',
    accountingHead: '',
    dateFrom: '',
    dateTo: ''
  })

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const [costsData, summaryData] = await Promise.all([
        accountingService.getProductCostAnalysis(filters),
        accountingService.getProductCostSummary(filters)
      ])

      setProductCosts(costsData)
      setProductSummary(summaryData)
    } catch (error) {
      console.error('Error loading product cost data:', error)
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN')
  }

  const getAccountingHeadColor = (head) => {
    const colors = {
      'Raw Materials': 'bg-green-100 text-green-800',
      'Packaging Materials': 'bg-blue-100 text-blue-800',
      'Labor Costs': 'bg-purple-100 text-purple-800',
      'Utilities': 'bg-yellow-100 text-yellow-800',
      'Transportation': 'bg-orange-100 text-orange-800'
    }
    return colors[head] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-mountain-800">Product Cost Analysis</h2>
            <p className="text-mountain-600 mt-1">Track costs by individual products and ingredients</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-2">Search Product</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="e.g., Tomato, Ginger, Oil"
                value={filters.productName}
                onChange={(e) => setFilters({ ...filters, productName: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-2">Accounting Head</label>
            <select
              value={filters.accountingHead}
              onChange={(e) => setFilters({ ...filters, accountingHead: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
            >
              <option value="">All Categories</option>
              <option value="Raw Materials">Raw Materials</option>
              <option value="Packaging Materials">Packaging Materials</option>
              <option value="Labor Costs">Labor Costs</option>
              <option value="Utilities">Utilities</option>
              <option value="Transportation">Transportation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
            />
          </div>
        </div>
      </div>

      {/* Product Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productSummary.slice(0, 4).map((product, index) => (
          <motion.div 
            key={product.product_name}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-mountain-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-mountain-600" />
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAccountingHeadColor(product.accounting_head)}`}>
                {product.accounting_head}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-mountain-800 mb-2">{product.product_name}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-mountain-600">Total Cost:</span>
                <span className="text-sm font-semibold text-mountain-800">{formatCurrency(product.total_cost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-mountain-600">Quantity:</span>
                <span className="text-sm text-mountain-800">{product.total_quantity} {product.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-mountain-600">Avg Unit Cost:</span>
                <span className="text-sm text-mountain-800">{formatCurrency(product.avg_unit_cost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-mountain-600">Transactions:</span>
                <span className="text-sm text-mountain-800">{product.transaction_count}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Product Costs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-mountain-800">Detailed Product Costs</h3>
          <p className="text-sm text-mountain-600 mt-1">Individual transactions for each product</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productCosts.map((cost) => (
                <tr key={cost.expense_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-mountain-100 rounded-lg flex items-center justify-center mr-3">
                        <Package className="w-4 h-4 text-mountain-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-mountain-900">{cost.extracted_product_name}</div>
                        <div className="text-sm text-mountain-500">{cost.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAccountingHeadColor(cost.accounting_head)}`}>
                      {cost.accounting_head}
                    </span>
                    {cost.expense_category && (
                      <div className="text-xs text-mountain-500 mt-1">{cost.expense_category}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                    {cost.batch_number || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                    {cost.quantity} {cost.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-mountain-900">
                    {formatCurrency(cost.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                    {formatCurrency(cost.amount / cost.quantity)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                    {formatDate(cost.expense_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                    {cost.vendor_name || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {productCosts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No product costs found</h3>
            <p className="text-gray-500">Try adjusting your filters or add some expenses first.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCostAnalysis
