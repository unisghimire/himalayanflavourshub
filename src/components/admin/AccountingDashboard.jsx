import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Calendar,
  PieChart,
  Receipt,
  ShoppingCart,
  X
} from 'lucide-react'
import { accountingService } from '../../services/accountingService'
import { useAuth } from '../../context/AuthContext'
import ExpenseForm from './ExpenseForm'
import IncomeForm from './IncomeForm'
import BatchForm from './BatchForm'
import ProductCostAnalysis from './ProductCostAnalysis'
import BatchInventoryConsumptionForm from './BatchInventoryConsumptionForm'
import BatchInventoryViewModal from './BatchInventoryViewModal'

const AccountingDashboard = ({ selectedInventoryForExpense, onExpenseFormClosed }) => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showAddIncome, setShowAddIncome] = useState(false)
  const [showAddBatch, setShowAddBatch] = useState(false)
  const [showAddBatchConsumption, setShowAddBatchConsumption] = useState(false)
  const [showViewBatchConsumption, setShowViewBatchConsumption] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [editingIncome, setEditingIncome] = useState(null)
  const [selectedBatchForConsumption, setSelectedBatchForConsumption] = useState(null)
  const [selectedBatchForView, setSelectedBatchForView] = useState(null)
  const [batchInventoryConsumption, setBatchInventoryConsumption] = useState([])
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    netProfit: 0,
    profitMargin: 0
  })
  const [accountingHeads, setAccountingHeads] = useState([])
  const [batches, setBatches] = useState([])
  const [expenses, setExpenses] = useState([])
  const [income, setIncome] = useState([])
  const [profitLossData, setProfitLossData] = useState([])

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  // Auto-open expense form when inventory item is selected
  useEffect(() => {
    if (selectedInventoryForExpense) {
      setShowAddExpense(true)
    }
  }, [selectedInventoryForExpense])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [heads, batchesData, expensesData, incomeData, profitData] = await Promise.all([
        accountingService.getAllAccountingHeads(),
        accountingService.getAllBatches(),
        accountingService.getExpenses(),
        accountingService.getIncome(),
        accountingService.getProfitLossAnalysis()
      ])

      // Calculate total cost for each batch including inventory consumption
      const batchesWithCosts = await Promise.all(
        batchesData.map(async (batch) => {
          try {
            const batchAnalysis = await accountingService.getBatchProfitLoss(batch.id)
            const consumptionData = await accountingService.getBatchInventoryConsumption(batch.id)
            const inventoryCost = consumptionData.reduce((sum, item) => sum + (parseFloat(item.total_cost) || 0), 0)
            
            return {
              ...batch,
              totalCost: batchAnalysis?.total_expenses || 0,
              totalIncome: batchAnalysis?.total_income || 0,
              netProfit: batchAnalysis?.net_profit || 0,
              inventoryConsumption: {
                itemCount: consumptionData.length,
                totalCost: inventoryCost,
                items: consumptionData
              }
            }
          } catch (error) {
            console.error(`Error calculating costs for batch ${batch.id}:`, error)
            return {
              ...batch,
              totalCost: 0,
              totalIncome: 0,
              netProfit: 0,
              inventoryConsumption: {
                itemCount: 0,
                totalCost: 0,
                items: []
              }
            }
          }
        })
      )

      setAccountingHeads(heads)
      setBatches(batchesWithCosts)
      setExpenses(expensesData)
      setIncome(incomeData)
      setProfitLossData(profitData)

      // Calculate summary
      const totalExpenses = expensesData.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
      const totalIncome = incomeData.reduce((sum, inc) => sum + parseFloat(inc.amount), 0)
      const netProfit = totalIncome - totalExpenses
      const profitMargin = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0

      setSummary({
        totalExpenses,
        totalIncome,
        netProfit,
        profitMargin
      })
    } catch (error) {
      console.error('Error loading accounting data:', error)
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN')
  }

  const getProfitColor = (profit) => {
    return profit >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getProfitIcon = (profit) => {
    return profit >= 0 ? TrendingUp : TrendingDown
  }

  const handleFormSuccess = () => {
    // Refresh data after successful form submission
    loadInitialData()
    setEditingExpense(null)
    setEditingIncome(null)
  }

  const handleEditExpense = (expense) => {
    setEditingExpense(expense)
    setShowAddExpense(true)
  }

  const handleEditIncome = (income) => {
    setEditingIncome(income)
    setShowAddIncome(true)
  }

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await accountingService.deleteExpense(expenseId)
        loadInitialData()
      } catch (error) {
        console.error('Error deleting expense:', error)
        alert('Error deleting expense. Please try again.')
      }
    }
  }

  const handleDeleteIncome = async (incomeId) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        await accountingService.deleteIncome(incomeId)
        loadInitialData()
      } catch (error) {
        console.error('Error deleting income:', error)
        alert('Error deleting income. Please try again.')
      }
    }
  }

  const handleAddBatchConsumption = (batch) => {
    setSelectedBatchForConsumption(batch)
    setShowAddBatchConsumption(true)
  }

  const handleBatchConsumptionSuccess = () => {
    setShowAddBatchConsumption(false)
    setSelectedBatchForConsumption(null)
    loadInitialData()
  }

  const handleViewBatchConsumption = (batch) => {
    setSelectedBatchForView(batch)
    setShowViewBatchConsumption(true)
  }

  const handleViewConsumptionClose = () => {
    setShowViewBatchConsumption(false)
    setSelectedBatchForView(null)
    loadInitialData()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-mountain-800">Accounting Dashboard</h2>
            <p className="text-mountain-600 mt-1">Track expenses, income, and profit analysis</p>
          </div>
           <div className="flex space-x-3">
             <button 
               onClick={() => alert('Export functionality coming soon!')}
               className="bg-mountain-600 text-white px-4 py-2 rounded-lg hover:bg-mountain-700 transition-colors flex items-center space-x-2"
             >
               <Download className="w-4 h-4" />
               <span>Export Report</span>
             </button>
             <div className="relative">
               <button 
                 onClick={() => setShowAddExpense(true)}
                 className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
               >
                 <Plus className="w-4 h-4" />
                 <span>Add Expense</span>
               </button>
             </div>
             <button 
               onClick={() => setShowAddIncome(true)}
               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
             >
               <Plus className="w-4 h-4" />
               <span>Add Income</span>
             </button>
             <button 
               onClick={() => setShowAddBatch(true)}
               className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
             >
               <Plus className="w-4 h-4" />
               <span>Create Batch</span>
             </button>
           </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mountain-600">Total Expenses</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(summary.totalExpenses)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mountain-600">Total Income</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(summary.totalIncome)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mountain-600">Net Profit</p>
              <p className={`text-xl font-bold ${getProfitColor(summary.netProfit)}`}>
                {formatCurrency(summary.netProfit)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              summary.netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {React.createElement(getProfitIcon(summary.netProfit), {
                className: `w-6 h-6 ${getProfitColor(summary.netProfit)}`
              })}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-mountain-600">Profit Margin</p>
              <p className={`text-xl font-bold ${getProfitColor(summary.profitMargin)}`}>
                {summary.profitMargin.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
             {[
               { id: 'overview', name: 'Overview', icon: BarChart3 },
               { id: 'expenses', name: 'Expenses', icon: TrendingDown },
               { id: 'income', name: 'Income', icon: TrendingUp },
               { id: 'batches', name: 'Batches', icon: Package },
               { id: 'products', name: 'Product Costs', icon: Package },
               { id: 'reports', name: 'Reports', icon: PieChart }
             ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-mountain-500 text-mountain-600'
                    : 'border-transparent text-mountain-500 hover:text-mountain-700 hover:border-mountain-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-mountain-800">Financial Overview</h3>
              
              {/* Recent Transactions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-mountain-700 mb-4">Recent Expenses</h4>
                  <div className="space-y-3">
                    {expenses.slice(0, 5).map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-mountain-800">{expense.description}</p>
                          <p className="text-sm text-mountain-600">{expense.accounting_heads?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600">{formatCurrency(expense.amount)}</p>
                          <p className="text-sm text-mountain-500">{formatDate(expense.expense_date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-mountain-700 mb-4">Recent Income</h4>
                  <div className="space-y-3">
                    {income.slice(0, 5).map((inc) => (
                      <div key={inc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-mountain-800">{inc.description}</p>
                          <p className="text-sm text-mountain-600">{inc.accounting_heads?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{formatCurrency(inc.amount)}</p>
                          <p className="text-sm text-mountain-500">{formatDate(inc.income_date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Batch Performance */}
              <div>
                <h4 className="text-md font-medium text-mountain-700 mb-4">Batch Performance</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {profitLossData.slice(0, 10).map((batch) => (
                        <tr key={batch.batch_id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-mountain-900">
                            {batch.batch_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                            {formatDate(batch.production_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                            {formatCurrency(batch.total_expenses)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                            {formatCurrency(batch.total_income)}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getProfitColor(batch.net_profit)}`}>
                            {formatCurrency(batch.net_profit)}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${getProfitColor(batch.profit_margin_percentage)}`}>
                            {batch.profit_margin_percentage.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Expenses Tab */}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-semibold text-mountain-800">Expense Management</h3>
                 <button 
                   onClick={() => setShowAddExpense(true)}
                   className="bg-mountain-600 text-white px-4 py-2 rounded-lg hover:bg-mountain-700 transition-colors flex items-center space-x-2"
                 >
                   <Plus className="w-4 h-4" />
                   <span>Add Expense</span>
                 </button>
               </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.map((expense) => (
                      <tr key={expense.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                          {formatDate(expense.expense_date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-mountain-900">{expense.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                          {expense.accounting_heads?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                          {expense.batches?.batch_number || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditExpense(expense)}
                              className="text-mountain-600 hover:text-mountain-900"
                              title="Edit expense"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete expense"
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
          )}

          {/* Income Tab */}
          {activeTab === 'income' && (
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-semibold text-mountain-800">Income Management</h3>
                 <button 
                   onClick={() => setShowAddIncome(true)}
                   className="bg-mountain-600 text-white px-4 py-2 rounded-lg hover:bg-mountain-700 transition-colors flex items-center space-x-2"
                 >
                   <Plus className="w-4 h-4" />
                   <span>Add Income</span>
                 </button>
               </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {income.map((inc) => (
                      <tr key={inc.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                          {formatDate(inc.income_date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-mountain-900">{inc.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                          {inc.accounting_heads?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                          {inc.customer_name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          {formatCurrency(inc.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditIncome(inc)}
                              className="text-mountain-600 hover:text-mountain-900"
                              title="Edit income"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteIncome(inc.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete income"
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
          )}

           {/* Batches Tab */}
           {activeTab === 'batches' && (
             <div className="space-y-6">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-semibold text-mountain-800">Batch Management</h3>
                 <button 
                   onClick={() => setShowAddBatch(true)}
                   className="bg-mountain-600 text-white px-4 py-2 rounded-lg hover:bg-mountain-700 transition-colors flex items-center space-x-2"
                 >
                   <Plus className="w-4 h-4" />
                   <span>Create Batch</span>
                 </button>
               </div>

               {/* Batch Summary Cards */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <div className="bg-white border border-gray-200 rounded-lg p-6">
                   <div className="flex items-center">
                     <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                       <Package className="w-6 h-6 text-blue-600" />
                     </div>
                     <div className="ml-4">
                       <p className="text-sm font-medium text-mountain-500">Total Batches</p>
                       <p className="text-2xl font-bold text-mountain-800">{batches.length}</p>
                     </div>
                   </div>
                 </div>

                 <div className="bg-white border border-gray-200 rounded-lg p-6">
                   <div className="flex items-center">
                     <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                       <TrendingDown className="w-6 h-6 text-red-600" />
                     </div>
                     <div className="ml-4">
                       <p className="text-sm font-medium text-mountain-500">Total Costs</p>
                       <p className="text-xl font-bold text-red-600">
                         {formatCurrency(batches.reduce((sum, batch) => sum + batch.totalCost, 0))}
                       </p>
                     </div>
                   </div>
                 </div>

                 <div className="bg-white border border-gray-200 rounded-lg p-6">
                   <div className="flex items-center">
                     <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                       <TrendingUp className="w-6 h-6 text-green-600" />
                     </div>
                     <div className="ml-4">
                       <p className="text-sm font-medium text-mountain-500">Total Income</p>
                       <p className="text-xl font-bold text-green-600">
                         {formatCurrency(batches.reduce((sum, batch) => sum + batch.totalIncome, 0))}
                       </p>
                     </div>
                   </div>
                 </div>

                 <div className="bg-white border border-gray-200 rounded-lg p-6">
                   <div className="flex items-center">
                     <div className="w-12 h-12 bg-mountain-100 rounded-lg flex items-center justify-center">
                       <DollarSign className="w-6 h-6 text-mountain-600" />
                     </div>
                     <div className="ml-4">
                       <p className="text-sm font-medium text-mountain-500">Net Profit</p>
                       <p className={`text-xl font-bold ${batches.reduce((sum, batch) => sum + batch.netProfit, 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                         {formatCurrency(batches.reduce((sum, batch) => sum + batch.netProfit, 0))}
                       </p>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Name</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Number</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Production Date</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Income</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Profit</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {batches.map((batch) => (
                       <tr key={batch.id} className="hover:bg-gray-50">
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="flex items-center">
                             <div className="w-8 h-8 bg-mountain-100 rounded-lg flex items-center justify-center mr-3">
                               <Package className="w-4 h-4 text-mountain-600" />
                             </div>
                             <div>
                               <div className="text-sm font-medium text-mountain-900">{batch.batch_name}</div>
                               <div className="text-sm text-mountain-500">{batch.notes || 'No notes'}</div>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                           {batch.batch_number}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                           {formatDate(batch.production_date)}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <span className="px-2 py-1 text-xs font-medium bg-mountain-100 text-mountain-800 rounded-full">
                             {batch.status}
                           </span>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                           {formatCurrency(batch.totalCost)}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                           {formatCurrency(batch.totalIncome)}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                           <span className={batch.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                             {formatCurrency(batch.netProfit)}
                           </span>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                           {batch.batch_products?.length || 0}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                           <div className="space-y-1">
                             <div className="font-medium text-mountain-900">
                               {batch.inventoryConsumption?.itemCount || 0} items
                             </div>
                             <div className="text-xs text-mountain-600">
                               Rs.{(batch.inventoryConsumption?.totalCost || 0).toFixed(2)}
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-mountain-500">
                           <div className="flex space-x-2">
                             <button 
                               onClick={() => handleAddBatchConsumption(batch)}
                               className="text-blue-600 hover:text-blue-900"
                               title="Add Inventory Consumption"
                             >
                               <Package className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => handleViewBatchConsumption(batch)}
                               className="text-green-600 hover:text-green-900"
                               title="View Inventory Consumption"
                             >
                               <Eye className="w-4 h-4" />
                             </button>
                             <button className="text-mountain-600 hover:text-mountain-900">
                               <Edit className="w-4 h-4" />
                             </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
           )}

           {/* Product Costs Tab */}
           {activeTab === 'products' && (
             <ProductCostAnalysis />
           )}

           {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-mountain-800">Financial Reports</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-mountain-800 mb-4">Expense by Category</h4>
                  <p className="text-mountain-600">Chart will be implemented here</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-mountain-800 mb-4">Monthly Trends</h4>
                  <p className="text-mountain-600">Chart will be implemented here</p>
                </div>
              </div>
            </div>
          )}
         </div>
       </div>

       {/* Forms */}
            <ExpenseForm 
              isOpen={showAddExpense} 
              onClose={() => {
                setShowAddExpense(false)
                setEditingExpense(null)
                if (onExpenseFormClosed) {
                  onExpenseFormClosed()
                }
              }}
              onSuccess={handleFormSuccess}
              editingData={editingExpense}
              preSelectedInventory={selectedInventoryForExpense}
            />
            
            <IncomeForm 
              isOpen={showAddIncome} 
              onClose={() => {
                setShowAddIncome(false)
                setEditingIncome(null)
              }} 
              onSuccess={handleFormSuccess}
              editingData={editingIncome}
            />
       
      <BatchForm 
        isOpen={showAddBatch} 
        onClose={() => setShowAddBatch(false)} 
        onSuccess={handleFormSuccess}
      />

      {/* Batch Inventory Consumption Form Modal */}
      <BatchInventoryConsumptionForm
        isOpen={showAddBatchConsumption}
        onClose={() => setShowAddBatchConsumption(false)}
        onSuccess={handleBatchConsumptionSuccess}
        batchId={selectedBatchForConsumption?.id}
        batchName={selectedBatchForConsumption?.batch_name}
      />

      {/* Batch Inventory View Modal */}
      <BatchInventoryViewModal
        isOpen={showViewBatchConsumption}
        onClose={handleViewConsumptionClose}
        batchId={selectedBatchForView?.id}
        batchName={selectedBatchForView?.batch_name}
      />
    </div>
  )
}
 
 export default AccountingDashboard
