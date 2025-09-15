import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  Package,
  Receipt,
  X
} from 'lucide-react'
import { accountingService } from '../../services/accountingService'
import { productService } from '../../services/categoryService'

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([])
  const [accountingHeads, setAccountingHeads] = useState([])
  const [expenseCategories, setExpenseCategories] = useState([])
  const [batches, setBatches] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    accountingHeadId: '',
    batchId: '',
    dateFrom: '',
    dateTo: ''
  })

  // Form state
  const [formData, setFormData] = useState({
    accounting_head_id: '',
    expense_category_id: '',
    batch_id: '',
    product_id: '',
    description: '',
    amount: '',
    quantity: '1',
    unit: 'units',
    expense_date: new Date().toISOString().split('T')[0],
    vendor_name: '',
    payment_method: '',
    reference_number: '',
    notes: ''
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    loadExpenses()
  }, [filters])

  const loadInitialData = async () => {
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  const loadExpenses = async () => {
    try {
      const data = await accountingService.getExpenses(filters)
      setExpenses(data)
    } catch (error) {
      console.error('Error loading expenses:', error)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (selectedExpense) {
        await accountingService.updateExpense(selectedExpense.id, formData)
      } else {
        await accountingService.createExpense(formData)
      }

      setShowAddForm(false)
      setShowEditForm(false)
      setSelectedExpense(null)
      setFormData({
        accounting_head_id: '',
        expense_category_id: '',
        batch_id: '',
        product_id: '',
        description: '',
        amount: '',
        quantity: '1',
        unit: 'units',
        expense_date: new Date().toISOString().split('T')[0],
        vendor_name: '',
        payment_method: '',
        reference_number: '',
        notes: ''
      })
      loadExpenses()
    } catch (error) {
      console.error('Error saving expense:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (expense) => {
    setSelectedExpense(expense)
    setFormData({
      accounting_head_id: expense.accounting_head_id,
      expense_category_id: expense.expense_category_id || '',
      batch_id: expense.batch_id || '',
      product_id: expense.product_id || '',
      description: expense.description,
      amount: expense.amount,
      quantity: expense.quantity || '1',
      unit: expense.unit || 'units',
      expense_date: expense.expense_date,
      vendor_name: expense.vendor_name || '',
      payment_method: expense.payment_method || '',
      reference_number: expense.reference_number || '',
      notes: expense.notes || ''
    })
    setShowEditForm(true)
  }

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await accountingService.deleteExpense(expenseId)
        loadExpenses()
      } catch (error) {
        console.error('Error deleting expense:', error)
      }
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-mountain-800">Expense Management</h2>
            <p className="text-mountain-600 mt-1">Track and manage business expenses</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-mountain-600 text-white px-4 py-2 rounded-lg hover:bg-mountain-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-2">Category</label>
            <select
              value={filters.accountingHeadId}
              onChange={(e) => setFilters({ ...filters, accountingHeadId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
            >
              <option value="">All Categories</option>
              {accountingHeads.map((head) => (
                <option key={head.id} value={head.id}>{head.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-2">Batch</label>
            <select
              value={filters.batchId}
              onChange={(e) => setFilters({ ...filters, batchId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
            >
              <option value="">All Batches</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>{batch.batch_number}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
            />
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                    {formatDate(expense.expense_date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-mountain-900">
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      {expense.notes && (
                        <p className="text-gray-500 text-xs mt-1">{expense.notes}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                    <span className="px-2 py-1 text-xs font-medium bg-mountain-100 text-mountain-800 rounded-full">
                      {expense.accounting_heads?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                    {expense.batches?.batch_number || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                    {expense.vendor_name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-mountain-600 hover:text-mountain-900"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-mountain-800">
                  {selectedExpense ? 'Edit Expense' : 'Add New Expense'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setShowEditForm(false)
                    setSelectedExpense(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">
                      Accounting Head *
                    </label>
                    <select
                      value={formData.accounting_head_id}
                      onChange={(e) => {
                        setFormData({ ...formData, accounting_head_id: e.target.value })
                        loadExpenseCategories(e.target.value)
                      }}
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
                        <option key={batch.id} value={batch.id}>{batch.batch_number}</option>
                      ))}
                    </select>
                  </div>

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

                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">
                      Description *
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                      placeholder="Enter expense description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">
                      Amount *
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

                  <div>
                    <label className="block text-sm font-medium text-mountain-700 mb-2">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                      placeholder="units"
                    />
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
                      placeholder="Vendor name"
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
                      placeholder="Reference number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mountain-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="Additional notes"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setShowEditForm(false)
                      setSelectedExpense(null)
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (selectedExpense ? 'Update' : 'Add')} Expense
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ExpenseManager
