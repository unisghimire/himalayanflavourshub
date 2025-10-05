import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  X
} from 'lucide-react'
import { accountingService } from '../../services/accountingService'
import ExcelLikeIncomeForm from './ExcelLikeIncomeForm'

const IncomeManagement = () => {
  const [income, setIncome] = useState([])
  const [filteredIncome, setFilteredIncome] = useState([])
  const [loading, setLoading] = useState(false)
  const [showExcelIncomeForm, setShowExcelIncomeForm] = useState(false)
  const [filters, setFilters] = useState({
    incomeNumber: '',
    description: '',
    category: '',
    customer: '',
    dateFrom: '',
    dateTo: ''
  })
  const [dropdownStates, setDropdownStates] = useState({
    incomeNumber: { isOpen: false, searchTerm: '' },
    description: { isOpen: false, searchTerm: '' },
    category: { isOpen: false, searchTerm: '' },
    customer: { isOpen: false, searchTerm: '' }
  })

  useEffect(() => {
    loadData()
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-dropdown')) {
        setDropdownStates({
          incomeNumber: { isOpen: false, searchTerm: '' },
          description: { isOpen: false, searchTerm: '' },
          category: { isOpen: false, searchTerm: '' },
          customer: { isOpen: false, searchTerm: '' }
        })
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Filter income based on current filters
  useEffect(() => {
    let filtered = income.filter(incomeItem => {
      // Income Number filter
      if (filters.incomeNumber && !incomeItem.income_number?.toLowerCase().includes(filters.incomeNumber.toLowerCase())) {
        return false
      }
      
      // Description filter
      if (filters.description && !incomeItem.description?.toLowerCase().includes(filters.description.toLowerCase())) {
        return false
      }
      
      // Category filter
      if (filters.category && !incomeItem.accounting_heads?.name?.toLowerCase().includes(filters.category.toLowerCase())) {
        return false
      }
      
      // Customer filter
      if (filters.customer && !incomeItem.customers?.name?.toLowerCase().includes(filters.customer.toLowerCase())) {
        return false
      }
      
      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const incomeDate = new Date(incomeItem.income_date)
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom)
          if (incomeDate < fromDate) return false
        }
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo)
          toDate.setHours(23, 59, 59, 999) // Include the entire day
          if (incomeDate > toDate) return false
        }
      }
      
      return true
    })
    
    setFilteredIncome(filtered)
  }, [income, filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const incomeData = await accountingService.getAllIncome()
      setIncome(incomeData)
      setFilteredIncome(incomeData)
    } catch (error) {
      console.error('Error loading income data:', error)
      alert('Error loading income data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      incomeNumber: '',
      description: '',
      category: '',
      customer: '',
      dateFrom: '',
      dateTo: ''
    })
    setDropdownStates({
      incomeNumber: { isOpen: false, searchTerm: '' },
      description: { isOpen: false, searchTerm: '' },
      category: { isOpen: false, searchTerm: '' },
      customer: { isOpen: false, searchTerm: '' }
    })
  }

  // Helper functions to get unique values for dropdowns
  const getUniqueIncomeNumbers = () => {
    return [...new Set(income.map(incomeItem => incomeItem.income_number).filter(Boolean))]
  }

  const getUniqueDescriptions = () => {
    return [...new Set(income.map(incomeItem => incomeItem.description).filter(Boolean))]
  }

  const getUniqueCategories = () => {
    return [...new Set(income.map(incomeItem => incomeItem.accounting_heads?.name).filter(Boolean))]
  }

  const getUniqueCustomers = () => {
    return [...new Set(income.map(incomeItem => incomeItem.customers?.name).filter(Boolean))]
  }

  // Dropdown handlers
  const toggleDropdown = (dropdownName) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdownName]: {
        ...prev[dropdownName],
        isOpen: !prev[dropdownName].isOpen
      }
    }))
  }

  const handleDropdownSearch = (dropdownName, searchTerm) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdownName]: {
        ...prev[dropdownName],
        searchTerm
      }
    }))
  }

  const selectDropdownOption = (dropdownName, value) => {
    setFilters(prev => ({
      ...prev,
      [dropdownName]: value
    }))
    setDropdownStates(prev => ({
      ...prev,
      [dropdownName]: {
        isOpen: false,
        searchTerm: ''
      }
    }))
  }

  // Reusable dropdown component
  const FilterDropdown = ({ 
    label, 
    dropdownName, 
    options, 
    selectedValue, 
    placeholder 
  }) => {
    const dropdownState = dropdownStates[dropdownName]
    const filteredOptions = options.filter(option =>
      option.toLowerCase().includes(selectedValue.toLowerCase())
    )

    const handleInputChange = (e) => {
      const value = e.target.value
      handleFilterChange(dropdownName, value)
      // Keep dropdown open while typing
      if (!dropdownState.isOpen) {
        setDropdownStates(prev => ({
          ...prev,
          [dropdownName]: { ...prev[dropdownName], isOpen: true }
        }))
      }
    }

    const handleInputFocus = () => {
      if (!dropdownState.isOpen) {
        setDropdownStates(prev => ({
          ...prev,
          [dropdownName]: { ...prev[dropdownName], isOpen: true }
        }))
      }
    }

    const handleOptionSelect = (option) => {
      selectDropdownOption(dropdownName, option)
    }

    return (
      <div className="relative filter-dropdown">
        <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
        <div className="relative">
          <input
            type="text"
            value={selectedValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500 pr-6"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => toggleDropdown(dropdownName)}
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <ChevronDown className={`w-3 h-3 transition-transform ${dropdownState.isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {dropdownState.isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className="px-2 py-1.5 text-xs text-gray-900 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-2 py-1.5 text-xs text-gray-500">No options found</div>
            )}
          </div>
        )}
      </div>
    )
  }


  const handleDelete = async (incomeItem) => {
    if (window.confirm('Are you sure you want to delete this income record?')) {
      try {
        await accountingService.deleteIncome(incomeItem.id)
        loadData()
      } catch (error) {
        console.error('Error deleting income:', error)
        alert('Error deleting income record. Please try again.')
      }
    }
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-mountain-800">Income Management</h1>
            <p className="text-mountain-600 mt-1">Manage your income records and transactions</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowExcelIncomeForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Income</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Income</p>
              <p className="text-2xl font-bold">
                Rs. {income.reduce((sum, incomeItem) => sum + parseFloat(incomeItem.amount || 0), 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Records</p>
              <p className="text-2xl font-bold">{income.length}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">This Month</p>
              <p className="text-2xl font-bold">
                Rs. {income
                  .filter(incomeItem => {
                    const incomeDate = new Date(incomeItem.income_date)
                    const now = new Date()
                    return incomeDate.getMonth() === now.getMonth() && incomeDate.getFullYear() === now.getFullYear()
                  })
                  .reduce((sum, incomeItem) => sum + parseFloat(incomeItem.amount || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-medium text-gray-700">Filters</h4>
          <button
            onClick={clearFilters}
            className="text-xs text-mountain-600 hover:text-mountain-700 font-medium"
          >
            Clear All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {/* Income Number Filter */}
          <FilterDropdown
            label="Income Number"
            dropdownName="incomeNumber"
            options={getUniqueIncomeNumbers()}
            selectedValue={filters.incomeNumber}
            placeholder="Search by number..."
          />

          {/* Description Filter */}
          <FilterDropdown
            label="Description"
            dropdownName="description"
            options={getUniqueDescriptions()}
            selectedValue={filters.description}
            placeholder="Search by description..."
          />

          {/* Category Filter */}
          <FilterDropdown
            label="Category"
            dropdownName="category"
            options={getUniqueCategories()}
            selectedValue={filters.category}
            placeholder="Search by category..."
          />

          {/* Customer Filter */}
          <FilterDropdown
            label="Customer"
            dropdownName="customer"
            options={getUniqueCustomers()}
            selectedValue={filters.customer}
            placeholder="Search by customer..."
          />

          {/* Date Range Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Date Range</label>
            <div className="space-y-1">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                placeholder="From date..."
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
              />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                placeholder="To date..."
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            Showing {filteredIncome.length} of {income.length} income records
          </p>
        </div>
      </div>

      {/* Income Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Income Records</h3>
            <button
              onClick={loadData}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
        
        {filteredIncome.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIncome.slice(0, 10).map((incomeItem) => (
                  <tr key={incomeItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {incomeItem.description || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {incomeItem.accounting_heads?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {incomeItem.customers?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      Rs. {parseFloat(incomeItem.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {incomeItem.quantity} {incomeItem.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {incomeItem.payment_method || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {incomeItem.income_date ? new Date(incomeItem.income_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDelete(incomeItem)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
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
        ) : (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {income.length === 0 ? 'No Income Records Yet' : 'No Matching Records'}
            </h3>
            <p className="text-gray-600 mb-6">
              {income.length === 0 
                ? 'Use the "Add Income" button to add your first income record.'
                : 'Try adjusting your filters to see more results.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Excel Income Form Modal */}
      {showExcelIncomeForm && (
        <ExcelLikeIncomeForm
          isOpen={showExcelIncomeForm}
          onClose={() => setShowExcelIncomeForm(false)}
          onSuccess={() => {
            setShowExcelIncomeForm(false)
            loadData()
          }}
        />
      )}
    </div>
  )
}

export default IncomeManagement
