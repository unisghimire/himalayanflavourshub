import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Package } from 'lucide-react'
import { accountingService } from '../../services/accountingService'

const BatchForm = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    batch_number: '',
    batch_name: '',
    description: '',
    production_date: new Date().toISOString().split('T')[0],
    status: 'active',
    total_quantity: '',
    unit: 'units'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate batch number if not provided
      const batchNumber = formData.batch_number || `BATCH-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      
      const batchData = {
        ...formData,
        batch_number: batchNumber,
        total_quantity: parseInt(formData.total_quantity) || 0
      }

      await accountingService.createBatch(batchData)
      onSuccess?.()
      onClose()
      resetForm()
    } catch (error) {
      console.error('Error creating batch:', error)
      alert('Error creating batch. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      batch_number: '',
      batch_name: '',
      description: '',
      production_date: new Date().toISOString().split('T')[0],
      status: 'active',
      total_quantity: '',
      unit: 'units'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-mountain-800">Create New Batch</h3>
                <p className="text-sm text-mountain-600">Set up a new production batch for tracking costs</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Batch Number */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Batch Number
                </label>
                <input
                  type="text"
                  value={formData.batch_number}
                  onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  placeholder="e.g., MANGO-2024-001 (auto-generated if empty)"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate</p>
              </div>

              {/* Batch Name */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Batch Name *
                </label>
                <input
                  type="text"
                  value={formData.batch_name}
                  onChange={(e) => setFormData({ ...formData, batch_name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  placeholder="e.g., Mango Pickle - January 2024"
                />
              </div>

              {/* Production Date */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Production Date *
                </label>
                <input
                  type="date"
                  value={formData.production_date}
                  onChange={(e) => setFormData({ ...formData, production_date: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Total Quantity */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Expected Quantity
                </label>
                <input
                  type="number"
                  value={formData.total_quantity}
                  onChange={(e) => setFormData({ ...formData, total_quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  placeholder="0"
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Unit
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  placeholder="jars, pieces, kg, etc."
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                placeholder="Describe this batch - ingredients, special notes, etc."
              />
            </div>

            {/* Batch Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Batch Information</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• This batch will be used to track all related expenses and income</p>
                <p>• You can add products to this batch after creation</p>
                <p>• All expenses linked to this batch will be included in profit calculations</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Creating...' : 'Create Batch'}</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default BatchForm
