import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { X, Save, Plus, Trash2, Package, DollarSign, Edit, ChevronDown } from 'lucide-react'
import inventoryService from '../../services/inventoryService'
import { accountingService } from '../../services/accountingService'
import unitService from '../../services/unitService'

const ExcelLikeInventoryForm = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [accountingHeads, setAccountingHeads] = useState([])
  const [categories, setCategories] = useState([])
  const [batches, setBatches] = useState([])
  const [batchCategories, setBatchCategories] = useState([])
  const [units, setUnits] = useState([])
  const [filteredUnits, setFilteredUnits] = useState([])
  const [showUnitDropdown, setShowUnitDropdown] = useState({})
  const [dropdownPosition, setDropdownPosition] = useState({})
  
  // Item name dropdown states
  const [inventoryItems, setInventoryItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [showItemDropdown, setShowItemDropdown] = useState({})
  const [itemDropdownPosition, setItemDropdownPosition] = useState({})
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [newItemData, setNewItemData] = useState({
    name: '',
    category_id: '',
    unit: '',
    description: ''
  })

  // Category dropdown states
  const [filteredCategories, setFilteredCategories] = useState([])
  const [showCategoryDropdown, setShowCategoryDropdown] = useState({})
  const [categoryDropdownPosition, setCategoryDropdownPosition] = useState({})
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [categorySearchTerms, setCategorySearchTerms] = useState({})
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    description: ''
  })

  // Batch dropdown states
  const [filteredBatches, setFilteredBatches] = useState([])
  const [showBatchDropdown, setShowBatchDropdown] = useState({})
  const [batchDropdownPosition, setBatchDropdownPosition] = useState({})
  const [showAddBatchModal, setShowAddBatchModal] = useState(false)
  const [batchSearchTerms, setBatchSearchTerms] = useState({})
  const [newBatchData, setNewBatchData] = useState({
    description: '',
    production_date: new Date().toISOString().split('T')[0],
    batch_category_id: ''
  })
  const [generatedBatchName, setGeneratedBatchName] = useState('')
  const [isGeneratingBatchName, setIsGeneratingBatchName] = useState(false)
  
  
  // Excel-like data structure
  const [items, setItems] = useState([
    {
      id: 1,
      name: '',
      category_id: '',
      unit: '',
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.unit-dropdown-container')) {
        setShowUnitDropdown({})
      }
      if (!event.target.closest('.item-dropdown-container')) {
        setShowItemDropdown({})
      }
      if (!event.target.closest('.category-dropdown-container')) {
        setShowCategoryDropdown({})
      }
      if (!event.target.closest('.batch-dropdown-container')) {
        setShowBatchDropdown({})
      }
    }

    if (Object.keys(showUnitDropdown).length > 0 || Object.keys(showItemDropdown).length > 0 || Object.keys(showCategoryDropdown).length > 0 || Object.keys(showBatchDropdown).length > 0) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showUnitDropdown, showItemDropdown, showCategoryDropdown, showBatchDropdown])


  const loadInitialData = async () => {
    try {
      const [heads, categoriesData, batchesData, batchCategoriesData, unitsData, itemsData] = await Promise.all([
        accountingService.getAllAccountingHeads(),
        inventoryService.getAllCategories(),
        accountingService.getAllBatches(),
        accountingService.getAllBatchCategories(),
        unitService.getAllUnits(),
        inventoryService.getAllItems()
      ])

      setAccountingHeads(heads)
      setCategories(categoriesData)
      setBatches(batchesData)
      setBatchCategories(batchCategoriesData)
      setUnits(unitsData)
      setFilteredUnits(unitsData)
      setInventoryItems(itemsData)
      setFilteredItems(itemsData)
      setFilteredCategories(categoriesData)
      setFilteredBatches(batchesData)
      
      
      // Initialize category search terms for existing items
      const initialCategorySearchTerms = {}
      items.forEach(item => {
        if (item.category_id) {
          const category = categoriesData.find(cat => cat.id === item.category_id)
          if (category) {
            initialCategorySearchTerms[item.id] = category.name
          }
        }
      })
      setCategorySearchTerms(initialCategorySearchTerms)
      
      // Initialize batch search terms for existing items
      const initialBatchSearchTerms = {}
      items.forEach(item => {
        if (item.batch_id) {
          const batch = batchesData.find(batch => batch.id === item.batch_id)
          if (batch) {
            initialBatchSearchTerms[item.id] = batch.batch_number
          }
        }
      })
      setBatchSearchTerms(initialBatchSearchTerms)
    } catch (error) {
      console.error('Error loading initial data:', error)
    }
  }

  // Filter units based on search
  const filterUnits = (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      setFilteredUnits(units)
      return
    }
    
    const filtered = units.filter(unit => 
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUnits(filtered)
  }

  // Filter items based on search
  const filterItems = (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      setFilteredItems(inventoryItems)
      return
    }
    
    const filtered = inventoryItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredItems(filtered)
  }

  // Filter categories based on search
  const filterCategories = (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      setFilteredCategories(categories)
      return
    }
    
    const filtered = categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredCategories(filtered)
  }

  // Filter batches based on search
  const filterBatches = (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      setFilteredBatches(batches)
      return
    }
    
    const filtered = batches.filter(batch => 
      batch.batch_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (batch.batch_name && batch.batch_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (batch.description && batch.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredBatches(filtered)
  }

  // Handle unit search
  const handleUnitSearch = (itemId, searchTerm) => {
    filterUnits(searchTerm)
  }

  // Handle item search
  const handleItemSearch = (itemId, searchTerm) => {
    filterItems(searchTerm)
  }

  // Handle category search
  const handleCategorySearch = (itemId, searchTerm) => {
    filterCategories(searchTerm)
  }

  // Handle batch search
  const handleBatchSearch = (itemId, searchTerm) => {
    filterBatches(searchTerm)
  }

  // Generate batch name when category changes
  const generateBatchName = async (categoryId) => {
    if (!categoryId) {
      setGeneratedBatchName('')
      setIsGeneratingBatchName(false)
      return
    }

    setIsGeneratingBatchName(true)
    try {
      // Generate auto-incremental batch number
      const batchNumber = await accountingService.generateBatchNumber(categoryId)
      
      // Get category name for auto-generated batch name
      const selectedCategory = batchCategories.find(cat => cat.id === categoryId)
      const autoBatchName = `${batchNumber} - ${selectedCategory.name}`
      
      setGeneratedBatchName(autoBatchName)
    } catch (error) {
      console.error('Error generating batch name:', error)
      setGeneratedBatchName('')
    } finally {
      setIsGeneratingBatchName(false)
    }
  }

  // Toggle unit dropdown
  const toggleUnitDropdown = (itemId, event) => {
    const isOpen = showUnitDropdown[itemId]
    
    if (!isOpen) {
      // Calculate position when opening
      const rect = event.target.closest('.unit-dropdown-container').getBoundingClientRect()
      setDropdownPosition(prev => ({
        ...prev,
        [itemId]: {
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        }
      }))
      // Show all units when opening
      setFilteredUnits(units)
    }
    
    setShowUnitDropdown(prev => ({
      ...prev,
      [itemId]: !isOpen
    }))
  }

  // Toggle item dropdown
  const toggleItemDropdown = (itemId, event) => {
    const isOpen = showItemDropdown[itemId]
    
    if (!isOpen) {
      // Calculate position when opening
      const rect = event.target.closest('.item-dropdown-container').getBoundingClientRect()
      setItemDropdownPosition(prev => ({
        ...prev,
        [itemId]: {
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        }
      }))
      // Show all items when opening
      setFilteredItems(inventoryItems)
    }
    
    setShowItemDropdown(prev => ({
      ...prev,
      [itemId]: !isOpen
    }))
  }

  // Toggle category dropdown
  const toggleCategoryDropdown = (itemId, event) => {
    const isOpen = showCategoryDropdown[itemId]
    
    if (!isOpen) {
      // Calculate position when opening
      const rect = event.target.closest('.category-dropdown-container').getBoundingClientRect()
      setCategoryDropdownPosition(prev => ({
        ...prev,
        [itemId]: {
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        }
      }))
      // Show all categories when opening
      setFilteredCategories(categories)
    }
    
    setShowCategoryDropdown(prev => ({
      ...prev,
      [itemId]: !isOpen
    }))
  }

  // Toggle batch dropdown
  const toggleBatchDropdown = (itemId, event) => {
    const isOpen = showBatchDropdown[itemId]
    
    if (!isOpen) {
      // Calculate position when opening
      const rect = event.target.closest('.batch-dropdown-container').getBoundingClientRect()
      setBatchDropdownPosition(prev => ({
        ...prev,
        [itemId]: {
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        }
      }))
      // Show all batches when opening
      setFilteredBatches(batches)
    }
    
    setShowBatchDropdown(prev => ({
      ...prev,
      [itemId]: !isOpen
    }))
  }

  // Select unit
  const selectUnit = (itemId, unit) => {
    const unitValue = unit.symbol || ''
    console.log('Selecting unit:', unitValue, 'for item:', itemId)
    
    // Update the item with the selected unit
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, unit: unitValue }
        : item
    ))
    
    // Close the dropdown
    setShowUnitDropdown(prev => ({
      ...prev,
      [itemId]: false
    }))
  }

  // Select item
  const selectItem = (itemId, selectedItem) => {
    console.log('Selecting item:', selectedItem.name, 'for item:', itemId)
    
    // Update the item with the selected item name and auto-fill category and unit
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            name: selectedItem.name,
            category_id: selectedItem.category_id || '',
            unit: selectedItem.unit || ''
          }
        : item
    ))
    
    // Close the dropdown
    setShowItemDropdown(prev => ({
      ...prev,
      [itemId]: false
    }))
  }

  // Select category
  const selectCategory = (itemId, selectedCategory) => {
    console.log('Selecting category:', selectedCategory.name, 'for item:', itemId)
    
    // Update the item with the selected category
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, category_id: selectedCategory.id }
        : item
    ))
    
    // Update search term to show selected category name
    setCategorySearchTerms(prev => ({
      ...prev,
      [itemId]: selectedCategory.name
    }))
    
    // Close the dropdown
    setShowCategoryDropdown(prev => ({
      ...prev,
      [itemId]: false
    }))
  }

  // Select batch
  const selectBatch = (itemId, selectedBatch) => {
    console.log('Selecting batch:', selectedBatch.batch_number, 'for item:', itemId)
    
    // Update the item with the selected batch
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, batch_id: selectedBatch.id }
        : item
    ))
    
    // Update search term to show selected batch number
    setBatchSearchTerms(prev => ({
      ...prev,
      [itemId]: selectedBatch.batch_number
    }))
    
    // Close the dropdown
    setShowBatchDropdown(prev => ({
      ...prev,
      [itemId]: false
    }))
  }

  // Add new item to inventory
  const handleAddNewItem = async () => {
    if (!newItemData.name.trim() || !newItemData.category_id || !newItemData.unit) {
      alert('Please fill in all required fields (Name, Category, Unit)')
      return
    }

    try {
      const itemData = {
        name: newItemData.name,
        category_id: newItemData.category_id,
        unit: newItemData.unit,
        description: newItemData.description,
        minimum_stock: 0,
        maximum_stock: 0,
        unit_cost: 0
      }

      const newItem = await inventoryService.createItem(itemData)
      
      // Add to inventory items list
      setInventoryItems(prev => [...prev, newItem])
      setFilteredItems(prev => [...prev, newItem])
      
      // Close modal and reset form
      setShowAddItemModal(false)
      setNewItemData({
        name: '',
        category_id: '',
        unit: '',
        description: ''
      })
      
      alert('New item added successfully!')
    } catch (error) {
      console.error('Error creating new item:', error)
      alert('Error creating new item. Please try again.')
    }
  }

  // Add new category to inventory
  const handleAddNewCategory = async () => {
    if (!newCategoryData.name.trim()) {
      alert('Please fill in the category name')
      return
    }

    try {
      const categoryData = {
        name: newCategoryData.name,
        description: newCategoryData.description
      }

      const newCategory = await inventoryService.createCategory(categoryData)
      
      // Add to categories list
      setCategories(prev => [...prev, newCategory])
      setFilteredCategories(prev => [...prev, newCategory])
      
      // Close modal and reset form
      setShowAddCategoryModal(false)
      setNewCategoryData({
        name: '',
        description: ''
      })
      
      alert('New category added successfully!')
    } catch (error) {
      console.error('Error creating new category:', error)
      alert('Error creating new category. Please try again.')
    }
  }

  // Add new batch to inventory
  const handleAddNewBatch = async () => {
    if (!newBatchData.batch_category_id) {
      alert('Please select a batch category')
      return
    }

    try {
      // Use the already generated batch name
      const batchNumber = generatedBatchName.split(' - ')[0] // Extract number from generated name
      
      const batchData = {
        batch_number: batchNumber,
        batch_name: generatedBatchName,
        description: newBatchData.description,
        production_date: newBatchData.production_date,
        batch_category_id: newBatchData.batch_category_id,
        status: 'active'
      }

      const newBatch = await accountingService.createBatch(batchData)
      
      // Add to batches list
      setBatches(prev => [...prev, newBatch])
      setFilteredBatches(prev => [...prev, newBatch])
      
      // Close modal and reset form
      setShowAddBatchModal(false)
      setNewBatchData({
        description: '',
        production_date: new Date().toISOString().split('T')[0],
        batch_category_id: ''
      })
      setGeneratedBatchName('')
      
      alert('New batch added successfully!')
    } catch (error) {
      console.error('Error creating new batch:', error)
      alert('Error creating new batch. Please try again.')
    }
  }

  const addNewRow = () => {
    // Check if current items have empty required fields
    const hasEmptyRequiredFields = items.some(item => 
      !item.name.trim() || !item.category_id || !item.unit || !item.quantity || 
      !item.unit_cost || !item.accounting_head_id || !item.batch_id || !item.expense_date
    )

    if (hasEmptyRequiredFields) {
      alert('Please fill in all required fields (Item Name, Category, Unit, Quantity, Unit Cost, Expense, Batch, and Date) for existing items before adding a new row.')
      return
    }

    const newItem = {
      id: Date.now(),
      name: '',
      category_id: '',
      unit: '',
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
    
    // Initialize search terms for new item
    setCategorySearchTerms(prev => ({
      ...prev,
      [newItem.id]: ''
    }))
    setBatchSearchTerms(prev => ({
      ...prev,
      [newItem.id]: ''
    }))
  }

  const removeRow = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
      
      // Clean up search terms for removed item
      setCategorySearchTerms(prev => {
        const newTerms = { ...prev }
        delete newTerms[id]
        return newTerms
      })
      setBatchSearchTerms(prev => {
        const newTerms = { ...prev }
        delete newTerms[id]
        return newTerms
      })
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
        item.name.trim() && item.category_id && item.unit && item.quantity && 
        item.unit_cost && item.accounting_head_id && item.batch_id && item.expense_date
      )

      if (validItems.length === 0) {
        alert('Please fill in at least one complete item with all required fields (Item Name, Category, Unit, Quantity, Unit Cost, Expense, Batch, and Date).')
        return
      }

      // Check for items with missing required fields
      const itemsWithData = items.filter(item => 
        item.name.trim() || item.category_id || item.unit || item.quantity || 
        item.unit_cost || item.accounting_head_id || item.batch_id || item.expense_date
      )
      
      const incompleteItems = itemsWithData.filter(item => 
        !item.name.trim() || !item.category_id || !item.unit || !item.quantity || 
        !item.unit_cost || !item.accounting_head_id || !item.batch_id || !item.expense_date
      )

      if (incompleteItems.length > 0) {
        alert('Please fill in all required fields (Item Name, Category, Unit, Quantity, Unit Cost, Expense, Batch, and Date) for all items.')
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
                  Excel-like interface - add items in the table below
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

          {/* Excel-like Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-visible">
             {/* Table Header */}
             <div className="bg-gray-50 border-b border-gray-200">
               <div className="grid grid-cols-12 gap-2 p-3 text-xs font-semibold text-gray-700">
                 <div className="col-span-2">Item Name *</div>
                 <div className="col-span-1">Category</div>
                 <div className="col-span-1">Unit</div>
                 <div className="col-span-1">Qty *</div>
                 <div className="col-span-1">Unit Cost *</div>
                 <div className="col-span-1">Total</div>
                 <div className="col-span-1">Supplier</div>
                 <div className="col-span-1">Expense *</div>
                 <div className="col-span-1">Batch</div>
                 <div className="col-span-1">Date *</div>
                 <div className="col-span-1">Actions</div>
               </div>
             </div>

             {/* Table Body */}
             <div className="max-h-96 overflow-y-auto">
               {items.map((item, index) => (
                 <div key={item.id} className="grid grid-cols-12 gap-2 p-3 border-b border-gray-100 hover:bg-gray-50">
                   {/* Item Name */}
                   <div className="col-span-2 relative item-dropdown-container">
                     <div className="relative">
                       <input
                         type="text"
                         value={item.name}
                         onChange={(e) => {
                           const value = e.target.value
                           updateItem(item.id, 'name', value)
                           handleItemSearch(item.id, value)
                         }}
                         onFocus={(e) => {
                           const rect = e.target.closest('.item-dropdown-container').getBoundingClientRect()
                           setItemDropdownPosition(prev => ({
                             ...prev,
                             [item.id]: {
                               top: rect.bottom + window.scrollY,
                               left: rect.left + window.scrollX,
                               width: rect.width
                             }
                           }))
                           setShowItemDropdown(prev => ({ ...prev, [item.id]: true }))
                           setFilteredItems(inventoryItems)
                         }}
                         className={`w-full px-1 py-1 pr-6 text-xs border rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500 ${
                           !item.name.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                         }`}
                         placeholder="Select or type item name *"
                         required
                       />
                       <button
                         type="button"
                         onClick={(e) => toggleItemDropdown(item.id, e)}
                         className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                       >
                         <ChevronDown className="w-3 h-3" />
                       </button>
                     </div>
                     
                     {showItemDropdown[item.id] && createPortal(
                       <div 
                         className="fixed z-[9999] bg-white border border-gray-300 rounded shadow-lg"
                         style={{ 
                           top: `${itemDropdownPosition[item.id]?.top || 0}px`,
                           left: `${itemDropdownPosition[item.id]?.left || 0}px`,
                           width: `${itemDropdownPosition[item.id]?.width || 200}px`,
                           zIndex: 9999,
                           maxHeight: '200px',
                           overflowY: 'auto',
                           overflowX: 'hidden'
                         }}>
                         <div
                           onMouseDown={(e) => {
                             e.preventDefault()
                             e.stopPropagation()
                             setShowAddItemModal(true)
                           }}
                           className="px-2 py-2 text-xs hover:bg-green-100 cursor-pointer border-b border-gray-200 bg-green-50 text-green-700 font-medium"
                         >
                           + Add New Item
                         </div>
                         {filteredItems.length > 0 ? (
                           filteredItems.map((inventoryItem) => (
                             <div
                               key={inventoryItem.id}
                               onMouseDown={(e) => {
                                 e.preventDefault()
                                 e.stopPropagation()
                                 selectItem(item.id, inventoryItem)
                               }}
                               className="px-2 py-2 text-xs hover:bg-blue-50 cursor-pointer text-gray-700"
                             >
                               {inventoryItem.name}
                             </div>
                           ))
                         ) : (
                           <div className="px-2 py-2 text-xs text-gray-500">
                             No items found
                           </div>
                         )}
                       </div>,
                       document.body
                     )}
                   </div>

                   {/* Category */}
                   <div className="col-span-1 relative category-dropdown-container">
                     <div className="relative">
                       <input
                         type="text"
                         value={categorySearchTerms[item.id] || ''}
                         onChange={(e) => {
                           const value = e.target.value
                           setCategorySearchTerms(prev => ({
                             ...prev,
                             [item.id]: value
                           }))
                           handleCategorySearch(item.id, value)
                         }}
                         onFocus={(e) => {
                           const rect = e.target.closest('.category-dropdown-container').getBoundingClientRect()
                           setCategoryDropdownPosition(prev => ({
                             ...prev,
                             [item.id]: {
                               top: rect.bottom + window.scrollY,
                               left: rect.left + window.scrollX,
                               width: rect.width
                             }
                           }))
                           setShowCategoryDropdown(prev => ({ ...prev, [item.id]: true }))
                           setFilteredCategories(categories)
                         }}
                         className={`w-full px-1 py-1 pr-6 text-xs border rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500 ${
                           !item.category_id ? 'border-red-300 bg-red-50' : 'border-gray-300'
                         }`}
                         placeholder="Select or type category *"
                         required
                       />
                       <button
                         type="button"
                         onClick={(e) => toggleCategoryDropdown(item.id, e)}
                         className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                       >
                         <ChevronDown className="w-3 h-3" />
                       </button>
                     </div>
                     
                     {showCategoryDropdown[item.id] && createPortal(
                       <div 
                         className="fixed z-[9999] bg-white border border-gray-300 rounded shadow-lg"
                         style={{ 
                           top: `${categoryDropdownPosition[item.id]?.top || 0}px`,
                           left: `${categoryDropdownPosition[item.id]?.left || 0}px`,
                           width: `${categoryDropdownPosition[item.id]?.width || 200}px`,
                           zIndex: 9999,
                           maxHeight: '200px',
                           overflowY: 'auto',
                           overflowX: 'hidden'
                         }}>
                         <div
                           onMouseDown={(e) => {
                             e.preventDefault()
                             e.stopPropagation()
                             setShowAddCategoryModal(true)
                           }}
                           className="px-2 py-2 text-xs hover:bg-green-100 cursor-pointer border-b border-gray-200 bg-green-50 text-green-700 font-medium"
                         >
                           + Add New Category
                         </div>
                         {filteredCategories.length > 0 ? (
                           filteredCategories.map((category) => (
                             <div
                               key={category.id}
                               onMouseDown={(e) => {
                                 e.preventDefault()
                                 e.stopPropagation()
                                 selectCategory(item.id, category)
                               }}
                               className="px-2 py-2 text-xs hover:bg-blue-50 cursor-pointer text-gray-700"
                             >
                               {category.name}
                             </div>
                           ))
                         ) : (
                           <div className="px-2 py-2 text-xs text-gray-500">
                             No categories found
                           </div>
                         )}
                       </div>,
                       document.body
                     )}
                   </div>

                   {/* Unit */}
                   <div className="col-span-1 relative unit-dropdown-container">
                     <div className="relative">
                       <input
                         type="text"
                         value={item.unit}
                         onChange={(e) => {
                           const value = e.target.value
                           updateItem(item.id, 'unit', value)
                           handleUnitSearch(item.id, value)
                         }}
                         onFocus={(e) => {
                           const rect = e.target.closest('.unit-dropdown-container').getBoundingClientRect()
                           setDropdownPosition(prev => ({
                             ...prev,
                             [item.id]: {
                               top: rect.bottom + window.scrollY,
                               left: rect.left + window.scrollX,
                               width: rect.width
                             }
                           }))
                           setShowUnitDropdown(prev => ({ ...prev, [item.id]: true }))
                           setFilteredUnits(units)
                         }}
                         className={`w-full px-1 py-1 pr-6 text-xs border rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500 ${
                           !item.unit ? 'border-red-300 bg-red-50' : 'border-gray-300'
                         }`}
                         placeholder="-"
                         required
                       />
                       <button
                         type="button"
                         onClick={(e) => toggleUnitDropdown(item.id, e)}
                         className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                       >
                         <ChevronDown className="w-3 h-3" />
                       </button>
                     </div>
                     
                     {showUnitDropdown[item.id] && createPortal(
                       <div 
                         className="fixed z-[9999] bg-white border border-gray-300 rounded shadow-lg"
                         style={{ 
                           top: `${dropdownPosition[item.id]?.top || 0}px`,
                           left: `${dropdownPosition[item.id]?.left || 0}px`,
                           width: `${dropdownPosition[item.id]?.width || 200}px`,
                           zIndex: 9999,
                           maxHeight: '200px',
                           overflowY: 'auto',
                           overflowX: 'hidden'
                         }}>
                         <div
                           onMouseDown={(e) => {
                             e.preventDefault()
                             e.stopPropagation()
                             selectUnit(item.id, { symbol: '', name: '' })
                           }}
                           className="px-1 py-1 text-xs hover:bg-gray-100 cursor-pointer"
                         >
                           -
                         </div>
                         {filteredUnits.length > 0 ? (
                           filteredUnits.map((unit) => (
                             <div
                               key={unit.id}
                               onMouseDown={(e) => {
                                 e.preventDefault()
                                 e.stopPropagation()
                                 selectUnit(item.id, unit)
                               }}
                               className="px-2 py-2 text-xs hover:bg-blue-50 cursor-pointer text-gray-700"
                             >
                               {unit.symbol} - {unit.name}
                             </div>
                           ))
                         ) : (
                           <div className="px-2 py-2 text-xs text-gray-500">
                             No units found
                           </div>
                         )}
                       </div>,
                       document.body
                     )}
                   </div>

                   {/* Quantity */}
                   <div className="col-span-1">
                     <input
                       type="number"
                       step="0.01"
                       min="0"
                       value={item.quantity}
                       onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                       className={`w-full px-1 py-1 text-xs border rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500 ${
                         !item.quantity ? 'border-red-300 bg-red-50' : 'border-gray-300'
                       }`}
                       placeholder="0"
                       required
                     />
                   </div>

                   {/* Unit Cost */}
                   <div className="col-span-1">
                     <input
                       type="number"
                       step="0.01"
                       min="0"
                       value={item.unit_cost}
                       onChange={(e) => updateItem(item.id, 'unit_cost', e.target.value)}
                       className={`w-full px-1 py-1 text-xs border rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500 ${
                         !item.unit_cost ? 'border-red-300 bg-red-50' : 'border-gray-300'
                       }`}
                       placeholder="0.00"
                       required
                     />
                   </div>

                   {/* Total Cost (Read-only) */}
                   <div className="col-span-1">
                     <div className="w-full px-1 py-1 text-xs bg-gray-100 border border-gray-300 rounded text-center font-medium">
                       {formatCurrency(parseFloat(item.total_cost) || 0)}
                     </div>
                   </div>

                   {/* Supplier */}
                   <div className="col-span-1">
                     <input
                       type="text"
                       value={item.supplier_name}
                       onChange={(e) => updateItem(item.id, 'supplier_name', e.target.value)}
                       className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
                       placeholder="Supplier"
                     />
                   </div>

                   {/* Accounting Head */}
                   <div className="col-span-1">
                     <select
                       value={item.accounting_head_id}
                       onChange={(e) => updateItem(item.id, 'accounting_head_id', e.target.value)}
                       className={`w-full px-1 py-1 text-xs border rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500 ${
                         !item.accounting_head_id ? 'border-red-300 bg-red-50' : 'border-gray-300'
                       }`}
                       required
                     >
                       <option value="">-</option>
                       {accountingHeads.map((head) => (
                         <option key={head.id} value={head.id}>{head.name}</option>
                       ))}
                     </select>
                   </div>

                   {/* Batch */}
                   <div className="col-span-1 relative batch-dropdown-container">
                     <div className="relative">
                       <input
                         type="text"
                         value={batchSearchTerms[item.id] || ''}
                         onChange={(e) => {
                           const value = e.target.value
                           setBatchSearchTerms(prev => ({
                             ...prev,
                             [item.id]: value
                           }))
                           handleBatchSearch(item.id, value)
                         }}
                         onFocus={(e) => {
                           const rect = e.target.closest('.batch-dropdown-container').getBoundingClientRect()
                           setBatchDropdownPosition(prev => ({
                             ...prev,
                             [item.id]: {
                               top: rect.bottom + window.scrollY,
                               left: rect.left + window.scrollX,
                               width: rect.width
                             }
                           }))
                           setShowBatchDropdown(prev => ({ ...prev, [item.id]: true }))
                           setFilteredBatches(batches)
                         }}
                         className={`w-full px-1 py-1 pr-6 text-xs border rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500 ${
                           !item.batch_id ? 'border-red-300 bg-red-50' : 'border-gray-300'
                         }`}
                         placeholder="Select or type batch *"
                         required
                       />
                       <button
                         type="button"
                         onClick={(e) => toggleBatchDropdown(item.id, e)}
                         className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                       >
                         <ChevronDown className="w-3 h-3" />
                       </button>
                     </div>
                     
                     {showBatchDropdown[item.id] && createPortal(
                       <div 
                         className="fixed z-[9999] bg-white border border-gray-300 rounded shadow-lg"
                         style={{ 
                           top: `${batchDropdownPosition[item.id]?.top || 0}px`,
                           left: `${batchDropdownPosition[item.id]?.left || 0}px`,
                           width: `${batchDropdownPosition[item.id]?.width || 200}px`,
                           zIndex: 9999,
                           maxHeight: '200px',
                           overflowY: 'auto',
                           overflowX: 'hidden'
                         }}>
                         <div
                           onMouseDown={(e) => {
                             e.preventDefault()
                             e.stopPropagation()
                             setShowAddBatchModal(true)
                           }}
                           className="px-2 py-2 text-xs hover:bg-green-100 cursor-pointer border-b border-gray-200 bg-green-50 text-green-700 font-medium"
                         >
                           + Add New Batch
                         </div>
                         {filteredBatches.length > 0 ? (
                           filteredBatches.map((batch) => (
                             <div
                               key={batch.id}
                               onMouseDown={(e) => {
                                 e.preventDefault()
                                 e.stopPropagation()
                                 selectBatch(item.id, batch)
                               }}
                               className="px-2 py-2 text-xs hover:bg-blue-50 cursor-pointer text-gray-700"
                             >
                               {batch.batch_number}
                             </div>
                           ))
                         ) : (
                           <div className="px-2 py-2 text-xs text-gray-500">
                             No batches found
                           </div>
                         )}
                       </div>,
                       document.body
                     )}
                   </div>

                   {/* Date */}
                   <div className="col-span-1">
                     <input
                       type="date"
                       value={item.expense_date}
                       onChange={(e) => updateItem(item.id, 'expense_date', e.target.value)}
                       className={`w-full px-1 py-1 text-xs border rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500 ${
                         !item.expense_date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                       }`}
                       required
                     />
                   </div>

                   {/* Actions */}
                   <div className="col-span-1 flex items-center justify-center space-x-1">
                     <button
                       className="text-blue-600 hover:text-blue-800 p-1"
                       title="Edit row"
                     >
                       <Edit className="w-3 h-3" />
                     </button>
                     {items.length > 1 && (
                       <button
                         onClick={() => removeRow(item.id)}
                         className="text-red-600 hover:text-red-800 p-1"
                         title="Delete row"
                       >
                         <Trash2 className="w-3 h-3" />
                       </button>
                     )}
                   </div>
                 </div>
               ))}
             </div>

             {/* Add Row Button */}
             <div className="bg-gray-50 border-t border-gray-200 p-3">
               <button
                 onClick={addNewRow}
                 className="bg-mountain-600 text-white px-3 py-1 rounded text-sm hover:bg-mountain-700 transition-colors flex items-center space-x-1"
               >
                 <Plus className="w-3 h-3" />
                 <span>Add New Row</span>
               </button>
             </div>
          </div>

           {/* Total Summary */}
           <div className="bg-mountain-50 border border-mountain-200 rounded-lg p-3 mt-4">
             <div className="flex justify-between items-center">
               <div>
                 <h4 className="text-sm font-semibold text-mountain-800">Total Summary</h4>
                 <p className="text-xs text-mountain-600">
                   {items.filter(item => item.name.trim()).length} items • Total Amount
                 </p>
               </div>
               <div className="text-right">
                 <p className="text-lg font-bold text-mountain-600">
                   {formatCurrency(calculateTotalAmount())}
                 </p>
               </div>
             </div>
           </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
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
      </motion.div>

      {/* Add New Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-mountain-800">
                  Add New Inventory Item
                </h3>
                <button
                  onClick={() => setShowAddItemModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={newItemData.name}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="Enter item name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newItemData.category_id}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, category_id: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit *
                  </label>
                  <select
                    value={newItemData.unit}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
                    required
                  >
                    <option value="">Select unit</option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.symbol}>{unit.symbol} - {unit.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newItemData.description}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="Enter item description (optional)"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNewItem}
                  className="px-4 py-2 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700 transition-colors"
                >
                  Add Item
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add New Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-mountain-800">
                  Add New Category
                </h3>
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={newCategoryData.name}
                    onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newCategoryData.description}
                    onChange={(e) => setNewCategoryData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="Enter category description (optional)"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNewCategory}
                  className="px-4 py-2 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700 transition-colors"
                >
                  Add Category
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add New Batch Modal */}
      {showAddBatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-mountain-800">
                  Add New Batch
                </h3>
                <button
                  onClick={() => setShowAddBatchModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Category *
                  </label>
                  <select
                    value={newBatchData.batch_category_id}
                    onChange={(e) => {
                      const categoryId = e.target.value
                      setNewBatchData(prev => ({ ...prev, batch_category_id: categoryId }))
                      generateBatchName(categoryId)
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
                    required
                  >
                    <option value="">Select batch category</option>
                    {batchCategories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Name
                  </label>
                  <div className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded text-gray-600">
                    {isGeneratingBatchName ? 'Generating batch name...' : (generatedBatchName || 'Select a category to generate batch name')}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Production Date
                  </label>
                  <input
                    type="date"
                    value={newBatchData.production_date}
                    onChange={(e) => setNewBatchData(prev => ({ ...prev, production_date: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newBatchData.description}
                    onChange={(e) => setNewBatchData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="Enter batch description (optional)"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setShowAddBatchModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNewBatch}
                  className="px-4 py-2 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700 transition-colors"
                >
                  Add Batch
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ExcelLikeInventoryForm
