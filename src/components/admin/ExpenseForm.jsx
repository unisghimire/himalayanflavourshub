import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Receipt, Plus, Trash2 } from 'lucide-react'
import { accountingService } from '../../services/accountingService'
import { productService } from '../../services/categoryService'
import inventoryService from '../../services/inventoryService'

const ExpenseForm = ({ isOpen, onClose, onSuccess, editingData, preSelectedInventory }) => {
  const [loading, setLoading] = useState(false)
  const [accountingHeads, setAccountingHeads] = useState([])
  const [expenseCategories, setExpenseCategories] = useState([])
  const [batches, setBatches] = useState([])
  const [products, setProducts] = useState([])
  const [inventoryItems, setInventoryItems] = useState([])

  const [formData, setFormData] = useState({
    accounting_head_id: '',
    expense_category_id: '',
    batch_id: '',
    description: '',
    expense_date: new Date().toISOString().split('T')[0],
    vendor_name: '',
    payment_method: '',
    reference_number: '',
    notes: '',
    total_amount: 0
  })

  const [expenseItems, setExpenseItems] = useState([
    {
      id: 1,
      product_id: '',
      product_name: '',
      inventory_item_id: '',
      inventory_item_name: '',
      description: '',
      amount: '',
      quantity: '1',
      unit: 'kg'
    }
  ])

  useEffect(() => {
    if (isOpen) {
      loadInitialData()
      if (editingData) {
        // Populate form with editing data
        setFormData({
          accounting_head_id: editingData.accounting_head_id || '',
          expense_category_id: editingData.expense_category_id || '',
          batch_id: editingData.batch_id || '',
          description: editingData.description || '',
          expense_date: editingData.expense_date || new Date().toISOString().split('T')[0],
          vendor_name: editingData.vendor_name || '',
          payment_method: editingData.payment_method || '',
          reference_number: editingData.reference_number || '',
          notes: editingData.notes || '',
          total_amount: editingData.amount || 0
        })
        
        // For editing, we'll show the expense as a single item
        setExpenseItems([{
          id: 1,
          product_id: editingData.product_id || '',
          product_name: editingData.description?.split(' - ')[0] || '',
          description: editingData.description || '',
          amount: editingData.amount?.toString() || '',
          quantity: editingData.quantity?.toString() || '1',
          unit: editingData.unit || 'kg'
        }])
      } else {
        resetForm()
      }
    }
  }, [isOpen, editingData])

  // Handle pre-selected inventory item
  useEffect(() => {
    if (isOpen && preSelectedInventory && expenseItems.length > 0) {
      // Pre-select the inventory item in the first expense item
      updateExpenseItem(expenseItems[0].id, 'inventory_item_id', preSelectedInventory.id)
      updateExpenseItem(expenseItems[0].id, 'product_name', preSelectedInventory.name)
      updateExpenseItem(expenseItems[0].id, 'unit', preSelectedInventory.unit)
    }
  }, [isOpen, preSelectedInventory, expenseItems])

  const loadInitialData = async () => {
    try {
      const [heads, batchesData, productsData, inventoryData] = await Promise.all([
        accountingService.getAllAccountingHeads(),
        accountingService.getAllBatches(),
        productService.getAllProducts(),
        inventoryService.getAllItems()
      ])

      setAccountingHeads(heads)
      setBatches(batchesData)
      setProducts(productsData)
      setInventoryItems(inventoryData)
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

  const addExpenseItem = () => {
    const newItem = {
      id: Date.now(),
      product_id: '',
      product_name: '',
      description: '',
      amount: '',
      quantity: '1',
      unit: 'kg'
    }
    setExpenseItems([...expenseItems, newItem])
  }

  const removeExpenseItem = (id) => {
    if (expenseItems.length > 1) {
      setExpenseItems(expenseItems.filter(item => item.id !== id))
    }
  }

  const updateExpenseItem = (id, field, value) => {
    const updatedItems = expenseItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        
        // If inventory item is selected, auto-fill some fields
        if (field === 'inventory_item_id' && value) {
          const selectedItem = inventoryItems.find(inv => inv.id === value)
          if (selectedItem) {
            updatedItem.inventory_item_name = selectedItem.name
            updatedItem.unit = selectedItem.unit
            updatedItem.product_name = selectedItem.name
            // Reset quantity to 1 when selecting new inventory item
            updatedItem.quantity = '1'
          }
        }
        
        return updatedItem
      }
      return item
    })
    setExpenseItems(updatedItems)
  }

  const calculateTotalAmount = useCallback(() => {
    const total = expenseItems.reduce((sum, item) => {
      return sum + (parseFloat(item.amount) || 0)
    }, 0)
    return total
  }, [expenseItems])

  const validateInventoryInvoice = (item) => {
    if (!item.inventory_item_id || !item.quantity) return null
    
    const selectedItem = inventoryItems.find(inv => inv.id === item.inventory_item_id)
    if (!selectedItem) return null
    
    const requestedQuantity = parseFloat(item.quantity)
    const physicalStock = parseFloat(selectedItem.current_stock)
    const invoicedQuantity = parseFloat(selectedItem.invoiced_quantity || 0)
    const availableForInvoice = physicalStock - invoicedQuantity
    
    console.log('Validation data:', {
      itemId: item.inventory_item_id,
      itemName: selectedItem.name,
      requestedQuantity,
      physicalStock,
      invoicedQuantity,
      availableForInvoice,
      selectedItem
    })
    
    if (requestedQuantity > availableForInvoice) {
      return {
        isValid: false,
        message: `Insufficient available quantity for invoice! Physical: ${physicalStock} ${selectedItem.unit}, Already Invoiced: ${invoicedQuantity} ${selectedItem.unit}, Available: ${availableForInvoice} ${selectedItem.unit}, Requested: ${requestedQuantity} ${selectedItem.unit}`
      }
    }
    
    return { isValid: true }
  }

  useEffect(() => {
    const total = calculateTotalAmount()
    setFormData(prev => ({ ...prev, total_amount: total }))
  }, [calculateTotalAmount])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate inventory invoice capacity before submission
    for (const item of expenseItems) {
      const validation = validateInventoryInvoice(item)
      if (validation && !validation.isValid) {
        alert(validation.message)
        setLoading(false)
        return
      }
    }

    try {
      if (editingData) {
        // Update existing expense
        const item = expenseItems[0] // For editing, we only have one item
        if (!item.product_name || !item.amount) return

        // Prepare expense data with inventory reference if applicable
        let expenseDescription = `${item.product_name} - ${item.quantity} ${item.unit} - Rs.${item.amount}`
        if (item.inventory_item_id) {
          expenseDescription = `${expenseDescription} | inventory_item_id:${item.inventory_item_id}`
        }

        const expenseData = {
          accounting_head_id: formData.accounting_head_id,
          expense_category_id: formData.expense_category_id,
          batch_id: formData.batch_id,
          product_id: item.product_id || null,
          description: expenseDescription,
          amount: parseFloat(item.amount),
          quantity: parseFloat(item.quantity),
          unit: item.unit,
          expense_date: formData.expense_date,
          vendor_name: formData.vendor_name,
          payment_method: formData.payment_method,
          reference_number: formData.reference_number,
          notes: formData.notes
        }

        // If inventory item is linked, add to invoiced quantity
        if (item.inventory_item_id) {
          await inventoryService.addInvoicedQuantity(item.inventory_item_id, parseFloat(item.quantity), {
            type: 'expense',
            id: editingData.id,
            batchId: formData.batch_id,
            notes: `Invoiced in expense: ${item.product_name}`
          })
        }

        await accountingService.updateExpense(editingData.id, expenseData)
        
        // Refresh inventory data to get updated quantities
        const updatedInventoryData = await inventoryService.getAllItems()
        setInventoryItems(updatedInventoryData)
      } else {
        // Create individual expense entries for each item
        const expensePromises = expenseItems.map(async (item) => {
          if (!item.product_name || !item.amount) return null

          // Prepare expense data with inventory reference if applicable
          let expenseDescription = `${item.product_name} - ${item.quantity} ${item.unit} - Rs.${item.amount}`
          if (item.inventory_item_id) {
            expenseDescription = `${expenseDescription} | inventory_item_id:${item.inventory_item_id}`
          }

          const expenseData = {
            accounting_head_id: formData.accounting_head_id,
            expense_category_id: formData.expense_category_id,
            batch_id: formData.batch_id,
            product_id: item.product_id || null,
            description: expenseDescription,
            amount: parseFloat(item.amount),
            quantity: parseFloat(item.quantity),
            unit: item.unit,
            expense_date: formData.expense_date,
            vendor_name: formData.vendor_name,
            payment_method: formData.payment_method,
            reference_number: formData.reference_number,
            notes: formData.notes
          }

          const expense = await accountingService.createExpense(expenseData)

          // If inventory item is linked, add to invoiced quantity
          if (item.inventory_item_id) {
            await inventoryService.addInvoicedQuantity(item.inventory_item_id, parseFloat(item.quantity), {
              type: 'expense',
              id: expense.id,
              batchId: formData.batch_id,
              notes: `Invoiced in expense: ${item.product_name}`
            })
          }

          return expense
        })

        await Promise.all(expensePromises.filter(Boolean))
      }

      // Refresh inventory data to get updated quantities
      const updatedInventoryData = await inventoryService.getAllItems()
      setInventoryItems(updatedInventoryData)

      onSuccess?.()
      onClose()
      resetForm()
    } catch (error) {
      console.error('Error saving expense:', error)
      alert('Error saving expense. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      accounting_head_id: '',
      expense_category_id: '',
      batch_id: '',
      description: '',
      expense_date: new Date().toISOString().split('T')[0],
      vendor_name: '',
      payment_method: '',
      reference_number: '',
      notes: '',
      total_amount: 0
    })
    setExpenseItems([{
      id: 1,
      product_id: '',
      product_name: '',
      description: '',
      amount: '',
      quantity: '1',
      unit: 'kg'
    }])
  }

  const handleAccountingHeadChange = (e) => {
    const headId = e.target.value
    setFormData({ ...formData, accounting_head_id: headId, expense_category_id: '' })
    loadExpenseCategories(headId)
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
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Receipt className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-mountain-800">
                  {editingData ? 'Edit Expense' : 'Add New Expense'}
                </h3>
                <p className="text-sm text-mountain-600">
                  {editingData ? 'Update expense details' : 'Enter expense details for your pickle business'}
                </p>
              </div>
            </div>

            {/* Invoice Capacity Warning */}
            {expenseItems.some(item => item.inventory_item_id && validateInventoryInvoice(item) && !validateInventoryInvoice(item).isValid) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    </span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-red-800">Insufficient Invoice Capacity Warning</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Some items exceed available quantity for invoicing. Please reduce quantities or add more inventory before proceeding.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-mountain-800 mb-4">General Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Accounting Head */}
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

                {/* Expense Category */}
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

                {/* Expense Date */}
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Vendor Name */}
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
                    placeholder="Invoice number, receipt number, etc."
                  />
                </div>
              </div>
            </div>

            {/* Expense Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold text-mountain-800">Expense Items</h4>
                <button
                  type="button"
                  onClick={addExpenseItem}
                  className="bg-mountain-600 text-white px-3 py-2 rounded-lg hover:bg-mountain-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="space-y-4">
                {expenseItems.map((item, index) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-sm font-medium text-mountain-700">Item {index + 1}</h5>
                      {expenseItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExpenseItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                      {/* Product Name */}
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-mountain-700 mb-2">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          value={item.product_name}
                          onChange={(e) => updateExpenseItem(item.id, 'product_name', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                          placeholder="e.g., Tomato, Ginger, Oil"
                        />
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="block text-sm font-medium text-mountain-700 mb-2">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => updateExpenseItem(item.id, 'quantity', e.target.value)}
                          required
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500 ${
                            item.inventory_item_id && validateInventoryInvoice(item) && !validateInventoryInvoice(item).isValid
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-300'
                          }`}
                          placeholder="1"
                        />
                        {item.inventory_item_id && validateInventoryInvoice(item) && !validateInventoryInvoice(item).isValid && (
                          <p className="text-red-600 text-xs mt-1 flex items-center">
                            <span className="w-1 h-1 bg-red-600 rounded-full mr-1"></span>
                            {validateInventoryInvoice(item).message}
                          </p>
                        )}
                        {item.inventory_item_id && validateInventoryInvoice(item) && validateInventoryInvoice(item).isValid && (
                          <p className="text-green-600 text-xs mt-1 flex items-center">
                            <span className="w-1 h-1 bg-green-600 rounded-full mr-1"></span>
                            Available for invoice: {(() => {
                              const selectedItem = inventoryItems.find(inv => inv.id === item.inventory_item_id)
                              if (!selectedItem) return '0'
                              const physical = parseFloat(selectedItem.current_stock || 0)
                              const invoiced = parseFloat(selectedItem.invoiced_quantity || 0)
                              return (physical - invoiced).toFixed(2)
                            })()} {item.unit}
                          </p>
                        )}
                      </div>

                      {/* Unit */}
                      <div>
                        <label className="block text-sm font-medium text-mountain-700 mb-2">
                          Unit *
                        </label>
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => updateExpenseItem(item.id, 'unit', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                          placeholder="kg, pieces, liters"
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
                          value={item.amount}
                          onChange={(e) => updateExpenseItem(item.id, 'amount', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                          placeholder="0.00"
                        />
                      </div>

                      {/* Link to Inventory Item */}
                      <div>
                        <label className="block text-sm font-medium text-mountain-700 mb-2">
                          Link to Inventory
                        </label>
                        <select
                          value={item.inventory_item_id}
                          onChange={(e) => updateExpenseItem(item.id, 'inventory_item_id', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                        >
                          <option value="">Select Inventory Item</option>
                          {inventoryItems.map((invItem) => (
                          <option key={invItem.id} value={invItem.id}>
                            {invItem.name} - Physical: {invItem.current_stock} {invItem.unit} | Invoiced: {invItem.invoiced_quantity || 0} {invItem.unit} | Available: {(parseFloat(invItem.current_stock || 0) - parseFloat(invItem.invoiced_quantity || 0)).toFixed(2)} {invItem.unit} | Cost: Rs.{invItem.unit_cost}
                            {invItem.current_stock <= invItem.minimum_stock ? ' (LOW STOCK!)' : ''}
                          </option>
                          ))}
                        </select>
                      </div>

                      {/* Link to Product */}
                      <div>
                        <label className="block text-sm font-medium text-mountain-700 mb-2">
                          Link to Product
                        </label>
                        <select
                          value={item.product_id}
                          onChange={(e) => updateExpenseItem(item.id, 'product_id', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                        >
                          <option value="">Select Product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Amount Display */}
              <div className="bg-mountain-50 border border-mountain-200 rounded-lg p-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-mountain-800">Total Amount:</span>
                  <span className="text-2xl font-bold text-mountain-600">Rs.{formData.total_amount.toFixed(2)}</span>
                </div>
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
                disabled={loading || expenseItems.some(item => item.inventory_item_id && validateInventoryInvoice(item) && !validateInventoryInvoice(item).isValid)}
                className="px-6 py-2 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Expenses'}</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default ExpenseForm