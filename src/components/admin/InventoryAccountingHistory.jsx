import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Receipt, 
  Calendar, 
  DollarSign, 
  Package, 
  ArrowLeft,
  Filter,
  Search,
  TrendingDown,
  Hash
} from 'lucide-react'
import { accountingService } from '../../services/accountingService'

const InventoryAccountingHistory = ({ inventoryItem, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('accounting')
  const [accountingRecords, setAccountingRecords] = useState([])
  const [consumptionRecords, setConsumptionRecords] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    if (inventoryItem) {
      loadAccountingRecords()
    }
  }, [inventoryItem])

  const loadAccountingRecords = async () => {
    setLoading(true)
    try {
      const records = await accountingService.getInventoryAccountingRecords(inventoryItem.id)
      setAccountingRecords(records)
    } catch (error) {
      console.error('Error loading accounting records:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadConsumptionRecords = async () => {
    setLoading(true)
    try {
      const records = await accountingService.getInventoryConsumptionRecords(inventoryItem.id)
      setConsumptionRecords(records)
    } catch (error) {
      console.error('Error loading consumption records:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'consumption' && consumptionRecords.length === 0) {
      loadConsumptionRecords()
    }
  }

  const formatCurrency = (amount) => {
    return `Rs.${new Intl.NumberFormat('en-NP', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredRecords = accountingRecords.filter(record => {
    const matchesSearch = record.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.accounting_heads?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'expense' && record.amount < 0) ||
                         (filterType === 'income' && record.amount > 0)
    
    return matchesSearch && matchesFilter
  })

  const totalExpenses = accountingRecords
    .filter(record => record.amount < 0)
    .reduce((sum, record) => sum + Math.abs(record.amount), 0)

  const totalIncome = accountingRecords
    .filter(record => record.amount > 0)
    .reduce((sum, record) => sum + record.amount, 0)

  const netAmount = totalIncome - totalExpenses

  if (!inventoryItem) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-mountain-800">Inventory History</h2>
            <p className="text-mountain-600">
              {inventoryItem.name} - {inventoryItem.current_stock} {inventoryItem.unit}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange('accounting')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'accounting'
                ? 'border-mountain-500 text-mountain-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Receipt className="w-4 h-4" />
              <span>Accounting Records</span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange('consumption')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'consumption'
                ? 'border-mountain-500 text-mountain-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4" />
              <span>Consumption History</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'accounting' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          className="bg-red-50 border border-red-200 rounded-lg p-4"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Expenses</p>
              <p className="text-xl font-bold text-red-800">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-green-50 border border-green-200 rounded-lg p-4"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Income</p>
              <p className="text-xl font-bold text-green-800">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className={`border rounded-lg p-4 ${
            netAmount >= 0 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                netAmount >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                Net Amount
              </p>
              <p className={`text-xl font-bold ${
                netAmount >= 0 ? 'text-green-800' : 'text-red-800'
              }`}>
                {formatCurrency(Math.abs(netAmount))}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              netAmount >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <Package className={`w-5 h-5 ${
                netAmount >= 0 ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500 w-full"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
        >
          <option value="all">All Records</option>
          <option value="expense">Expenses Only</option>
          <option value="income">Income Only</option>
        </select>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-mountain-800">
            Accounting Records ({filteredRecords.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-mountain-200 border-t-mountain-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-mountain-600 mt-2">Loading records...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-8 text-center">
            <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No accounting records found for this inventory item.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {formatDate(record.expense_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-mountain-900">
                      <div className="max-w-xs truncate" title={record.description}>
                        {record.description?.replace(/\s*\|\s*inventory_item_id:\w+/, '')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                      {record.accounting_heads?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                      {record.batches?.batch_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      <span className={record.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                        {record.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(record.amount))}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                      {record.vendor_name || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </>
      )}

      {/* Consumption Tab Content */}
      {activeTab === 'consumption' && (
        <>
          {/* Consumption Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div 
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Consumed</p>
                  <p className="text-xl font-bold text-blue-800">
                    {consumptionRecords.reduce((sum, record) => sum + parseFloat(record.quantity_consumed || 0), 0).toFixed(2)} {inventoryItem.unit}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-green-50 border border-green-200 rounded-lg p-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Cost</p>
                  <p className="text-xl font-bold text-green-800">
                    {formatCurrency(consumptionRecords.reduce((sum, record) => sum + parseFloat(record.total_cost || 0), 0))}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-orange-50 border border-orange-200 rounded-lg p-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Batches Used</p>
                  <p className="text-xl font-bold text-orange-800">
                    {new Set(consumptionRecords.map(record => record.batch_id)).size}
                  </p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Hash className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-purple-50 border border-purple-200 rounded-lg p-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Avg Cost</p>
                  <p className="text-xl font-bold text-purple-800">
                    {formatCurrency(consumptionRecords.length > 0 
                      ? consumptionRecords.reduce((sum, record) => sum + parseFloat(record.total_cost || 0), 0) / consumptionRecords.length 
                      : 0
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Consumption Records Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-mountain-800">Consumption Records</h3>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mountain-600"></div>
              </div>
            ) : consumptionRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No consumption records found for this inventory item.</p>
                <p className="text-sm">This item hasn't been used in any production batches yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Batch
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {consumptionRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-mountain-100 rounded-lg flex items-center justify-center mr-3">
                              <Package className="w-4 h-4 text-mountain-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-mountain-900">
                                {record.batch_name}
                              </div>
                              <div className="text-sm text-mountain-500">
                                #{record.batch_number}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-mountain-900">
                            {record.quantity_consumed} {record.inventory_unit}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-mountain-900">
                            {formatCurrency(record.unit_cost)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-mountain-900">
                            {formatCurrency(record.total_cost)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-mountain-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(record.consumption_date)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-mountain-500">
                            {record.notes || 'No notes'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default InventoryAccountingHistory
