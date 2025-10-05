import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Package, DollarSign, Plus, Trash2, AlertTriangle } from 'lucide-react'
import inventoryService from '../../services/inventoryService'
import { accountingService } from '../../services/accountingService'

const UnifiedInventoryExpenseForm = ({ isOpen, onClose, onSuccess, editingData }) => {
  const [loading, setLoading] = useState(false)
  const [accountingHeads, setAccountingHeads] = useState([])
  const [expenseCategories, setExpenseCategories] = useState([])
  const [batches, setBatches] = useState([])
  const [categories, setCategories] = useState([])
  
  const [formData, setFormData] = useState({
    // Inventory Item Details
    name: '',
    description: '',
    category_id: '',
    sku: '',
    unit: 'kg',
    minimum_stock: '',
    maximum_stock: '',
    supplier_name: '',
    supplier_contact: '',
    storage_location: '',
    expiry_date: '',
    
    // Stock Entry Details
    quantity: '',
    unit_cost: '',
    total_cost: '',
    
    // Expense Details
    accounting_head_id: '',
    expense_category_id: '',
    batch_id: '',
    expense_date: new Date().toISOString().split('T')[0],
    vendor_name: '',
    payment_method: '',
    reference_number: '',
    notes: ''
  })

  const [isNewItem, setIsNewItem] = useState(true)
  const [existingItems, setExistingItems] = useState([])
  const [selectedExistingItem, setSelectedExistingItem] = useState(null)

  useEffect(() => {
    if (isOpen) {
      loadInitialData()
      if (editingData) {
        // Populate form with editing data
        setFormData({
          ...formData,
          ...editingData
        })
        setIsNewItem(false)
      } else {
        resetForm()
        setIsNewItem(true)
      }
    }
  }, [isOpen, editingData])

  const loadInitialData = async () => {
    try {
      const [heads, batchesData, categoriesData, itemsData] = await Promise.all([
        accountingService.getAllAccountingHeads(),
        accountingService.getAllBatches(),
        inventoryService.getAllCategories(),
        inventoryService.getAllItems()
      ])

      setAccountingHeads(heads)
      setBatches(batchesData)
      setCategories(categoriesData)
      setExistingItems(itemsData)
    } catch (error) {
      console.error('Error loading initial data:', error)
    }
  }

  const loadExpenseCategories = async (accountingHeadId) => {
    if (!accountingHeadId) {
      setExpenseCategories([])
      return
    }

    try {
      const data = await accountingService.getExpenseCategoriesByHead(accountingHeadId)
      setExpenseCategories(data)
    } catch (error) {
      console.error('Error loading expense categories:', error)
    }
  }

  const handleAccountingHeadChange = (e) => {
    const headId = e.target.value
    setFormData({ ...formData, accounting_head_id: headId, expense_category_id: '' })
    loadExpenseCategories(headId)
  }

  const handleExistingItemSelect = (item) => {
    setSelectedExistingItem(item)
    setFormData({
      ...formData,
      name: item.name,
      description: item.description,
      category_id: item.category_id,
      sku: item.sku,
      unit: item.unit,
      minimum_stock: item.minimum_stock,
      maximum_stock: item.maximum_stock,
      supplier_name: item.supplier_name,
      supplier_contact: item.supplier_contact,
      storage_location: item.storage_location,
      unit_cost: item.unit_cost
    })
  }

  const calculateTotalCost = () => {
    const quantity = parseFloat(formData.quantity) || 0
    const unitCost = parseFloat(formData.unit_cost) || 0
    return quantity * unitCost
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let inventoryItemId

      if (isNewItem) {
        // Create new inventory item
        const itemData = {
          name: formData.name,
          description: formData.description,
          category_id: formData.category_id,
          sku: formData.sku,
          unit: formData.unit,
          minimum_stock: parseFloat(formData.minimum_stock) || 0,
          maximum_stock: parseFloat(formData.maximum_stock) || 0,
          supplier_name: formData.supplier_name,
          supplier_contact: formData.supplier_contact,
          storage_location: formData.storage_location,
          expiry_date: formData.expiry_date || null,
          unit_cost: parseFloat(formData.unit_cost) || 0
        }

        const newItem = await inventoryService.createItem(itemData)
        inventoryItemId = newItem.id

        // Add stock to the new item
        await inventoryService.addStock(
          inventoryItemId,
          parseFloat(formData.quantity),
          parseFloat(formData.unit_cost),
          {
            type: 'purchase',
            notes: 'Initial stock entry',
            supplier: formData.supplier_name
          }
        )
      } else {
        // Use existing item
        inventoryItemId = selectedExistingItem.id

        // Add stock to existing item
        await inventoryService.addStock(
          inventoryItemId,
          parseFloat(formData.quantity),
          parseFloat(formData.unit_cost),
          {
            type: 'purchase',
            notes: formData.notes || 'Stock addition',
            supplier: formData.supplier_name
          }
        )
      }

      // Create expense entry
      const expenseData = {
        accounting_head_id: formData.accounting_head_id,
        expense_category_id: formData.expense_category_id,
        batch_id: formData.batch_id,
        description: `${formData.name} - ${formData.quantity} ${formData.unit} - Rs.${calculateTotalCost().toFixed(2)} | inventory_item_id:${inventoryItemId}`,
        amount: calculateTotalCost(),
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        expense_date: formData.expense_date,
        vendor_name: formData.vendor_name,
        payment_method: formData.payment_method,
        reference_number: formData.reference_number,
        notes: formData.notes
      }

      const expense = await accountingService.createExpense(expenseData)

      // Link inventory to expense by updating invoiced quantity
      await inventoryService.addInvoicedQuantity(inventoryItemId, parseFloat(formData.quantity), {
        type: 'expense',
        id: expense.id,
        batchId: formData.batch_id,
        notes: `Invoiced in expense: ${formData.name}`
      })

      onSuccess?.()
      onClose()
      resetForm()
    } catch (error) {
      console.error('Error saving inventory and expense:', error)
      alert('Error saving data. Please try again.')
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
      minimum_stock: '',
      maximum_stock: '',
      supplier_name: '',
      supplier_contact: '',
      storage_location: '',
      expiry_date: '',
      quantity: '',
      unit_cost: '',
      total_cost: '',
      accounting_head_id: '',
      expense_category_id: '',
      batch_id: '',
      expense_date: new Date().toISOString().split('T')[0],
      vendor_name: '',
      payment_method: '',
      reference_number: '',
      notes: ''
    })
    setSelectedExistingItem(null)
    setIsNewItem(true)
  }

  const formatCurrency = (amount) => {
    return `Rs.${new Intl.NumberFormat('en-NP', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-mountain-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-mountain-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-mountain-800">
                  {editingData ? 'Edit Inventory & Expense' : 'Add Inventory & Expense'}
                </h3>
                <p className="text-sm text-mountain-600">
                  {editingData ? 'Update inventory item and expense details' : 'Enter inventory item and expense details in one form'}
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
            {/* Item Selection */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-mountain-800 mb-4">Item Selection</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Item Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="itemType"
                        value="new"
                        checked={isNewItem}
                        onChange={() => setIsNewItem(true)}
                        className="mr-2"
                      />
                      New Item
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="itemType"
                        value="existing"
                        checked={!isNewItem}
                        onChange={() => setIsNewItem(false)}
                        className="mr-2"
                      />
                      Existing Item
                    </label>
                  </div>
                </div>

                {!isNewItem && (
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">
                      Select Existing Item
                    </label>
                    <select
                      value={selectedExistingItem?.id || ''}
                      onChange={(e) => {
                        const item = existingItems.find(i => i.id === e.target.value)
                        if (item) handleExistingItemSelect(item)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    >
                      <option value="">Select an item</option>
                      {existingItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} - Stock: {item.current_stock} {item.unit} | Cost: {formatCurrency(item.unit_cost)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Inventory Item Details */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-mountain-800 mb-4 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Inventory Item Details
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
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

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Unit *
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="kg, pieces, liters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Minimum Stock
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minimum_stock}
                    onChange={(e) => setFormData({ ...formData, minimum_stock: e.target.value })}
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
                    step="0.01"
                    value={formData.maximum_stock}
                    onChange={(e) => setFormData({ ...formData, maximum_stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="0"
                  />
                </div>

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
                    placeholder="Phone number"
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
                    placeholder="e.g., Cold Storage Room A"
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

              <div className="mt-4">
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  placeholder="Additional details about the item"
                />
              </div>
            </div>

            {/* Stock Entry Details */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-mountain-800 mb-4 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Stock Entry Details
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="Enter quantity"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Unit Cost (Rs.) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unit_cost}
                    onChange={(e) => setFormData({ ...formData, unit_cost: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="Enter unit cost"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Total Cost
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-lg font-semibold text-mountain-800">
                    {formatCurrency(calculateTotalCost())}
                  </div>
                </div>
              </div>
            </div>

            {/* Expense Details */}
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-mountain-800 mb-4 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Expense Details
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Accounting Head *
                  </label>
                  <select
                    value={formData.accounting_head_id}
                    onChange={handleAccountingHeadChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  >
                    <option value="">Select Category</option>
                    {accountingHeads.map((head) => (
                      <option key={head.id} value={head.id}>{head.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Expense Category
                  </label>
                  <select
                    value={formData.expense_category_id}
                    onChange={(e) => setFormData({ ...formData, expense_category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  >
                    <option value="">Select Sub-category</option>
                    {expenseCategories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Expense Date *
                  </label>
                  <input
                    type="date"
                    value={formData.expense_date}
                    onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    value={formData.vendor_name}
                    onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="e.g., Local Vegetable Market"
                  />
                </div>

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
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    value={formData.reference_number}
                    onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="Invoice number, receipt number, etc."
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-mountain-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  placeholder="Additional notes or comments"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-mountain-50 border border-mountain-200 rounded-lg p-4">
              <h4 className="text-md font-semibold text-mountain-800 mb-4">Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-mountain-600">Item: <span className="font-medium">{formData.name || 'Not specified'}</span></p>
                  <p className="text-sm text-mountain-600">Quantity: <span className="font-medium">{formData.quantity || '0'} {formData.unit}</span></p>
                  <p className="text-sm text-mountain-600">Unit Cost: <span className="font-medium">{formatCurrency(parseFloat(formData.unit_cost) || 0)}</span></p>
                </div>
                <div>
                  <p className="text-sm text-mountain-600">Total Cost: <span className="font-medium text-lg">{formatCurrency(calculateTotalCost())}</span></p>
                  <p className="text-sm text-mountain-600">Date: <span className="font-medium">{formData.expense_date}</span></p>
                </div>
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
                <span>{loading ? 'Saving...' : 'Save Inventory & Expense'}</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default UnifiedInventoryExpenseForm
