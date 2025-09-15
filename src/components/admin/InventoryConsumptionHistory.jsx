import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Package, Calendar, DollarSign, Hash, FileText, TrendingDown } from 'lucide-react'
import { accountingService } from '../../services/accountingService'

const InventoryConsumptionHistory = ({ isOpen, onClose, inventoryItem }) => {
  const [loading, setLoading] = useState(false)
  const [consumptionRecords, setConsumptionRecords] = useState([])
  const [summary, setSummary] = useState({
    totalConsumed: 0,
    totalCost: 0,
    batchCount: 0,
    averageCost: 0
  })

  useEffect(() => {
    if (isOpen && inventoryItem?.id) {
      loadConsumptionRecords()
    }
  }, [isOpen, inventoryItem])

  const loadConsumptionRecords = async () => {
    try {
      setLoading(true)
      const records = await accountingService.getInventoryConsumptionRecords(inventoryItem.id)
      setConsumptionRecords(records)
      
      // Calculate summary
      const totalConsumed = records.reduce((sum, record) => sum + parseFloat(record.quantity_consumed || 0), 0)
      const totalCost = records.reduce((sum, record) => sum + parseFloat(record.total_cost || 0), 0)
      const batchCount = new Set(records.map(record => record.batch_id)).size
      const averageCost = records.length > 0 ? totalCost / records.length : 0
      
      setSummary({
        totalConsumed,
        totalCost,
        batchCount,
        averageCost
      })
    } catch (error) {
      console.error('Error loading consumption records:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 2
    }).format(amount).replace('NPR', 'Rs.')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!isOpen || !inventoryItem) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-mountain-800">
                Consumption History - {inventoryItem.name}
              </h2>
              <p className="text-mountain-600">
                Track where and how much of this inventory item has been consumed
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Total Consumed</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {summary.totalConsumed.toFixed(2)} {inventoryItem.unit}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Total Cost</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {formatCurrency(summary.totalCost)}
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Hash className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-800">Batches Used</span>
              </div>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                {summary.batchCount}
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-800">Avg Cost</span>
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {formatCurrency(summary.averageCost)}
              </p>
            </div>
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

          {/* Close Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default InventoryConsumptionHistory
