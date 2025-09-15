import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, DollarSign } from 'lucide-react'
import { accountingService } from '../../services/accountingService'
import { productService } from '../../services/categoryService'

const IncomeForm = ({ isOpen, onClose, onSuccess, editingData }) => {
  const [loading, setLoading] = useState(false)
  const [accountingHeads, setAccountingHeads] = useState([])
  const [batches, setBatches] = useState([])
  const [products, setProducts] = useState([])

  const [formData, setFormData] = useState({
    accounting_head_id: '',
    batch_id: '',
    product_id: '',
    description: '',
    amount: '',
    quantity: '1',
    unit: 'units',
    income_date: new Date().toISOString().split('T')[0],
    customer_name: '',
    payment_method: '',
    reference_number: '',
    notes: ''
  })

  useEffect(() => {
    if (isOpen) {
      loadInitialData()
      if (editingData) {
        setFormData({
          accounting_head_id: editingData.accounting_head_id || '',
          description: editingData.description || '',
          amount: editingData.amount || '',
          income_date: editingData.income_date || new Date().toISOString().split('T')[0],
          customer_name: editingData.customer_name || '',
          order_id: editingData.order_id || '',
          payment_method: editingData.payment_method || '',
          notes: editingData.notes || ''
        })
      } else {
        resetForm()
      }
    }
  }, [isOpen, editingData])

  const loadInitialData = async () => {
    try {
      const [heads, batchesData, productsData] = await Promise.all([
        accountingService.getAllAccountingHeads(),
        accountingService.getAllBatches(),
        productService.getAllProducts()
      ])

      setAccountingHeads(heads)
      setBatches(batchesData)
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading initial data:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingData) {
        await accountingService.updateIncome(editingData.id, formData)
      } else {
        await accountingService.createIncome(formData)
      }
      onSuccess?.()
      onClose()
      resetForm()
    } catch (error) {
      console.error('Error saving income:', error)
      alert('Error saving income. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      accounting_head_id: '',
      batch_id: '',
      product_id: '',
      description: '',
      amount: '',
      quantity: '1',
      unit: 'units',
      income_date: new Date().toISOString().split('T')[0],
      customer_name: '',
      payment_method: '',
      reference_number: '',
      notes: ''
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-mountain-800">
                  {editingData ? 'Edit Income' : 'Add New Income'}
                </h3>
                <p className="text-sm text-mountain-600">
                  {editingData ? 'Update income details' : 'Enter income details for your pickle business'}
                </p>
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
              {/* Accounting Head */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Income Category *
                </label>
                <select
                  value={formData.accounting_head_id}
                  onChange={(e) => setFormData({ ...formData, accounting_head_id: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                >
                  <option value="">Select Category</option>
                  {accountingHeads.filter(head => head.type === 'income').map((head) => (
                    <option key={head.id} value={head.id}>{head.name}</option>
                  ))}
                </select>
              </div>

              {/* Batch */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Batch
                </label>
                <select
                  value={formData.batch_id}
                  onChange={(e) => setFormData({ ...formData, batch_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                >
                  <option value="">Select Batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>{batch.batch_number} - {batch.batch_name}</option>
                  ))}
                </select>
              </div>

              {/* Product */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Product
                </label>
                <select
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  placeholder="e.g., Mango Pickle Sales - Batch 1"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Amount (Rs.) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  placeholder="0.00"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  placeholder="1"
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

              {/* Income Date */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Income Date *
                </label>
                <input
                  type="date"
                  value={formData.income_date}
                  onChange={(e) => setFormData({ ...formData, income_date: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                />
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  placeholder="e.g., John Doe, ABC Restaurant"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                >
                  <option value="">Select Payment Method</option>
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="upi">UPI</option>
                  <option value="online">Online Payment</option>
                </select>
              </div>

              {/* Reference Number */}
              <div>
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={formData.reference_number}
                  onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  placeholder="Order number, invoice number, etc."
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                placeholder="Additional notes or comments"
              />
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
                <span>{loading ? 'Saving...' : 'Save Income'}</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default IncomeForm
