import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Layers } from 'lucide-react'
import { accountingService } from '../../services/accountingService'

const SimpleBatchForm = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [batchCategories, setBatchCategories] = useState([])
  const [formData, setFormData] = useState({
    batch_category_id: '',
    description: '',
    production_date: new Date().toISOString().split('T')[0]
  })
  const [generatedBatchName, setGeneratedBatchName] = useState('')
  const [isGeneratingBatchName, setIsGeneratingBatchName] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const loadData = async () => {
    try {
      console.log('Loading batch categories...')
      const batchCategoriesData = await accountingService.getAllBatchCategories()
      console.log('Batch categories loaded:', batchCategoriesData)
      setBatchCategories(batchCategoriesData)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const generateBatchName = async (categoryId) => {
    if (!categoryId) {
      setGeneratedBatchName('')
      return
    }

    setIsGeneratingBatchName(true)
    try {
      const batchNumber = await accountingService.generateBatchNumber(categoryId)
      const batchCategory = batchCategories.find(cat => cat.id === categoryId)
      const batchName = `${batchNumber} - ${batchCategory?.name || 'Unknown'}`
      setGeneratedBatchName(batchName)
    } catch (error) {
      console.error('Error generating batch name:', error)
      setGeneratedBatchName('')
    } finally {
      setIsGeneratingBatchName(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Use the already generated batch name
      const batchNumber = generatedBatchName.split(' - ')[0] // Extract number from generated name
      
      const batchData = {
        batch_number: batchNumber,
        batch_name: generatedBatchName,
        description: formData.description,
        production_date: formData.production_date,
        batch_category_id: formData.batch_category_id,
        status: 'active',
        total_quantity: 0,
        unit: 'units'
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
      batch_category_id: '',
      description: '',
      production_date: new Date().toISOString().split('T')[0]
    })
    setGeneratedBatchName('')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Layers className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Batch
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch Category *
              </label>
              <select
                name="batch_category_id"
                value={formData.batch_category_id}
                onChange={(e) => {
                  handleInputChange(e)
                  generateBatchName(e.target.value)
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
                required
              >
                <option value="">Select batch category</option>
                {batchCategories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch Name
              </label>
              <div className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded text-gray-600">
                {isGeneratingBatchName ? 'Generating batch name...' : (generatedBatchName || 'Select a category to generate batch name')}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Production Date
              </label>
              <input
                type="date"
                name="production_date"
                value={formData.production_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
                placeholder="Enter batch description (optional)"
                rows={3}
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Batch number and name will be generated automatically based on the selected category.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.batch_category_id}
                className="flex items-center space-x-2 px-4 py-2 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{loading ? 'Creating...' : 'Create Batch'}</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default SimpleBatchForm
