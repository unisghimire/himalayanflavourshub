import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Plus, Trash2, Package, AlertTriangle } from 'lucide-react'
import { accountingService } from '../../services/accountingService'
import inventoryService from '../../services/inventoryService'

const BatchInventoryConsumptionForm = ({ isOpen, onClose, onSuccess, batchId, batchName, editingData }) => {
  const [loading, setLoading] = useState(false)
  const [inventoryItems, setInventoryItems] = useState([])
  const [consumptionItems, setConsumptionItems] = useState([
    {
      id: 1,
      inventory_item_id: '',
      inventory_item_name: '',
      quantity_consumed: '',
      unit_cost: '',
      total_cost: 0,
      unit: '',
      notes: ''
    }
  ])

  useEffect(() => {
    if (isOpen) {
      loadInventoryItems()
      if (editingData) {
        // Handle editing existing consumption
        setConsumptionItems(editingData)
      } else {
        resetForm()
      }
    }
  }, [isOpen, editingData])

  const loadInventoryItems = async () => {
    try {
      const items = await inventoryService.getAllItems()
      setInventoryItems(items)
    } catch (error) {
      console.error('Error loading inventory items:', error)
    }
  }

  const resetForm = () => {
    setConsumptionItems([
      {
        id: 1,
        inventory_item_id: '',
        inventory_item_name: '',
        quantity_consumed: '',
        unit_cost: '',
        total_cost: 0,
        unit: '',
        notes: ''
      }
    ])
  }

  const addConsumptionItem = () => {
    const newItem = {
      id: Date.now(),
      inventory_item_id: '',
      inventory_item_name: '',
      quantity_consumed: '',
      unit_cost: '',
      total_cost: 0,
      unit: '',
      notes: ''
    }
    setConsumptionItems([...consumptionItems, newItem])
  }

  const removeConsumptionItem = (itemId) => {
    if (consumptionItems.length > 1) {
      setConsumptionItems(consumptionItems.filter(item => item.id !== itemId))
    }
  }

  const updateConsumptionItem = (itemId, field, value) => {
    const updatedItems = consumptionItems.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value }
        
        // If inventory item is selected, auto-fill some fields
        if (field === 'inventory_item_id' && value) {
          const selectedItem = inventoryItems.find(inv => inv.id === value)
          if (selectedItem) {
            updatedItem.inventory_item_name = selectedItem.name
            updatedItem.unit = selectedItem.unit
            updatedItem.unit_cost = selectedItem.unit_cost
            updatedItem.total_cost = (parseFloat(updatedItem.quantity_consumed) || 0) * selectedItem.unit_cost
          }
        }
        
        // If quantity or unit cost changes, recalculate total
        if (field === 'quantity_consumed' || field === 'unit_cost') {
          const quantity = parseFloat(updatedItem.quantity_consumed) || 0
          const unitCost = parseFloat(updatedItem.unit_cost) || 0
          updatedItem.total_cost = quantity * unitCost
        }
        
        return updatedItem
      }
      return item
    })
    setConsumptionItems(updatedItems)
  }

  const validateConsumption = (item) => {
    if (!item.inventory_item_id || !item.quantity_consumed) return null
    
    const selectedItem = inventoryItems.find(inv => inv.id === item.inventory_item_id)
    if (!selectedItem) return null
    
    const requestedQuantity = parseFloat(item.quantity_consumed)
    const availableStock = parseFloat(selectedItem.current_stock)
    
    if (requestedQuantity > availableStock) {
      return {
        isValid: false,
        message: `Insufficient stock! Available: ${availableStock} ${selectedItem.unit}, Required: ${requestedQuantity} ${selectedItem.unit}. Please add more inventory or reduce the quantity.`
      }
    }
    
    return { isValid: true }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate all consumption items
    for (const item of consumptionItems) {
      const validation = validateConsumption(item)
      if (validation && !validation.isValid) {
        alert(validation.message)
        setLoading(false)
        return
      }
    }

    try {
      // Process each consumption item
      for (const item of consumptionItems) {
        if (!item.inventory_item_id || !item.quantity_consumed) continue

        // Add to batch inventory consumption
        await accountingService.addBatchInventoryConsumption({
          batch_id: batchId,
          inventory_item_id: item.inventory_item_id,
          quantity_consumed: parseFloat(item.quantity_consumed),
          unit_cost: parseFloat(item.unit_cost),
          notes: item.notes
        })

        // Consume from physical inventory
        console.log('Consuming inventory for batch:', {
          itemId: item.inventory_item_id,
          quantity: parseFloat(item.quantity_consumed),
          batchId: batchId
        })
        await inventoryService.consumeInventoryForBatch(
          item.inventory_item_id,
          parseFloat(item.quantity_consumed),
          batchId,
          { notes: item.notes }
        )
        console.log('Inventory consumption completed for item:', item.inventory_item_id)
      }

      onSuccess?.()
      onClose()
      resetForm()
    } catch (error) {
      console.error('Error saving batch inventory consumption:', error)
      alert('Error saving consumption data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const totalConsumptionCost = consumptionItems.reduce((sum, item) => sum + (item.total_cost || 0), 0)

  if (!isOpen) return null

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
                {editingData ? 'Edit Inventory Consumption' : 'Add Inventory Consumption'}
              </h2>
              <p className="text-mountain-600">
                {editingData ? 'Update inventory consumption for this batch' : `Track inventory consumed in batch: ${batchName}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Consumption Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-mountain-800">Inventory Items Consumed</h3>
                <button
                  type="button"
                  onClick={addConsumptionItem}
                  className="px-4 py-2 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>

              {/* Quick Inventory Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-800">Quick Inventory Overview</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                  {inventoryItems.slice(0, 6).map((item) => {
                    const available = parseFloat(item.current_stock || 0)
                    const isLowStock = item.current_stock <= item.minimum_stock
                    const isOutOfStock = available <= 0
                    
                    return (
                      <div key={item.id} className={`px-2 py-1 rounded text-xs ${
                        isOutOfStock ? 'bg-red-100 text-red-700' : 
                        isLowStock ? 'bg-orange-100 text-orange-700' : 
                        'bg-green-100 text-green-700'
                      }`}>
                        <span className="font-medium">{item.name}:</span> {available} {item.unit}
                        {isOutOfStock && ' (OUT)'}
                        {isLowStock && !isOutOfStock && ' (LOW)'}
                      </div>
                    )
                  })}
                  {inventoryItems.length > 6 && (
                    <div className="text-blue-600 text-xs">
                      +{inventoryItems.length - 6} more items...
                    </div>
                  )}
                </div>
              </div>

              {consumptionItems.map((item, index) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-mountain-800">Item {index + 1}</h4>
                    {consumptionItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeConsumptionItem(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Inventory Item */}
                    <div>
                      <label className="block text-sm font-medium text-mountain-700 mb-2">
                        Inventory Item *
                      </label>
                      <select
                        value={item.inventory_item_id}
                        onChange={(e) => updateConsumptionItem(item.id, 'inventory_item_id', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                      >
                        <option value="">Select Inventory Item</option>
                        {inventoryItems.map((invItem) => {
                          const availableForConsumption = parseFloat(invItem.current_stock || 0)
                          const isLowStock = invItem.current_stock <= invItem.minimum_stock
                          const isOutOfStock = availableForConsumption <= 0
                          
                          return (
                            <option 
                              key={invItem.id} 
                              value={invItem.id}
                              disabled={isOutOfStock}
                              className={isOutOfStock ? 'text-red-500' : isLowStock ? 'text-orange-600' : ''}
                            >
                              {invItem.name} - Available: {availableForConsumption} {invItem.unit} | Cost: Rs.{invItem.unit_cost}
                              {isOutOfStock ? ' (OUT OF STOCK)' : isLowStock ? ' (LOW STOCK!)' : ''}
                            </option>
                          )
                        })}
                      </select>
                      {item.inventory_item_id && (() => {
                        const selectedItem = inventoryItems.find(inv => inv.id === item.inventory_item_id)
                        if (selectedItem) {
                          const available = parseFloat(selectedItem.current_stock || 0)
                          const isLowStock = selectedItem.current_stock <= selectedItem.minimum_stock
                          const isOutOfStock = available <= 0
                          
                          return (
                            <div className="mt-1 text-xs">
                              <span className={`font-medium ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-green-600'}`}>
                                Available: {available} {selectedItem.unit}
                              </span>
                              {isOutOfStock && <span className="text-red-600 ml-2">⚠️ Out of stock - add inventory first</span>}
                              {isLowStock && !isOutOfStock && <span className="text-orange-600 ml-2">⚠️ Low stock warning</span>}
                            </div>
                          )
                        }
                        return null
                      })()}
                    </div>

                    {/* Quantity Consumed */}
                    <div>
                      <label className="block text-sm font-medium text-mountain-700 mb-2">
                        Quantity Consumed *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.quantity_consumed}
                        onChange={(e) => updateConsumptionItem(item.id, 'quantity_consumed', e.target.value)}
                        required
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500 ${
                          item.inventory_item_id && validateConsumption(item) && !validateConsumption(item).isValid
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-300'
                        }`}
                        placeholder="0"
                      />
                      {item.inventory_item_id && validateConsumption(item) && !validateConsumption(item).isValid && (
                        <p className="text-red-600 text-xs mt-1 flex items-center">
                          <span className="w-1 h-1 bg-red-600 rounded-full mr-1"></span>
                          {validateConsumption(item).message}
                        </p>
                      )}
                    </div>

                    {/* Unit Cost */}
                    <div>
                      <label className="block text-sm font-medium text-mountain-700 mb-2">
                        Unit Cost (Rs.)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.unit_cost}
                        onChange={(e) => updateConsumptionItem(item.id, 'unit_cost', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Total Cost */}
                    <div>
                      <label className="block text-sm font-medium text-mountain-700 mb-2">
                        Total Cost (Rs.)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.total_cost}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-mountain-700 mb-2">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => updateConsumptionItem(item.id, 'notes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                      placeholder="Optional notes about this consumption"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total Cost Summary */}
            <div className="bg-mountain-50 border border-mountain-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-mountain-600" />
                  <span className="font-medium text-mountain-800">Total Consumption Cost:</span>
                </div>
                <span className="text-xl font-bold text-mountain-800">
                  Rs.{totalConsumptionCost.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || consumptionItems.some(item => item.inventory_item_id && validateConsumption(item) && !validateConsumption(item).isValid)}
                className="px-6 py-2 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Consumption'}</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default BatchInventoryConsumptionForm
