import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Plus, Trash2, Package, DollarSign } from 'lucide-react'
import inventoryService from '../../services/inventoryService'
import { accountingService } from '../../services/accountingService'

const SimpleInventoryExpenseList = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [accountingHeads, setAccountingHeads] = useState([])
  const [categories, setCategories] = useState([])
  const [batches, setBatches] = useState([])
  
  const [items, setItems] = useState([
    {
      id: 1,
      name: '',
      category_id: '',
      unit: 'kg',
      quantity: '',
      unit_cost: '',
      total_cost: '',
      supplier_name: '',
      accounting_head_id: '',
      batch_id: '',
      expense_date: new Date().toISOString().split('T')[0],
      notes: ''
    }
  ])

  useEffect(() => {
    if (isOpen) {
      loadInitialData()
    }
  }, [isOpen])

  const loadInitialData = async () => {
    try {
      const [heads, categoriesData, batchesData] = await Promise.all([
        accountingService.getAllAccountingHeads(),
        inventoryService.getAllCategories(),
        accountingService.getAllBatches()
      ])

      setAccountingHeads(heads)
      setCategories(categoriesData)
      setBatches(batchesData)
    } catch (error) {
      console.error('Error loading initial data:', error)
    }
  }

  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      name: '',
      category_id: '',
      unit: 'kg',
      quantity: '',
      unit_cost: '',
      total_cost: '',
      supplier_name: '',
      accounting_head_id: '',
      batch_id: '',
      expense_date: new Date().toISOString().split('T')[0],
      notes: ''
    }
    setItems([...items, newItem])
  }

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        
        // Calculate total cost when quantity or unit cost changes
        if (field === 'quantity' || field === 'unit_cost') {
          const quantity = parseFloat(updatedItem.quantity) || 0
          const unitCost = parseFloat(updatedItem.unit_cost) || 0
          updatedItem.total_cost = (quantity * unitCost).toFixed(2)
        }
        
        return updatedItem
      }
      return item
    }))
  }

  const calculateTotalAmount = () => {
    return items.reduce((sum, item) => sum + (parseFloat(item.total_cost) || 0), 0)
  }

  const handleSaveAll = async () => {
    setLoading(true)
    
    try {
      // Validate all items
      const validItems = items.filter(item => 
        item.name.trim() && 
        item.quantity && 
        item.unit_cost && 
        item.accounting_head_id
      )

      if (validItems.length === 0) {
        alert('Please fill in at least one complete item.')
        return
      }

      // Process each item
      for (const item of validItems) {
        // Create or find inventory item
        let inventoryItemId

        // Check if item already exists
        const existingItems = await inventoryService.getAllItems()
        const existingItem = existingItems.find(existing => 
          existing.name.toLowerCase() === item.name.toLowerCase()
        )

        if (existingItem) {
          // Use existing item
          inventoryItemId = existingItem.id
          
          // Add stock to existing item
          await inventoryService.addStock(
            inventoryItemId,
            parseFloat(item.quantity),
            parseFloat(item.unit_cost),
            {
              type: 'purchase',
              notes: item.notes || 'Stock addition',
              supplier: item.supplier_name
            }
          )
        } else {
          // Create new inventory item
          const itemData = {
            name: item.name,
            category_id: item.category_id,
            unit: item.unit,
            minimum_stock: 0,
            maximum_stock: 0,
            supplier_name: item.supplier_name,
            unit_cost: parseFloat(item.unit_cost)
          }

          const newItem = await inventoryService.createItem(itemData)
          inventoryItemId = newItem.id

          // Add stock to the new item
          await inventoryService.addStock(
            inventoryItemId,
            parseFloat(item.quantity),
            parseFloat(item.unit_cost),
            {
              type: 'purchase',
              notes: 'Initial stock entry',
              supplier: item.supplier_name
            }
          )
        }

        // Create expense entry
        const expenseData = {
          accounting_head_id: item.accounting_head_id,
          batch_id: item.batch_id,
          description: `${item.name} - ${item.quantity} ${item.unit} - Rs.${item.total_cost} | inventory_item_id:${inventoryItemId}`,
          amount: parseFloat(item.total_cost),
          quantity: parseFloat(item.quantity),
          unit: item.unit,
          expense_date: item.expense_date,
          vendor_name: item.supplier_name,
          notes: item.notes
        }

        const expense = await accountingService.createExpense(expenseData)

        // Link inventory to expense
        await inventoryService.addInvoicedQuantity(inventoryItemId, parseFloat(item.quantity), {
          type: 'expense',
          id: expense.id,
          batchId: item.batch_id,
          notes: `Invoiced in expense: ${item.name}`
        })
      }

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error saving items:', error)
      alert('Error saving items. Please try again.')
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-mountain-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-mountain-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-mountain-800">
                  Add Inventory Items & Expenses
                </h3>
                <p className="text-sm text-mountain-600">
                  Enter your inventory items and their expenses in one simple list
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

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-semibold text-mountain-800">
                    Item {index + 1}
                  </h4>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Item Name */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-mountain-700 mb-1">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                      placeholder="e.g., Fresh Tomatoes"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-1">
                      Category
                    </label>
                    <select
                      value={item.category_id}
                      onChange={(e) => updateItem(item.id, 'category_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-1">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                      placeholder="kg, pieces, liters"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                      placeholder="0"
                    />
                  </div>

                  {/* Unit Cost */}
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-1">
                      Unit Cost (Rs.) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unit_cost}
                      onChange={(e) => updateItem(item.id, 'unit_cost', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Total Cost (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-1">
                      Total Cost
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold text-mountain-800">
                      {formatCurrency(parseFloat(item.total_cost) || 0)}
                    </div>
                  </div>

                  {/* Supplier */}
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-1">
                      Supplier
                    </label>
                    <input
                      type="text"
                      value={item.supplier_name}
                      onChange={(e) => updateItem(item.id, 'supplier_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                      placeholder="Supplier name"
                    />
                  </div>

                  {/* Accounting Head */}
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-1">
                      Expense Category *
                    </label>
                    <select
                      value={item.accounting_head_id}
                      onChange={(e) => updateItem(item.id, 'accounting_head_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    >
                      <option value="">Select Category</option>
                      {accountingHeads.map((head) => (
                        <option key={head.id} value={head.id}>{head.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Batch */}
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-1">
                      Batch
                    </label>
                    <select
                      value={item.batch_id}
                      onChange={(e) => updateItem(item.id, 'batch_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    >
                      <option value="">Select Batch</option>
                      {batches.map((batch) => (
                        <option key={batch.id} value={batch.id}>{batch.batch_number} - {batch.batch_name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Expense Date */}
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={item.expense_date}
                      onChange={(e) => updateItem(item.id, 'expense_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-mountain-700 mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="Additional notes"
                  />
                </div>
              </div>
            ))}

            {/* Add New Item Button */}
            <div className="flex justify-center">
              <button
                onClick={addNewItem}
                className="bg-mountain-600 text-white px-4 py-2 rounded-lg hover:bg-mountain-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Item</span>
              </button>
            </div>

            {/* Total Summary */}
            <div className="bg-mountain-50 border border-mountain-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold text-mountain-800">Total Summary</h4>
                  <p className="text-sm text-mountain-600">
                    {items.filter(item => item.name.trim()).length} items • Total Amount
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-mountain-600">
                    {formatCurrency(calculateTotalAmount())}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAll}
                disabled={loading}
                className="px-6 py-2 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving All Items...' : 'Save All Items'}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SimpleInventoryExpenseList
