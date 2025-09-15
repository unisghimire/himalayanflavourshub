import { supabase } from '../lib/supabase'

// Accounting Service for managing expenses, batches, and profit analysis
export const accountingService = {
  // ==================== ACCOUNTING HEADS ====================
  
  // Get all accounting heads
  async getAllAccountingHeads() {
    try {
      const { data, error } = await supabase
        .from('accounting_heads')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching accounting heads:', error)
      return []
    }
  },

  // Get accounting heads by type
  async getAccountingHeadsByType(type) {
    try {
      const { data, error } = await supabase
        .from('accounting_heads')
        .select('*')
        .eq('type', type)
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching accounting heads by type:', error)
      return []
    }
  },

  // Create accounting head
  async createAccountingHead(headData) {
    try {
      const { data, error } = await supabase
        .from('accounting_heads')
        .insert([{
          ...headData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating accounting head:', error)
      throw error
    }
  },

  // ==================== BATCHES ====================
  
  // Get all batches
  async getAllBatches() {
    try {
      const { data, error } = await supabase
        .from('batches')
        .select(`
          *,
          batch_products(
            id,
            quantity,
            unit_cost,
            total_cost,
            products(name, slug)
          )
        `)
        .order('production_date', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching batches:', error)
      return []
    }
  },

  // Get batch by ID
  async getBatchById(batchId) {
    try {
      const { data, error } = await supabase
        .from('batches')
        .select(`
          *,
          batch_products(
            id,
            quantity,
            unit_cost,
            total_cost,
            products(name, slug)
          )
        `)
        .eq('id', batchId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching batch:', error)
      return null
    }
  },

  // Create batch
  async createBatch(batchData) {
    try {
      const { data, error } = await supabase
        .from('batches')
        .insert([{
          ...batchData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating batch:', error)
      throw error
    }
  },

  // Update batch
  async updateBatch(batchId, updateData) {
    try {
      const { data, error } = await supabase
        .from('batches')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', batchId)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating batch:', error)
      throw error
    }
  },

  // Delete batch
  async deleteBatch(batchId) {
    try {
      const { error } = await supabase
        .from('batches')
        .delete()
        .eq('id', batchId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting batch:', error)
      throw error
    }
  },

  // ==================== EXPENSE CATEGORIES ====================
  
  // Get expense categories by accounting head
  async getExpenseCategoriesByHead(accountingHeadId) {
    try {
      const { data, error } = await supabase
        .from('expense_categories')
        .select(`
          *,
          accounting_heads(name, type)
        `)
        .eq('accounting_head_id', accountingHeadId)
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching expense categories:', error)
      return []
    }
  },

  // ==================== EXPENSES ====================
  
  // Get all expenses with filters
  async getExpenses(filters = {}) {
    try {
      let query = supabase
        .from('expenses')
        .select(`
          *,
          accounting_heads(name, type),
          expense_categories(name),
          batches(batch_number, batch_name),
          products(name, slug)
        `)
        .order('expense_date', { ascending: false })

      // Apply filters
      if (filters.accountingHeadId) {
        query = query.eq('accounting_head_id', filters.accountingHeadId)
      }
      if (filters.batchId) {
        query = query.eq('batch_id', filters.batchId)
      }
      if (filters.dateFrom) {
        query = query.gte('expense_date', filters.dateFrom)
      }
      if (filters.dateTo) {
        query = query.lte('expense_date', filters.dateTo)
      }
      if (filters.search) {
        query = query.or(`description.ilike.%${filters.search}%,vendor_name.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching expenses:', error)
      return []
    }
  },

  // Create expense
  async createExpense(expenseData) {
    try {
      // Generate expense number
      const expenseNumber = `EXP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          ...expenseData,
          expense_number: expenseNumber,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating expense:', error)
      throw error
    }
  },

  // Update expense
  async updateExpense(expenseId, updateData) {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', expenseId)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating expense:', error)
      throw error
    }
  },

  // Delete expense
  async deleteExpense(expenseId) {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting expense:', error)
      throw error
    }
  },

  // ==================== INCOME ====================
  
  // Get all income with filters
  async getIncome(filters = {}) {
    try {
      let query = supabase
        .from('income')
        .select(`
          *,
          accounting_heads(name, type),
          batches(batch_number, batch_name),
          products(name, slug)
        `)
        .order('income_date', { ascending: false })

      // Apply filters
      if (filters.accountingHeadId) {
        query = query.eq('accounting_head_id', filters.accountingHeadId)
      }
      if (filters.batchId) {
        query = query.eq('batch_id', filters.batchId)
      }
      if (filters.dateFrom) {
        query = query.gte('income_date', filters.dateFrom)
      }
      if (filters.dateTo) {
        query = query.lte('income_date', filters.dateTo)
      }
      if (filters.search) {
        query = query.or(`description.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching income:', error)
      return []
    }
  },

  // Create income
  async createIncome(incomeData) {
    try {
      // Generate income number
      const incomeNumber = `INC-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      const { data, error } = await supabase
        .from('income')
        .insert([{
          ...incomeData,
          income_number: incomeNumber,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating income:', error)
      throw error
    }
  },

  // ==================== ANALYTICS & REPORTS ====================
  
  // Get profit/loss analysis
  async getProfitLossAnalysis(filters = {}) {
    try {
      let query = supabase
        .from('profit_loss_analysis')
        .select('*')
        .order('production_date', { ascending: false })

      if (filters.batchId) {
        query = query.eq('batch_id', filters.batchId)
      }
      if (filters.dateFrom) {
        query = query.gte('production_date', filters.dateFrom)
      }
      if (filters.dateTo) {
        query = query.lte('production_date', filters.dateTo)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching profit/loss analysis:', error)
      return []
    }
  },

  // Get accounting head summary
  async getAccountingHeadSummary() {
    try {
      const { data, error } = await supabase
        .from('accounting_head_summary')
        .select('*')
        .order('head_name', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching accounting head summary:', error)
      return []
    }
  },

  // Get batch expenses summary
  async getBatchExpensesSummary(batchId) {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          accounting_head_id,
          accounting_heads(name, type),
          SUM(amount) as total_amount
        `)
        .eq('batch_id', batchId)
        .group('accounting_head_id, accounting_heads(name, type)')

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching batch expenses summary:', error)
      return []
    }
  },

  // Get batch profit/loss analysis
  async getBatchProfitLoss(batchId) {
    try {
      // Get total expenses for the batch
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('amount, description, expense_date')
        .eq('batch_id', batchId)

      if (expensesError) throw expensesError

      // Get total income for the batch
      const { data: incomeData, error: incomeError } = await supabase
        .from('income')
        .select('amount, description, income_date')
        .eq('batch_id', batchId)

      if (incomeError) throw incomeError

      const totalExpenses = expensesData?.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0) || 0
      const totalIncome = incomeData?.reduce((sum, inc) => sum + (parseFloat(inc.amount) || 0), 0) || 0
      const netProfit = totalIncome - totalExpenses

      console.log(`Batch ${batchId} - Expenses: ${expensesData?.length || 0}, Income: ${incomeData?.length || 0}`)
      console.log(`Batch ${batchId} - Total Expenses: ${totalExpenses}, Total Income: ${totalIncome}`)

      return {
        total_expenses: totalExpenses,
        total_income: totalIncome,
        net_profit: netProfit,
        expenses: expensesData || [],
        income: incomeData || []
      }
    } catch (error) {
      console.error('Error fetching batch profit/loss:', error)
      return {
        total_expenses: 0,
        total_income: 0,
        net_profit: 0,
        expenses: [],
        income: []
      }
    }
  },

  // Get monthly summary
  async getMonthlySummary(year, month) {
    try {
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
      const endDate = new Date(year, month, 0).toISOString().split('T')[0]

      const [expenses, income] = await Promise.all([
        this.getExpenses({ dateFrom: startDate, dateTo: endDate }),
        this.getIncome({ dateFrom: startDate, dateTo: endDate })
      ])

      const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
      const totalIncome = income.reduce((sum, inc) => sum + parseFloat(inc.amount), 0)

      return {
        totalExpenses,
        totalIncome,
        netProfit: totalIncome - totalExpenses,
        profitMargin: totalExpenses > 0 ? ((totalIncome - totalExpenses) / totalExpenses) * 100 : 0,
        expenses,
        income
      }
    } catch (error) {
      console.error('Error fetching monthly summary:', error)
      return {
        totalExpenses: 0,
        totalIncome: 0,
        netProfit: 0,
        profitMargin: 0,
        expenses: [],
        income: []
      }
    }
  },

  // ==================== BATCH PRODUCTS ====================
  
  // Add product to batch
  async addProductToBatch(batchId, productId, quantity, unitCost) {
    try {
      const totalCost = quantity * unitCost

      const { data, error } = await supabase
        .from('batch_products')
        .insert([{
          batch_id: batchId,
          product_id: productId,
          quantity,
          unit_cost: unitCost,
          total_cost: totalCost,
          created_at: new Date().toISOString()
        }])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error adding product to batch:', error)
      throw error
    }
  },

  // Update batch product
  async updateBatchProduct(batchProductId, updateData) {
    try {
      const { data, error } = await supabase
        .from('batch_products')
        .update(updateData)
        .eq('id', batchProductId)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating batch product:', error)
      throw error
    }
  },

  // Remove product from batch
  async removeProductFromBatch(batchProductId) {
    try {
      const { error } = await supabase
        .from('batch_products')
        .delete()
        .eq('id', batchProductId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error removing product from batch:', error)
      throw error
    }
  },

  // ==================== PRODUCT COST ANALYSIS ====================
  
  // Get product-wise cost analysis
  async getProductCostAnalysis(filters = {}) {
    try {
      let query = supabase
        .from('product_cost_analysis')
        .select('*')
        .order('expense_date', { ascending: false })

      // Apply filters
      if (filters.productName) {
        query = query.ilike('extracted_product_name', `%${filters.productName}%`)
      }
      if (filters.accountingHead) {
        query = query.eq('accounting_head', filters.accountingHead)
      }
      if (filters.batchId) {
        query = query.eq('batch_id', filters.batchId)
      }
      if (filters.dateFrom) {
        query = query.gte('expense_date', filters.dateFrom)
      }
      if (filters.dateTo) {
        query = query.lte('expense_date', filters.dateTo)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching product cost analysis:', error)
      return []
    }
  },

  // Get product cost summary
  async getProductCostSummary(filters = {}) {
    try {
      let query = supabase
        .from('product_cost_summary')
        .select('*')
        .order('total_cost', { ascending: false })

      // Apply filters
      if (filters.productName) {
        query = query.ilike('product_name', `%${filters.productName}%`)
      }
      if (filters.accountingHead) {
        query = query.eq('accounting_head', filters.accountingHead)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching product cost summary:', error)
      return []
    }
  },

  // Get accounting records for inventory item
  async getInventoryAccountingRecords(inventoryItemId) {
    try {
      console.log('Searching for accounting records for inventory item:', inventoryItemId)
      
      // First, let's see all expenses to debug
      const { data: allExpenses, error: allError } = await supabase
        .from('expenses')
        .select('id, description, created_at')
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (!allError) {
        console.log('Recent expenses:', allExpenses)
      }
      
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          accounting_heads(name),
          expense_categories(name),
          batches(batch_name, batch_number)
        `)
        .ilike('description', `%inventory_item_id:${inventoryItemId}%`)
        .order('expense_date', { ascending: false })

      if (error) throw error
      
      console.log('Found accounting records:', data)
      return data
    } catch (error) {
      console.error('Error fetching inventory accounting records:', error)
      return []
    }
  },

  // ==================== BATCH INVENTORY CONSUMPTION ====================

  // Add inventory consumption to batch
  async addBatchInventoryConsumption(consumptionData) {
    try {
      const { data, error } = await supabase
        .from('batch_inventory_consumption')
        .insert([{
          ...consumptionData,
          total_cost: consumptionData.quantity_consumed * consumptionData.unit_cost,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error adding batch inventory consumption:', error)
      throw error
    }
  },

  // Get inventory consumption for a batch
  async getBatchInventoryConsumption(batchId) {
    try {
      const { data, error } = await supabase
        .from('batch_inventory_details')
        .select('*')
        .eq('batch_id', batchId)
        .order('consumption_date', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching batch inventory consumption:', error)
      return []
    }
  },

  // Update batch inventory consumption
  async updateBatchInventoryConsumption(consumptionId, updateData) {
    try {
      const { data, error } = await supabase
        .from('batch_inventory_consumption')
        .update({
          ...updateData,
          total_cost: updateData.quantity_consumed * updateData.unit_cost,
          updated_at: new Date().toISOString()
        })
        .eq('id', consumptionId)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating batch inventory consumption:', error)
      throw error
    }
  },

  // Delete batch inventory consumption
  async deleteBatchInventoryConsumption(consumptionId) {
    try {
      const { error } = await supabase
        .from('batch_inventory_consumption')
        .delete()
        .eq('id', consumptionId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting batch inventory consumption:', error)
      throw error
    }
  },

  // Get batch cost summary
  async getBatchCostSummary(batchId) {
    try {
      const { data, error } = await supabase
        .from('batch_cost_summary')
        .select('*')
        .eq('batch_id', batchId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching batch cost summary:', error)
      return null
    }
  },

  // Get consumption records for a specific inventory item
  async getInventoryConsumptionRecords(inventoryItemId) {
    try {
      const { data, error } = await supabase
        .from('batch_inventory_details')
        .select('*')
        .eq('inventory_item_id', inventoryItemId)
        .order('consumption_date', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching inventory consumption records:', error)
      return []
    }
  }
}
