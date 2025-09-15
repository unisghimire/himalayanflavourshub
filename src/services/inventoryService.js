import { supabase } from '../lib/supabase'

const inventoryService = {
  // ==================== INVENTORY CATEGORIES ====================
  
  // Get all inventory categories
  async getAllCategories() {
    try {
      const { data, error } = await supabase
        .from('inventory_categories')
        .select('*')
        .order('name')

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching inventory categories:', error)
      return []
    }
  },

  // Create inventory category
  async createCategory(categoryData) {
    try {
      const { data, error } = await supabase
        .from('inventory_categories')
        .insert([categoryData])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating inventory category:', error)
      throw error
    }
  },

  // Update inventory category
  async updateCategory(categoryId, updateData) {
    try {
      const { data, error } = await supabase
        .from('inventory_categories')
        .update(updateData)
        .eq('id', categoryId)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating inventory category:', error)
      throw error
    }
  },

  // Delete inventory category
  async deleteCategory(categoryId) {
    try {
      const { error } = await supabase
        .from('inventory_categories')
        .delete()
        .eq('id', categoryId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting inventory category:', error)
      throw error
    }
  },

  // ==================== INVENTORY ITEMS ====================
  
  // Get all inventory items with stock levels
  async getAllItems() {
    try {
      const { data, error } = await supabase
        .from('inventory_stock_levels')
        .select('*')
        .order('name')

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching inventory items:', error)
      return []
    }
  },

  // Get inventory item by ID
  async getItemById(itemId) {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select(`
          *,
          inventory_categories(name)
        `)
        .eq('id', itemId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching inventory item:', error)
      throw error
    }
  },

  // Create inventory item
  async createItem(itemData) {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([itemData])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating inventory item:', error)
      throw error
    }
  },

  // Update inventory item
  async updateItem(itemId, updateData) {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updateData)
        .eq('id', itemId)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating inventory item:', error)
      throw error
    }
  },

  // Delete inventory item
  async deleteItem(itemId) {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting inventory item:', error)
      throw error
    }
  },

  // ==================== INVENTORY TRANSACTIONS ====================
  
  // Get all inventory transactions
  async getAllTransactions(filters = {}) {
    try {
      let query = supabase
        .from('inventory_transaction_summary')
        .select('*')
        .order('transaction_date', { ascending: false })

      // Apply filters
      if (filters.itemId) {
        query = query.eq('item_id', filters.itemId)
      }
      if (filters.transactionType) {
        query = query.eq('transaction_type', filters.transactionType)
      }
      if (filters.dateFrom) {
        query = query.gte('transaction_date', filters.dateFrom)
      }
      if (filters.dateTo) {
        query = query.lte('transaction_date', filters.dateTo)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching inventory transactions:', error)
      return []
    }
  },

  // Create inventory transaction
  async createTransaction(transactionData) {
    try {
      const { data, error } = await supabase
        .from('inventory_transactions')
        .insert([transactionData])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating inventory transaction:', error)
      throw error
    }
  },

  // Update inventory transaction
  async updateTransaction(transactionId, updateData) {
    try {
      const { data, error } = await supabase
        .from('inventory_transactions')
        .update(updateData)
        .eq('id', transactionId)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating inventory transaction:', error)
      throw error
    }
  },

  // Delete inventory transaction
  async deleteTransaction(transactionId) {
    try {
      const { error } = await supabase
        .from('inventory_transactions')
        .delete()
        .eq('id', transactionId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting inventory transaction:', error)
      throw error
    }
  },

  // ==================== STOCK MANAGEMENT ====================
  
  // Add stock (purchase/receive)
  async addStock(itemId, quantity, unitCost, referenceData = {}) {
    try {
      // First, get the current stock
      const { data: currentItem, error: fetchError } = await supabase
        .from('inventory_items')
        .select('current_stock')
        .eq('id', itemId)
        .single()

      if (fetchError) throw fetchError

      // Calculate new stock level
      const currentStock = parseFloat(currentItem.current_stock || 0)
      const newStockLevel = currentStock + parseFloat(quantity)

      // Update the current_stock field directly
      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ 
          current_stock: newStockLevel,
          unit_cost: unitCost,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)

      if (updateError) throw updateError

      // Create transaction record for tracking
      const transactionData = {
        item_id: itemId,
        transaction_type: 'in',
        quantity: quantity,
        unit_cost: unitCost,
        total_cost: quantity * unitCost,
        reference_type: referenceData.type || 'purchase',
        reference_id: referenceData.id ? parseInt(referenceData.id) : null,
        batch_id: referenceData.batchId ? parseInt(referenceData.batchId) : null,
        notes: referenceData.notes || null
      }

      return await this.createTransaction(transactionData)
    } catch (error) {
      console.error('Error adding stock:', error)
      throw error
    }
  },

  // Remove stock (usage/production) - for actual physical consumption
  async removeStock(itemId, quantity, referenceData = {}) {
    try {
      // First, get the current stock
      const { data: currentItem, error: fetchError } = await supabase
        .from('inventory_items')
        .select('current_stock')
        .eq('id', itemId)
        .single()

      if (fetchError) throw fetchError

      // Calculate new stock level
      const currentStock = parseFloat(currentItem.current_stock || 0)
      const newStockLevel = Math.max(0, currentStock - parseFloat(quantity)) // Don't go below 0

      // Update the current_stock field directly
      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ 
          current_stock: newStockLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)

      if (updateError) throw updateError

      // Create transaction record for tracking
      const transactionData = {
        item_id: itemId,
        transaction_type: 'out',
        quantity: quantity,
        reference_type: referenceData.type || 'usage',
        reference_id: referenceData.id ? parseInt(referenceData.id) : null,
        batch_id: referenceData.batchId ? parseInt(referenceData.batchId) : null,
        notes: referenceData.notes || null
      }

      return await this.createTransaction(transactionData)
    } catch (error) {
      console.error('Error removing stock:', error)
      throw error
    }
  },

  // Add invoiced quantity (for accounting purposes only)
  async addInvoicedQuantity(itemId, quantity, referenceData = {}) {
    try {
      console.log('Adding invoiced quantity:', { itemId, quantity, referenceData })
      
      // First, get the current invoiced_quantity
      const { data: currentItem, error: fetchError } = await supabase
        .from('inventory_items')
        .select('invoiced_quantity, current_stock, name')
        .eq('id', itemId)
        .single()

      if (fetchError) throw fetchError

      console.log('Current item data:', currentItem)

      // Calculate new invoiced quantity
      const currentInvoiced = parseFloat(currentItem.invoiced_quantity || 0)
      const newInvoicedQuantity = currentInvoiced + parseFloat(quantity)

      console.log('Updating invoiced quantity:', { currentInvoiced, newInvoicedQuantity })

      // Update the invoiced_quantity field
      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ 
          invoiced_quantity: newInvoicedQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)

      if (updateError) throw updateError

      console.log('Successfully updated invoiced quantity')

      // Create a transaction record for tracking
      const transactionData = {
        item_id: itemId,
        transaction_type: 'adjustment',
        quantity: quantity,
        reference_type: referenceData.type || 'invoice',
        reference_id: referenceData.id ? parseInt(referenceData.id) : null,
        batch_id: referenceData.batchId ? parseInt(referenceData.batchId) : null,
        notes: `Invoiced: ${referenceData.notes || 'Accounting entry'}`
      }

      return await this.createTransaction(transactionData)
    } catch (error) {
      console.error('Error adding invoiced quantity:', error)
      throw error
    }
  },

  // Get available quantity for invoicing (physical stock - invoiced quantity)
  async getAvailableForInvoice(itemId) {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('current_stock, invoiced_quantity')
        .eq('id', itemId)
        .single()

      if (error) throw error
      
      const available = (data.current_stock || 0) - (data.invoiced_quantity || 0)
      return Math.max(0, available) // Don't return negative values
    } catch (error) {
      console.error('Error getting available quantity for invoice:', error)
      return 0
    }
  },

  // Consume inventory for batch production (reduces physical stock)
  async consumeInventoryForBatch(itemId, quantity, batchId, referenceData = {}) {
    try {
      // First, get the current stock
      const { data: currentItem, error: fetchError } = await supabase
        .from('inventory_items')
        .select('current_stock, unit_cost')
        .eq('id', itemId)
        .single()

      if (fetchError) throw fetchError

      // Check if we have enough stock
      const currentStock = parseFloat(currentItem.current_stock || 0)
      if (quantity > currentStock) {
        throw new Error(`Insufficient stock! Available: ${currentStock}, Required: ${quantity}`)
      }

      // Create transaction record for tracking
      // The database trigger will automatically update current_stock
      const transactionData = {
        item_id: itemId,
        transaction_type: 'out',
        quantity: quantity,
        unit_cost: currentItem.unit_cost,
        total_cost: quantity * currentItem.unit_cost,
        reference_type: 'batch_production',
        reference_id: batchId,
        batch_id: batchId,
        notes: `Consumed for batch production: ${referenceData.notes || 'Production usage'}`
      }

      console.log('Creating consumption transaction:', transactionData)
      const result = await this.createTransaction(transactionData)
      console.log('Transaction created successfully:', result)
      
      return result
    } catch (error) {
      console.error('Error consuming inventory for batch:', error)
      throw error
    }
  },

  // Adjust stock (manual adjustment)
  async adjustStock(itemId, newQuantity, notes = '') {
    try {
      const transactionData = {
        item_id: itemId,
        transaction_type: 'adjustment',
        quantity: newQuantity,
        reference_type: 'adjustment',
        notes: notes
      }

      return await this.createTransaction(transactionData)
    } catch (error) {
      console.error('Error adjusting stock:', error)
      throw error
    }
  },

  // ==================== ALERTS & REPORTS ====================
  
  // Get low stock alerts
  async getLowStockAlerts() {
    try {
      const { data, error } = await supabase
        .from('low_stock_alerts')
        .select('*')
        .order('shortage_quantity', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching low stock alerts:', error)
      return []
    }
  },

  // Get expiry alerts
  async getExpiryAlerts() {
    try {
      const { data, error } = await supabase
        .from('expiry_alerts')
        .select('*')
        .order('expiry_date', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching expiry alerts:', error)
      return []
    }
  },

  // Get inventory summary
  async getInventorySummary() {
    try {
      const [items, lowStock, expiry] = await Promise.all([
        this.getAllItems(),
        this.getLowStockAlerts(),
        this.getExpiryAlerts()
      ])

      const totalItems = items.length
      const lowStockCount = lowStock.length
      const expiryCount = expiry.length
      const totalValue = items.reduce((sum, item) => sum + (item.current_stock * item.unit_cost), 0)

      return {
        totalItems,
        lowStockCount,
        expiryCount,
        totalValue,
        lowStockItems: lowStock,
        expiryItems: expiry
      }
    } catch (error) {
      console.error('Error fetching inventory summary:', error)
      return {
        totalItems: 0,
        lowStockCount: 0,
        expiryCount: 0,
        totalValue: 0,
        lowStockItems: [],
        expiryItems: []
      }
    }
  },

  // Search inventory items
  async searchItems(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('inventory_stock_levels')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('name')

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error searching inventory items:', error)
      return []
    }
  }
}

export default inventoryService
