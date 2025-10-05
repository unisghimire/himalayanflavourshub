import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Tag, 
  Layers, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  RefreshCw,
  Eye,
  X,
  DollarSign,
  ChevronDown
} from 'lucide-react'
import ExcelLikeInventoryForm from './ExcelLikeInventoryForm'
import inventoryService from '../../services/inventoryService'
import { accountingService } from '../../services/accountingService'
import unitService from '../../services/unitService'
import SimpleItemForm from './SimpleItemForm'
import SimpleBatchForm from './SimpleBatchForm'
import CategoryForm from './CategoryForm'

const InventoryManagementDashboard = ({ activeSubMenu: propActiveSubMenu }) => {
  const [activeSubMenu, setActiveSubMenu] = useState(propActiveSubMenu || 'add-inventory')
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [batches, setBatches] = useState([])
  const [units, setUnits] = useState([])
  const [batchCategories, setBatchCategories] = useState([])
  const [expenses, setExpenses] = useState([])
  const [filteredExpenses, setFilteredExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    expenseId: '',
    itemName: '',
    category: '',
    batch: '',
    vendor: '',
    dateFrom: '',
    dateTo: ''
  })
  const [dropdownStates, setDropdownStates] = useState({
    expenseId: { isOpen: false, searchTerm: '' },
    itemName: { isOpen: false, searchTerm: '' },
    category: { isOpen: false, searchTerm: '' },
    batch: { isOpen: false, searchTerm: '' },
    vendor: { isOpen: false, searchTerm: '' }
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editData, setEditData] = useState({})
  const [showExcelForm, setShowExcelForm] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [addFormType, setAddFormType] = useState('') // 'item', 'category', 'batch'

  // Sub-menu options
  const subMenus = [
    { id: 'add-inventory', label: 'Add Inventory & Expenses', icon: Plus },
    { id: 'items', label: 'Items', icon: Package },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'batches', label: 'Batches', icon: Layers }
  ]

  // Load initial data
  const loadData = async () => {
    setLoading(true)
    try {
      const [itemsData, categoriesData, batchesData, unitsData, batchCategoriesData, expensesData] = await Promise.all([
        inventoryService.getAllItems(),
        inventoryService.getAllCategories(),
        accountingService.getAllBatches(),
        unitService.getAllUnits(),
        accountingService.getAllBatchCategories(),
        accountingService.getExpenses()
      ])
      
      setItems(itemsData)
      setCategories(categoriesData)
      setBatches(batchesData)
      setUnits(unitsData)
      setBatchCategories(batchCategoriesData)
      setExpenses(expensesData)
    setFilteredExpenses(expensesData)
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Error loading data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-dropdown')) {
        setDropdownStates({
          expenseId: { isOpen: false, searchTerm: '' },
          itemName: { isOpen: false, searchTerm: '' },
          category: { isOpen: false, searchTerm: '' },
          batch: { isOpen: false, searchTerm: '' },
          vendor: { isOpen: false, searchTerm: '' }
        })
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Filter expenses based on current filters
  useEffect(() => {
    let filtered = expenses.filter(expense => {
      // Expense ID filter
      if (filters.expenseId && !expense.expense_number?.toLowerCase().includes(filters.expenseId.toLowerCase())) {
        return false
      }
      
      // Item Name filter
      if (filters.itemName) {
        const itemName = expense.description ? expense.description.split(' - ')[0] : ''
        if (!itemName.toLowerCase().includes(filters.itemName.toLowerCase())) {
          return false
        }
      }
      
      // Category filter
      if (filters.category && !expense.accounting_heads?.name?.toLowerCase().includes(filters.category.toLowerCase())) {
        return false
      }
      
      // Batch filter
      if (filters.batch && !expense.batches?.batch_name?.toLowerCase().includes(filters.batch.toLowerCase())) {
        return false
      }
      
      // Vendor filter
      if (filters.vendor && !expense.vendor_name?.toLowerCase().includes(filters.vendor.toLowerCase())) {
        return false
      }
      
      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const expenseDate = new Date(expense.expense_date)
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom)
          if (expenseDate < fromDate) return false
        }
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo)
          toDate.setHours(23, 59, 59, 999) // Include the entire day
          if (expenseDate > toDate) return false
        }
      }
      
      return true
    })
    
    setFilteredExpenses(filtered)
  }, [expenses, filters])

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      expenseId: '',
      itemName: '',
      category: '',
      batch: '',
      vendor: '',
      dateFrom: '',
      dateTo: ''
    })
    setDropdownStates({
      expenseId: { isOpen: false, searchTerm: '' },
      itemName: { isOpen: false, searchTerm: '' },
      category: { isOpen: false, searchTerm: '' },
      batch: { isOpen: false, searchTerm: '' },
      vendor: { isOpen: false, searchTerm: '' }
    })
  }

  // Helper functions to get unique values for dropdowns
  const getUniqueExpenseIds = () => {
    return [...new Set(expenses.map(expense => expense.expense_number).filter(Boolean))]
  }

  const getUniqueItemNames = () => {
    return [...new Set(expenses.map(expense => 
      expense.description ? expense.description.split(' - ')[0] : ''
    ).filter(Boolean))]
  }

  const getUniqueCategories = () => {
    return [...new Set(expenses.map(expense => 
      expense.accounting_heads?.name
    ).filter(Boolean))]
  }

  const getUniqueBatches = () => {
    return [...new Set(expenses.map(expense => 
      expense.batches?.batch_name
    ).filter(Boolean))]
  }

  const getUniqueVendors = () => {
    return [...new Set(expenses.map(expense => 
      expense.vendor_name
    ).filter(Boolean))]
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

  // Sync prop with internal state
  useEffect(() => {
    if (propActiveSubMenu) {
      setActiveSubMenu(propActiveSubMenu)
    }
  }, [propActiveSubMenu])

  // Handle edit
  const handleEdit = (item, type) => {
    setSelectedItem({ ...item, type })
    setEditData(item)
    setShowEditModal(true)
  }

  // Handle delete
  const handleDelete = (item, type) => {
    setSelectedItem({ ...item, type })
    setShowDeleteModal(true)
  }

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedItem) return

    try {
      if (selectedItem.type === 'item') {
        await inventoryService.deleteItem(selectedItem.id)
        setItems(prev => prev.filter(item => item.id !== selectedItem.id))
      } else if (selectedItem.type === 'category') {
        await inventoryService.deleteCategory(selectedItem.id)
        setCategories(prev => prev.filter(cat => cat.id !== selectedItem.id))
      } else if (selectedItem.type === 'batch') {
        await accountingService.deleteBatch(selectedItem.id)
        setBatches(prev => prev.filter(batch => batch.id !== selectedItem.id))
      }
      
      setShowDeleteModal(false)
      setSelectedItem(null)
      alert('Item deleted successfully!')
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Error deleting item. Please try again.')
    }
  }

  // Handle Add New button click
  const handleAddNew = () => {
    if (activeSubMenu === 'add-inventory') {
      setShowExcelForm(true)
    } else if (activeSubMenu === 'items') {
      setAddFormType('item')
      setShowAddForm(true)
    } else if (activeSubMenu === 'categories') {
      setAddFormType('category')
      setShowAddForm(true)
    } else if (activeSubMenu === 'batches') {
      setAddFormType('batch')
      setShowAddForm(true)
    }
  }

  // Handle adding new item
  const handleAddItem = async (formData) => {
    try {
      if (addFormType === 'item') {
        const newItem = await inventoryService.createItem(formData)
        setItems(prev => [...prev, newItem])
      } else if (addFormType === 'category') {
        const newCategory = await inventoryService.createCategory(formData)
        setCategories(prev => [...prev, newCategory])
      } else if (addFormType === 'batch') {
        const newBatch = await accountingService.createBatch(formData)
        setBatches(prev => [...prev, newBatch])
      }
      
      setShowAddForm(false)
      setAddFormType('')
      alert(`${addFormType.charAt(0).toUpperCase() + addFormType.slice(1)} added successfully!`)
    } catch (error) {
      console.error(`Error adding ${addFormType}:`, error)
      alert(`Error adding ${addFormType}. Please try again.`)
    }
  }

  // Save edit
  const saveEdit = async () => {
    if (!selectedItem) return

    try {
      if (selectedItem.type === 'item') {
        const updatedItem = await inventoryService.updateItem(selectedItem.id, editData)
        setItems(prev => prev.map(item => item.id === selectedItem.id ? updatedItem : item))
      } else if (selectedItem.type === 'category') {
        const updatedCategory = await inventoryService.updateCategory(selectedItem.id, editData)
        setCategories(prev => prev.map(cat => cat.id === selectedItem.id ? updatedCategory : cat))
      } else if (selectedItem.type === 'batch') {
        const updatedBatch = await accountingService.updateBatch(selectedItem.id, editData)
        setBatches(prev => prev.map(batch => batch.id === selectedItem.id ? updatedBatch : batch))
      }
      
      setShowEditModal(false)
      setSelectedItem(null)
      setEditData({})
      alert('Item updated successfully!')
    } catch (error) {
      console.error('Error updating item:', error)
      alert('Error updating item. Please try again.')
    }
  }

  // Filter data based on search term
  const getFilteredData = () => {
    const data = activeSubMenu === 'items' ? items : 
                 activeSubMenu === 'categories' ? categories : 
                 activeSubMenu === 'batches' ? batches : []
    
    if (!searchTerm) return data
    
    return data.filter(item => {
      const searchFields = activeSubMenu === 'items' ? [item.name, item.description] :
                          activeSubMenu === 'categories' ? [item.name, item.description] :
                          activeSubMenu === 'batches' ? [item.batch_name, item.batch_number, item.description] : []
      
      return searchFields.some(field => 
        field && field.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }

  const filteredData = getFilteredData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-mountain-800">Inventory & Expenses Management</h1>
            <p className="text-mountain-600 mt-1">Manage your inventory items, categories, and batches</p>
          </div>
           <button
             onClick={handleAddNew}
             className="flex items-center space-x-2 px-4 py-2 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700 transition-colors"
           >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </button>
        </div>
      </div>


      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {activeSubMenu === 'add-inventory' && (
          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Expenses</p>
                    <p className="text-2xl font-bold">{expenses.length}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Amount</p>
                    <p className="text-2xl font-bold">
                      Rs. {expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Items</p>
                    <p className="text-2xl font-bold">{items.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-purple-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Total Batches</p>
                    <p className="text-2xl font-bold">{batches.length}</p>
                  </div>
                  <Layers className="w-8 h-8 text-orange-200" />
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
                {/* Item Name Filter */}
                <FilterDropdown
                  label="Item Name"
                  dropdownName="itemName"
                  options={getUniqueItemNames()}
                  selectedValue={filters.itemName}
                  placeholder="Search by item..."
                />

                {/* Category Filter */}
                <FilterDropdown
                  label="Category"
                  dropdownName="category"
                  options={getUniqueCategories()}
                  selectedValue={filters.category}
                  placeholder="Search by category..."
                />

                {/* Batch Filter */}
                <FilterDropdown
                  label="Batch"
                  dropdownName="batch"
                  options={getUniqueBatches()}
                  selectedValue={filters.batch}
                  placeholder="Search by batch..."
                />

                {/* Vendor Filter */}
                <FilterDropdown
                  label="Vendor"
                  dropdownName="vendor"
                  options={getUniqueVendors()}
                  selectedValue={filters.vendor}
                  placeholder="Search by vendor..."
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
                  Showing {filteredExpenses.length} of {expenses.length} expenses
                </p>
              </div>
            </div>

            {/* Recent Expenses Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
                  <button
                    onClick={loadData}
                    className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
              
              {filteredExpenses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredExpenses.slice(0, 10).map((expense) => (
                        <tr key={expense.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {expense.description ? expense.description.split(' - ')[0] : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {expense.accounting_heads?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {expense.batches?.batch_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                            Rs. {parseFloat(expense.amount || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {expense.quantity} {expense.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {expense.vendor_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(expense.expense_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEdit(expense, 'expense')}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(expense, 'expense')}
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
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {expenses.length === 0 ? 'No Expenses Yet' : 'No Matching Expenses'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {expenses.length === 0 
                      ? 'Use the "Add New" button in the header to add your first inventory item and expense.'
                      : 'Try adjusting your filters to see more results.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {(activeSubMenu === 'items' || activeSubMenu === 'categories' || activeSubMenu === 'batches') && (
          <div className="p-6">
            {/* Search and Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeSubMenu}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  />
                </div>
                <span className="text-sm text-gray-500">
                  {filteredData.length} {activeSubMenu} found
                </span>
              </div>
              <button
                onClick={loadData}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>

            {/* Data Table */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-6 h-6 animate-spin text-mountain-600" />
                <span className="ml-2 text-mountain-600">Loading...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {activeSubMenu === 'items' && (
                        <>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Unit</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </>
                      )}
                      {activeSubMenu === 'categories' && (
                        <>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </>
                      )}
                      {activeSubMenu === 'batches' && (
                        <>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Batch Number</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Batch Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Production Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        {activeSubMenu === 'items' && (
                          <>
                            <td className="py-3 px-4 text-gray-900">{item.name}</td>
                <td className="py-3 px-4 text-gray-600">
                  {(() => {
                    const category = categories.find(cat => cat.id === item.category_id);
                    return category ? category.name : 'N/A';
                  })()}
                </td>
                            <td className="py-3 px-4 text-gray-600">{item.unit || 'N/A'}</td>
                            <td className="py-3 px-4 text-gray-600">{item.description || 'N/A'}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEdit(item, 'item')}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item, 'item')}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                        {activeSubMenu === 'categories' && (
                          <>
                            <td className="py-3 px-4 text-gray-900">{item.name}</td>
                            <td className="py-3 px-4 text-gray-600">{item.description || 'N/A'}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {item.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEdit(item, 'category')}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item, 'category')}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                        {activeSubMenu === 'batches' && (
                          <>
                            <td className="py-3 px-4 text-gray-900">{item.batch_number}</td>
                            <td className="py-3 px-4 text-gray-900">{item.batch_name}</td>
                            <td className="py-3 px-4 text-gray-600">
                              {item.batch_categories?.name || 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {item.production_date ? new Date(item.production_date).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {item.status || 'Active'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEdit(item, 'batch')}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item, 'batch')}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredData.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No {activeSubMenu} found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit {selectedItem.type}
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {selectedItem.type === 'item' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={editData.name || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={editData.category_id || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, category_id: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                      <input
                        type="text"
                        value={editData.unit || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, unit: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editData.description || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                        rows="3"
                      />
                    </div>
                  </>
                )}
                {selectedItem.type === 'category' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={editData.name || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editData.description || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                        rows="3"
                      />
                    </div>
                  </>
                )}
                {selectedItem.type === 'batch' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
                      <input
                        type="text"
                        value={editData.batch_name || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, batch_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Batch Category</label>
                      <select
                        value={editData.batch_category_id || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, batch_category_id: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                      >
                        <option value="">Select a batch category</option>
                        {batchCategories.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editData.description || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={editData.status || 'active'}
                        onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this {selectedItem.type}? This action cannot be undone.
              </p>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
         </div>
       )}

       {/* Add Form Modal */}
       {showAddForm && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           {addFormType === 'item' && (
             <SimpleItemForm
               isOpen={showAddForm}
               onClose={() => setShowAddForm(false)}
               onSuccess={() => {
                 setShowAddForm(false)
                 loadData()
               }}
             />
           )}
           {addFormType === 'category' && (
             <CategoryForm
               isOpen={showAddForm}
               onClose={() => setShowAddForm(false)}
               onSuccess={() => {
                 setShowAddForm(false)
                 loadData()
               }}
             />
           )}
           {addFormType === 'batch' && (
             <SimpleBatchForm
               isOpen={showAddForm}
               onClose={() => setShowAddForm(false)}
               onSuccess={() => {
                 setShowAddForm(false)
                 loadData()
               }}
             />
           )}
         </div>
       )}

       {/* Excel Form Modal */}
      {showExcelForm && (
        <ExcelLikeInventoryForm 
          isOpen={showExcelForm}
          onClose={() => setShowExcelForm(false)}
          onSuccess={() => {
            setShowExcelForm(false)
            loadData() // Refresh data after successful submission
          }}
        />
      )}
    </div>
  )
}

export default InventoryManagementDashboard
