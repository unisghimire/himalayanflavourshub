import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Package, AlertTriangle, DollarSign } from 'lucide-react'
import inventoryService from '../../services/inventoryService'

const InventoryItemForm = ({ isOpen, onClose, onSuccess, editingData, onOpenExpenseForm }) => {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [showAddExpenseOption, setShowAddExpenseOption] = useState(false)
  const [createdItem, setCreatedItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    sku: '',
    unit: 'kg',
    current_stock: 0,
    minimum_stock: 0,
    maximum_stock: 0,
    unit_cost: 0,
    supplier_name: '',
    supplier_contact: '',
    storage_location: '',
    expiry_date: '',
    is_active: true
  })

  useEffect(() => {
    if (isOpen) {
      loadCategories()
      if (editingData) {
        setFormData({
          name: editingData.name || '',
          description: editingData.description || '',
          category_id: editingData.category_id || '',
          sku: editingData.sku || '',
          unit: editingData.unit || 'kg',
          current_stock: editingData.current_stock || 0,
          minimum_stock: editingData.minimum_stock || 0,
          maximum_stock: editingData.maximum_stock || 0,
          unit_cost: editingData.unit_cost || 0,
          supplier_name: editingData.supplier_name || '',
          supplier_contact: editingData.supplier_contact || '',
          storage_location: editingData.storage_location || '',
          expiry_date: editingData.expiry_date || '',
          is_active: editingData.is_active !== undefined ? editingData.is_active : true
        })
      } else {
        resetForm()
      }
    }
  }, [isOpen, editingData])

  const loadCategories = async () => {
    try {
      const data = await inventoryService.getAllCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingData) {
        await inventoryService.updateItem(editingData.id, formData)
        onSuccess?.()
        onClose()
        resetForm()
      } else {
        const newItem = await inventoryService.createItem(formData)
        console.log('Created item:', newItem)
        setCreatedItem(newItem)
        setShowAddExpenseOption(true)
        console.log('Show add expense option:', true)
        // Don't call onSuccess immediately - let user choose to add expense or close
      }
    } catch (error) {
      console.error('Error saving inventory item:', error)
      alert('Error saving inventory item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category_id: '',
      sku: '',
      unit: 'kg',
      current_stock: 0,
      minimum_stock: 0,
      maximum_stock: 0,
      unit_cost: 0,
      supplier_name: '',
      supplier_contact: '',
      storage_location: '',
      expiry_date: '',
      is_active: true
    })
    setShowAddExpenseOption(false)
    setCreatedItem(null)
  }

  const handleAddExpense = () => {
    if (onOpenExpenseForm && createdItem) {
      onOpenExpenseForm(createdItem)
      onSuccess?.() // Call onSuccess to refresh the inventory list
      onClose()
      resetForm()
    }
  }

  const handleSkipExpense = () => {
    onSuccess?.() // Call onSuccess to refresh the inventory list
    onClose()
    resetForm()
  }

  if (!isOpen) return null

  console.log('InventoryItemForm render:', { showAddExpenseOption, createdItem })

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
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-mountain-800">
                  {editingData ? 'Edit Inventory Item' : 'Add New Inventory Item'}
                </h3>
                <p className="text-sm text-mountain-600">
                  {editingData ? 'Update inventory item details' : 'Add a new item to your inventory'}
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

          {!showAddExpenseOption ? (
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-mountain-800 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="e.g., Fresh Tomatoes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="e.g., TOM-001"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="Item description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Unit *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="pieces">Pieces</option>
                    <option value="liters">Liters</option>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="boxes">Boxes</option>
                    <option value="bags">Bags</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Stock Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-mountain-800 mb-4">Stock Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.current_stock}
                    onChange={(e) => setFormData({ ...formData, current_stock: parseFloat(e.target.value) || 0 })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Minimum Stock
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.minimum_stock}
                    onChange={(e) => setFormData({ ...formData, minimum_stock: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Maximum Stock
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.maximum_stock}
                    onChange={(e) => setFormData({ ...formData, maximum_stock: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Unit Cost (Rs.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unit_cost}
                    onChange={(e) => setFormData({ ...formData, unit_cost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Storage Location
                  </label>
                  <input
                    type="text"
                    value={formData.storage_location}
                    onChange={(e) => setFormData({ ...formData, storage_location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="e.g., Cold Storage A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  />
                </div>
              </div>
            </div>

            {/* Supplier Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-mountain-800 mb-4">Supplier Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    value={formData.supplier_name}
                    onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="e.g., Local Vegetable Market"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Supplier Contact
                  </label>
                  <input
                    type="text"
                    value={formData.supplier_contact}
                    onChange={(e) => setFormData({ ...formData, supplier_contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="e.g., +977-1234567890"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-mountain-800 mb-4">Status</h4>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 text-mountain-600 focus:ring-mountain-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-mountain-700">
                  Active (Item is available for use)
                </label>
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
                <span>{loading ? 'Saving...' : editingData ? 'Update Item' : 'Add Item'}</span>
              </button>
            </div>
          </form>
          ) : (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Inventory Item Created Successfully!
                </h3>
                <p className="text-green-700 mb-4">
                  <strong>{createdItem?.name}</strong> has been added to your inventory.
                </p>
                <p className="text-sm text-green-600">
                  Would you like to add an expense entry for this item?
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddExpense}
                  className="flex-1 px-6 py-3 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <DollarSign className="w-5 h-5" />
                  <span>Add Expense Entry</span>
                </button>
                <button
                  onClick={handleSkipExpense}
                  className="flex-1 px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Skip for Now
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default InventoryItemForm
