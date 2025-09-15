import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Edit, Trash2, Plus, Package, AlertTriangle, Save, RotateCcw } from 'lucide-react'
import { accountingService } from '../../services/accountingService'
import inventoryService from '../../services/inventoryService'

const BatchInventoryViewModal = ({ isOpen, onClose, batchId, batchName }) => {
  const [loading, setLoading] = useState(false)
  const [consumptionData, setConsumptionData] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [inventoryItems, setInventoryItems] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    if (isOpen && batchId) {
      loadConsumptionData()
      loadInventoryItems()
    }
  }, [isOpen, batchId])

  const loadConsumptionData = async () => {
    try {
      setLoading(true)
      const data = await accountingService.getBatchInventoryConsumption(batchId)
      setConsumptionData(data)
    } catch (error) {
      console.error('Error loading consumption data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadInventoryItems = async () => {
    try {
      const items = await inventoryService.getAllItems()
      setInventoryItems(items)
    } catch (error) {
      console.error('Error loading inventory items:', error)
    }
  }

  const handleEditItem = (item) => {
    setEditingItem({ ...item })
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
  }

  const handleSaveEdit = async () => {
    if (!editingItem) return

    try {
      setLoading(true)
      
      // Calculate the difference in quantity for inventory adjustment
      const originalItem = consumptionData.find(item => item.id === editingItem.id)
      const quantityDiff = parseFloat(editingItem.quantity_consumed) - parseFloat(originalItem.quantity_consumed)
      
      // Update the consumption record
      await accountingService.updateBatchInventoryConsumption(editingItem.id, {
        quantity_consumed: parseFloat(editingItem.quantity_consumed),
        unit_cost: parseFloat(editingItem.unit_cost),
        notes: editingItem.notes
      })

      // Adjust inventory if quantity changed
      if (quantityDiff !== 0) {
        if (quantityDiff > 0) {
          // More consumed - reduce inventory
          await inventoryService.consumeInventoryForBatch(
            editingItem.inventory_item_id,
            quantityDiff,
            batchId,
            { notes: `Quantity adjustment for batch consumption` }
          )
        } else {
          // Less consumed - add back to inventory
          await inventoryService.addStock(
            editingItem.inventory_item_id,
            Math.abs(quantityDiff),
            editingItem.unit_cost,
            { notes: `Quantity adjustment for batch consumption` }
          )
        }
      }

      await loadConsumptionData()
      setEditingItem(null)
    } catch (error) {
      console.error('Error updating consumption item:', error)
      alert('Error updating consumption item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this consumption item? This will restore the inventory.')) {
      return
    }

    try {
      setLoading(true)
      const item = consumptionData.find(i => i.id === itemId)
      
      // Delete the consumption record
      await accountingService.deleteBatchInventoryConsumption(itemId)
      
      // Restore inventory
      await inventoryService.addStock(
        item.inventory_item_id,
        parseFloat(item.quantity_consumed),
        item.unit_cost,
        { notes: `Restored from deleted batch consumption` }
      )

      await loadConsumptionData()
    } catch (error) {
      console.error('Error deleting consumption item:', error)
      alert('Error deleting consumption item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = () => {
    setShowAddForm(true)
  }

  const handleAddSuccess = () => {
    setShowAddForm(false)
    loadConsumptionData()
  }

  const totalCost = consumptionData.reduce((sum, item) => sum + (parseFloat(item.total_cost) || 0), 0)

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
                Inventory Consumption - {batchName}
              </h2>
              <p className="text-mountain-600">
                View and manage inventory items consumed in this batch
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Total Items</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {consumptionData.length}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Total Cost</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-1">
                Rs.{totalCost.toFixed(2)}
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-800">Last Updated</span>
              </div>
              <p className="text-sm text-orange-900 mt-1">
                {consumptionData.length > 0 
                  ? new Date(consumptionData[0].consumption_date).toLocaleDateString()
                  : 'No data'
                }
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-mountain-800">Consumption Items</h3>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>

          {/* Consumption Table */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mountain-600"></div>
            </div>
          ) : consumptionData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No inventory consumption recorded for this batch.</p>
              <p className="text-sm">Click "Add Item" to start tracking consumption.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
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
                      Notes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {consumptionData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-mountain-100 rounded-lg flex items-center justify-center mr-3">
                            <Package className="w-4 h-4 text-mountain-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-mountain-900">
                              {item.inventory_item_name}
                            </div>
                            <div className="text-sm text-mountain-500">
                              {item.category_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingItem && editingItem.id === item.id ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editingItem.quantity_consumed}
                            onChange={(e) => setEditingItem({
                              ...editingItem,
                              quantity_consumed: e.target.value,
                              total_cost: parseFloat(e.target.value) * parseFloat(editingItem.unit_cost)
                            })}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        ) : (
                          <span className="text-sm text-mountain-900">
                            {item.quantity_consumed} {item.inventory_unit}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingItem && editingItem.id === item.id ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editingItem.unit_cost}
                            onChange={(e) => setEditingItem({
                              ...editingItem,
                              unit_cost: e.target.value,
                              total_cost: parseFloat(editingItem.quantity_consumed) * parseFloat(e.target.value)
                            })}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        ) : (
                          <span className="text-sm text-mountain-900">
                            Rs.{parseFloat(item.unit_cost).toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-mountain-900">
                          Rs.{parseFloat(item.total_cost).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {editingItem && editingItem.id === item.id ? (
                          <input
                            type="text"
                            value={editingItem.notes || ''}
                            onChange={(e) => setEditingItem({
                              ...editingItem,
                              notes: e.target.value
                            })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Add notes..."
                          />
                        ) : (
                          <span className="text-sm text-mountain-500">
                            {item.notes || 'No notes'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {editingItem && editingItem.id === item.id ? (
                            <>
                              <button
                                onClick={handleSaveEdit}
                                disabled={loading}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                title="Save changes"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-gray-600 hover:text-gray-900"
                                title="Cancel"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditItem(item)}
                                className="text-mountain-600 hover:text-mountain-900"
                                title="Edit item"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-mountain-800">Add Consumption Item</h3>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  {/* Import and use BatchInventoryConsumptionForm here */}
                  <div className="text-center py-8 text-gray-500">
                    <p>Use the "Add Item" button in the main batch management to add new consumption items.</p>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="mt-4 px-4 py-2 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default BatchInventoryViewModal
