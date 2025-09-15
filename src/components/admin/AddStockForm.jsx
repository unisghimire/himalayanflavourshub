import React, { useState, useEffect } from 'react'
import { X, Save, Package } from 'lucide-react'
import inventoryService from '../../services/inventoryService'

const AddStockForm = ({ isOpen, onClose, onSuccess, selectedItem, inventoryItems = [] }) => {
  const [loading, setLoading] = useState(false)
  const [currentItem, setCurrentItem] = useState(selectedItem)
  const [formData, setFormData] = useState({
    quantity: '',
    unit_cost: '',
    supplier_name: '',
    notes: '',
    reference_type: 'purchase'
  })

  useEffect(() => {
    if (isOpen) {
      if (selectedItem) {
        setCurrentItem(selectedItem)
        setFormData({
          quantity: '',
          unit_cost: selectedItem.unit_cost || '',
          supplier_name: selectedItem.supplier_name || '',
          notes: '',
          reference_type: 'purchase'
        })
      } else {
        setCurrentItem(null)
        setFormData({
          quantity: '',
          unit_cost: '',
          supplier_name: '',
          notes: '',
          reference_type: 'purchase'
        })
      }
    }
  }, [isOpen, selectedItem])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await inventoryService.addStock(
        currentItem.id,
        parseFloat(formData.quantity),
        parseFloat(formData.unit_cost),
        {
          type: formData.reference_type,
          notes: formData.notes,
          supplier: formData.supplier_name
        }
      )
      
      onSuccess?.()
      onClose()
      resetForm()
    } catch (error) {
      console.error('Error adding stock:', error)
      alert('Error adding stock. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      quantity: '',
      unit_cost: '',
      supplier_name: '',
      notes: '',
      reference_type: 'purchase'
    })
  }

  const formatCurrency = (amount) => {
    return `Rs.${new Intl.NumberFormat('en-NP', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)}`
  }

  if (!isOpen) return null

  // If no item is selected, show item selection
  if (!currentItem) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-mountain-800">Add Stock</h3>
            <p className="text-sm text-mountain-600">Select an inventory item to add stock</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
          {inventoryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentItem(item)}
              className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 text-left transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-mountain-900">{item.name}</div>
                  <div className="text-sm text-mountain-600">
                    Current: {item.current_stock} {item.unit} | Cost: Rs.{item.unit_cost}
                  </div>
                </div>
                <div className="text-green-600">
                  <Package className="w-5 h-5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-mountain-800">Add Stock</h3>
          <p className="text-sm text-mountain-600">
            Adding stock to: <span className="font-medium">{currentItem.name}</span>
          </p>
        </div>
        <button
          onClick={() => setCurrentItem(null)}
          className="ml-auto text-sm text-mountain-600 hover:text-mountain-800"
        >
          Change Item
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Current Stock:</span>
            <span className="ml-2 font-medium">{currentItem.current_stock} {currentItem.unit}</span>
          </div>
          <div>
            <span className="text-gray-600">Current Unit Cost:</span>
            <span className="ml-2 font-medium">{formatCurrency(currentItem.unit_cost)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-1">
              Quantity to Add *
            </label>
            <input
              type="number"
              step="0.001"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter quantity"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-1">
              Unit Cost *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.unit_cost}
              onChange={(e) => setFormData({ ...formData, unit_cost: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter unit cost"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-1">
              Supplier Name
            </label>
            <input
              type="text"
              value={formData.supplier_name}
              onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter supplier name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-1">
              Reference Type
            </label>
            <select
              value={formData.reference_type}
              onChange={(e) => setFormData({ ...formData, reference_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="purchase">Purchase</option>
              <option value="transfer">Transfer</option>
              <option value="adjustment">Adjustment</option>
              <option value="return">Return</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-mountain-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            rows="3"
            placeholder="Enter any additional notes"
          />
        </div>

        {formData.quantity && formData.unit_cost && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-800">Total Cost:</span>
              <span className="text-lg font-bold text-green-900">
                {formatCurrency(parseFloat(formData.quantity) * parseFloat(formData.unit_cost))}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-green-700">New Stock Level:</span>
              <span className="text-sm font-medium text-green-800">
                {currentItem.current_stock + parseFloat(formData.quantity || 0)} {currentItem.unit}
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Add Stock</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddStockForm
