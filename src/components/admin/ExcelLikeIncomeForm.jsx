import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { X, Save, Plus, Trash2, DollarSign, Edit, ChevronDown } from 'lucide-react'
import { accountingService } from '../../services/accountingService'
import unitService from '../../services/unitService'

const ExcelLikeIncomeForm = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [accountingHeads, setAccountingHeads] = useState([])
  const [batches, setBatches] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [units, setUnits] = useState([])
  
  // Dropdown states for accounting heads
  const [filteredAccountingHeads, setFilteredAccountingHeads] = useState([])
  const [showAccountingHeadDropdown, setShowAccountingHeadDropdown] = useState({})
  const [accountingHeadDropdownPosition, setAccountingHeadDropdownPosition] = useState({})
  const [accountingHeadSearchTerms, setAccountingHeadSearchTerms] = useState({})

  // Dropdown states for batches
  const [filteredBatches, setFilteredBatches] = useState([])
  const [showBatchDropdown, setShowBatchDropdown] = useState({})
  const [batchDropdownPosition, setBatchDropdownPosition] = useState({})
  const [batchSearchTerms, setBatchSearchTerms] = useState({})

  // Dropdown states for products
  const [filteredProducts, setFilteredProducts] = useState([])
  const [showProductDropdown, setShowProductDropdown] = useState({})
  const [productDropdownPosition, setProductDropdownPosition] = useState({})
  const [productSearchTerms, setProductSearchTerms] = useState({})
  
  // Dropdown states for customers
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [showCustomerDropdown, setShowCustomerDropdown] = useState({})
  const [customerDropdownPosition, setCustomerDropdownPosition] = useState({})
  const [customerSearchTerms, setCustomerSearchTerms] = useState({})
  
  // Dropdown states for units
  const [filteredUnits, setFilteredUnits] = useState([])
  const [showUnitDropdown, setShowUnitDropdown] = useState({})
  const [unitDropdownPosition, setUnitDropdownPosition] = useState({})
  const [unitSearchTerms, setUnitSearchTerms] = useState({})
  
  // Customer creation modal state
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    customer_type: 'individual',
    notes: ''
  })

  const [incomeItems, setIncomeItems] = useState([
    {
      id: 1,
      accounting_head_id: '',
      batch_id: '',
      product_id: '',
      customer_id: '',
      description: '',
      amount: '',
      quantity: '1',
      unit: 'units',
      income_date: new Date().toISOString().split('T')[0],
      payment_method: '',
      reference_number: '',
      notes: '',
      is_credit: false
    }
  ])

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on dropdown items
      if (event.target.closest('[data-dropdown-item]')) {
        return
      }
      
      if (!event.target.closest('.dropdown-container')) {
        setShowAccountingHeadDropdown({})
        setShowBatchDropdown({})
        setShowProductDropdown({})
        setShowCustomerDropdown({})
        setShowUnitDropdown({})
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  const loadData = async () => {
    try {
      const [headsData, batchesData, productsData, customersData, unitsData] = await Promise.all([
        accountingService.getAllAccountingHeads(),
        accountingService.getAllBatches(),
        accountingService.getAllProducts(),
        accountingService.getAllCustomers(),
        unitService.getAllUnits()
      ])
      
      setAccountingHeads(headsData.filter(head => head.type === 'income'))
      setBatches(batchesData)
      setProducts(productsData)
      setCustomers(customersData)
      setUnits(unitsData)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const addNewRow = () => {
    const newId = Math.max(...incomeItems.map(item => item.id), 0) + 1
    setIncomeItems([...incomeItems, {
      id: newId,
      accounting_head_id: '',
      batch_id: '',
      product_id: '',
      customer_id: '',
      description: '',
      amount: '',
      quantity: '1',
      unit: 'units',
      income_date: new Date().toISOString().split('T')[0],
      payment_method: '',
      reference_number: '',
      notes: '',
      is_credit: false
    }])
  }

  const removeRow = (id) => {
    if (incomeItems.length > 1) {
      setIncomeItems(incomeItems.filter(item => item.id !== id))
    }
  }

  const updateItem = (id, field, value) => {
    setIncomeItems(incomeItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Filter out empty rows (rows with no amount)
      const validItems = incomeItems.filter(item => 
        item.amount && parseFloat(item.amount) > 0
      )

      if (validItems.length === 0) {
        alert('Please add at least one income record with amount.')
        return
      }

      // Create income records
      const promises = validItems.map(item => 
        accountingService.createIncome({
          accounting_head_id: item.accounting_head_id,
          batch_id: item.batch_id || null,
          product_id: item.product_id || null,
          customer_id: item.customer_id || null,
          description: item.description,
          amount: parseFloat(item.amount),
          quantity: parseFloat(item.quantity) || 1,
          unit: item.unit,
          income_date: item.income_date,
          payment_method: item.payment_method,
          reference_number: item.reference_number,
          notes: item.notes,
          is_credit: item.is_credit || false
        })
      )

      await Promise.all(promises)
      onSuccess?.()
      onClose()
      resetForm()
    } catch (error) {
      console.error('Error saving income records:', error)
      alert('Error saving income records. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setIncomeItems([{
      id: 1,
      accounting_head_id: '',
      batch_id: '',
      product_id: '',
      description: '',
      amount: '',
      quantity: '1',
      unit: 'units',
      income_date: new Date().toISOString().split('T')[0],
      customer_name: '',
      payment_method: '',
      reference_number: '',
      notes: ''
    }])
    setAccountingHeadSearchTerms({})
    setBatchSearchTerms({})
    setProductSearchTerms({})
    setUnitSearchTerms({})
  }

  // Accounting Head dropdown functions
  const handleAccountingHeadSearch = (itemId, searchTerm) => {
    setAccountingHeadSearchTerms(prev => ({ ...prev, [itemId]: searchTerm }))
    
    // If search term is empty, clear the selection
    if (searchTerm === '') {
      updateItem(itemId, 'accounting_head_id', '')
    }
    
    const filtered = accountingHeads.filter(head =>
      head.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredAccountingHeads(prev => ({ ...prev, [itemId]: filtered }))
  }

  const toggleAccountingHeadDropdown = (itemId, event) => {
    setShowAccountingHeadDropdown(prev => ({ ...prev, [itemId]: !prev[itemId] }))
    if (!showAccountingHeadDropdown[itemId]) {
      const searchTerm = accountingHeadSearchTerms[itemId] || ''
      handleAccountingHeadSearch(itemId, searchTerm)
      
      // Calculate position relative to the input field
      if (event && event.target) {
        const rect = event.target.getBoundingClientRect()
        setAccountingHeadDropdownPosition(prev => ({
          ...prev,
          [itemId]: {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width
          }
        }))
      }
    }
  }

  const selectAccountingHead = (itemId, head) => {
    updateItem(itemId, 'accounting_head_id', head.id)
    setAccountingHeadSearchTerms(prev => ({ ...prev, [itemId]: head.name }))
    setShowAccountingHeadDropdown(prev => ({ ...prev, [itemId]: false }))
  }

  // Batch dropdown functions
  const handleBatchSearch = (itemId, searchTerm) => {
    setBatchSearchTerms(prev => ({ ...prev, [itemId]: searchTerm }))
    
    // If search term is empty, clear the selection
    if (searchTerm === '') {
      updateItem(itemId, 'batch_id', '')
    }
    
    const filtered = batches.filter(batch =>
      batch.batch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.batch_number.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredBatches(prev => ({ ...prev, [itemId]: filtered }))
  }

  const toggleBatchDropdown = (itemId, event) => {
    setShowBatchDropdown(prev => ({ ...prev, [itemId]: !prev[itemId] }))
    if (!showBatchDropdown[itemId]) {
      const searchTerm = batchSearchTerms[itemId] || ''
      handleBatchSearch(itemId, searchTerm)
      
      // Calculate position relative to the input field
      if (event && event.target) {
        const rect = event.target.getBoundingClientRect()
        setBatchDropdownPosition(prev => ({
          ...prev,
          [itemId]: {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width
          }
        }))
      }
    }
  }

  const selectBatch = (itemId, batch) => {
    updateItem(itemId, 'batch_id', batch.id)
    setBatchSearchTerms(prev => ({ ...prev, [itemId]: batch.batch_name }))
    setShowBatchDropdown(prev => ({ ...prev, [itemId]: false }))
  }

  // Product dropdown functions
  const handleProductSearch = (itemId, searchTerm) => {
    setProductSearchTerms(prev => ({ ...prev, [itemId]: searchTerm }))
    
    // If search term is empty, clear the selection
    if (searchTerm === '') {
      updateItem(itemId, 'product_id', '')
    }
    
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProducts(prev => ({ ...prev, [itemId]: filtered }))
  }

  const toggleProductDropdown = (itemId, event) => {
    setShowProductDropdown(prev => ({ ...prev, [itemId]: !prev[itemId] }))
    if (!showProductDropdown[itemId]) {
      const searchTerm = productSearchTerms[itemId] || ''
      handleProductSearch(itemId, searchTerm)
      
      // Calculate position relative to the input field
      if (event && event.target) {
        const rect = event.target.getBoundingClientRect()
        setProductDropdownPosition(prev => ({
          ...prev,
          [itemId]: {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width
          }
        }))
      }
    }
  }

  const selectProduct = (itemId, product) => {
    updateItem(itemId, 'product_id', product.id)
    setProductSearchTerms(prev => ({ ...prev, [itemId]: product.name }))
    setShowProductDropdown(prev => ({ ...prev, [itemId]: false }))
  }

  // Customer dropdown functions
  const handleCustomerSearch = (itemId, searchTerm) => {
    setCustomerSearchTerms(prev => ({ ...prev, [itemId]: searchTerm }))
    
    // If search term is empty, clear the selection
    if (searchTerm === '') {
      updateItem(itemId, 'customer_id', '')
    }
    
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCustomers(prev => ({ ...prev, [itemId]: filtered }))
  }

  const toggleCustomerDropdown = (itemId, event) => {
    setShowCustomerDropdown(prev => ({ ...prev, [itemId]: !prev[itemId] }))
    if (!showCustomerDropdown[itemId]) {
      const searchTerm = customerSearchTerms[itemId] || ''
      handleCustomerSearch(itemId, searchTerm)
      
      if (event && event.target) {
        const rect = event.target.getBoundingClientRect()
        setCustomerDropdownPosition(prev => ({
          ...prev,
          [itemId]: {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width
          }
        }))
      }
    }
  }

  const selectCustomer = (itemId, customer) => {
    updateItem(itemId, 'customer_id', customer.id)
    setCustomerSearchTerms(prev => ({ ...prev, [itemId]: customer.name }))
    setShowCustomerDropdown(prev => ({ ...prev, [itemId]: false }))
  }

  const getCustomerName = (itemId) => {
    const customerId = incomeItems.find(item => item.id === itemId)?.customer_id
    const customer = customers.find(c => c.id === customerId)
    return customer?.name || ''
  }

  // Customer creation functions
  const handleCreateCustomer = async () => {
    try {
      if (!newCustomer.name.trim()) {
        alert('Customer name is required')
        return
      }

      const createdCustomer = await accountingService.createCustomer(newCustomer)
      setCustomers(prev => [...prev, createdCustomer])
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        customer_type: 'individual',
        notes: ''
      })
      setShowCreateCustomerModal(false)
    } catch (error) {
      console.error('Error creating customer:', error)
      alert('Error creating customer. Please try again.')
    }
  }

  const getAccountingHeadName = (itemId) => {
    const headId = incomeItems.find(item => item.id === itemId)?.accounting_head_id
    const head = accountingHeads.find(h => h.id === headId)
    return head?.name || ''
  }

  const getBatchName = (itemId) => {
    const batchId = incomeItems.find(item => item.id === itemId)?.batch_id
    const batch = batches.find(b => b.id === batchId)
    return batch?.batch_name || ''
  }

  const getProductName = (itemId) => {
    const productId = incomeItems.find(item => item.id === itemId)?.product_id
    const product = products.find(p => p.id === productId)
    return product?.name || ''
  }

  // Unit dropdown functions
  const handleUnitSearch = (itemId, searchTerm) => {
    setUnitSearchTerms(prev => ({ ...prev, [itemId]: searchTerm }))
    
    // If search term is empty, clear the selection
    if (searchTerm === '') {
      updateItem(itemId, 'unit', '')
    }
    
    const filtered = units.filter(unit =>
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (unit.symbol && unit.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredUnits(prev => ({ ...prev, [itemId]: filtered }))
  }

  const toggleUnitDropdown = (itemId, event) => {
    setShowUnitDropdown(prev => ({ ...prev, [itemId]: !prev[itemId] }))
    if (!showUnitDropdown[itemId]) {
      const searchTerm = unitSearchTerms[itemId] || ''
      handleUnitSearch(itemId, searchTerm)
      
      if (event && event.target) {
        const rect = event.target.getBoundingClientRect()
        setUnitDropdownPosition(prev => ({
          ...prev,
          [itemId]: {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width
          }
        }))
      }
    }
  }

  const selectUnit = (itemId, unit) => {
    updateItem(itemId, 'unit', unit.name)
    setUnitSearchTerms(prev => ({ ...prev, [itemId]: unit.name }))
    setShowUnitDropdown(prev => ({ ...prev, [itemId]: false }))
  }

  const getUnitName = (itemId) => {
    const unitName = incomeItems.find(item => item.id === itemId)?.unit
    return unitName || ''
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-mountain-800">Add Income Records</h2>
            <p className="text-sm text-mountain-600 mt-1">Add multiple income records in Excel-like format</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Table */}
          <div className="flex-1 overflow-auto">
            <div className="min-w-full">
              {/* Header Row */}
              <div className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <div className="grid grid-cols-12 gap-2 p-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                <div className="col-span-1">Category *</div>
                <div className="col-span-1">Batch</div>
                <div className="col-span-1">Product</div>
                <div className="col-span-1">Amount *</div>
                <div className="col-span-1">Quantity</div>
                <div className="col-span-1">Unit</div>
                <div className="col-span-1">Customer</div>
                <div className="col-span-1">Credit</div>
                <div className="col-span-1">Description</div>
                <div className="col-span-1">Payment Method</div>
                <div className="col-span-1">Date *</div>
                <div className="col-span-1">Actions</div>
              </div>
              </div>

              {/* Data Rows */}
              <div className="divide-y divide-gray-200">
                {incomeItems.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 p-4 hover:bg-gray-50">
                    {/* Category */}
                    <div className="col-span-1 relative dropdown-container">
                        <input
                          type="text"
                          value={accountingHeadSearchTerms[item.id] !== undefined ? accountingHeadSearchTerms[item.id] : getAccountingHeadName(item.id)}
                          onChange={(e) => handleAccountingHeadSearch(item.id, e.target.value)}
                          onFocus={(e) => {
                            // Initialize search term with current selection if not already set
                            if (accountingHeadSearchTerms[item.id] === undefined) {
                              setAccountingHeadSearchTerms(prev => ({ ...prev, [item.id]: getAccountingHeadName(item.id) }))
                            }
                            toggleAccountingHeadDropdown(item.id, e)
                          }}
                          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500 pr-6"
                          placeholder="Select category"
                          required
                        />
                       <button
                         type="button"
                         onClick={(e) => toggleAccountingHeadDropdown(item.id, e)}
                         className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                       >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      
                       {showAccountingHeadDropdown[item.id] && createPortal(
                         <div
                           className="fixed z-[60] bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto min-w-[220px]"
                           style={{
                             top: `${accountingHeadDropdownPosition[item.id]?.top || 0}px`,
                             left: `${accountingHeadDropdownPosition[item.id]?.left || 0}px`,
                             width: `${Math.max(accountingHeadDropdownPosition[item.id]?.width || 200, 220)}px`
                           }}
                         >
                          {filteredAccountingHeads[item.id]?.map((head) => (
                            <div
                              key={head.id}
                              data-dropdown-item
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                selectAccountingHead(item.id, head)
                              }}
                              className="px-3 py-2 text-xs text-gray-900 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              {head.name}
                            </div>
                          ))}
                        </div>,
                        document.body
                      )}
                    </div>

                    {/* Batch */}
                    <div className="col-span-1 relative dropdown-container">
                        <input
                          type="text"
                          value={batchSearchTerms[item.id] !== undefined ? batchSearchTerms[item.id] : getBatchName(item.id)}
                          onChange={(e) => handleBatchSearch(item.id, e.target.value)}
                          onFocus={(e) => {
                            // Initialize search term with current selection if not already set
                            if (batchSearchTerms[item.id] === undefined) {
                              setBatchSearchTerms(prev => ({ ...prev, [item.id]: getBatchName(item.id) }))
                            }
                            toggleBatchDropdown(item.id, e)
                          }}
                          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500 pr-6"
                          placeholder="Select batch"
                        />
                       <button
                         type="button"
                         onClick={(e) => toggleBatchDropdown(item.id, e)}
                         className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                       >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      
                       {showBatchDropdown[item.id] && createPortal(
                         <div
                           className="fixed z-[60] bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto"
                           style={{
                             top: `${batchDropdownPosition[item.id]?.top || 0}px`,
                             left: `${batchDropdownPosition[item.id]?.left || 0}px`,
                             width: `${batchDropdownPosition[item.id]?.width || 200}px`
                           }}
                         >
                          {filteredBatches[item.id]?.map((batch) => (
                            <div
                              key={batch.id}
                              data-dropdown-item
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                selectBatch(item.id, batch)
                              }}
                              className="px-2 py-1.5 text-xs text-gray-900 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              {batch.batch_name}
                            </div>
                          ))}
                        </div>,
                        document.body
                      )}
                    </div>

                    {/* Product */}
                    <div className="col-span-1 relative dropdown-container">
                        <input
                          type="text"
                          value={productSearchTerms[item.id] !== undefined ? productSearchTerms[item.id] : getProductName(item.id)}
                          onChange={(e) => handleProductSearch(item.id, e.target.value)}
                          onFocus={(e) => {
                            // Initialize search term with current selection if not already set
                            if (productSearchTerms[item.id] === undefined) {
                              setProductSearchTerms(prev => ({ ...prev, [item.id]: getProductName(item.id) }))
                            }
                            toggleProductDropdown(item.id, e)
                          }}
                          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500 pr-6"
                          placeholder="Select product"
                        />
                       <button
                         type="button"
                         onClick={(e) => toggleProductDropdown(item.id, e)}
                         className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                       >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      
                       {showProductDropdown[item.id] && createPortal(
                         <div
                           className="fixed z-[60] bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto min-w-[300px]"
                           style={{
                             top: `${productDropdownPosition[item.id]?.top || 0}px`,
                             left: `${productDropdownPosition[item.id]?.left || 0}px`,
                             width: `${Math.max(productDropdownPosition[item.id]?.width || 200, 300)}px`
                           }}
                         >
                          {filteredProducts[item.id]?.map((product) => (
                            <div
                              key={product.id}
                              data-dropdown-item
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                selectProduct(item.id, product)
                              }}
                              className="px-2 py-1.5 text-xs text-gray-900 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              {product.name}
                            </div>
                          ))}
                        </div>,
                        document.body
                      )}
                    </div>

                    {/* Amount */}
                    <div className="col-span-1">
                      <input
                        type="number"
                        step="0.01"
                        value={item.amount}
                        onChange={(e) => updateItem(item.id, 'amount', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    {/* Quantity */}
                    <div className="col-span-1">
                      <input
                        type="number"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
                        placeholder="1"
                      />
                    </div>

                    {/* Unit */}
                    <div className="col-span-1 relative dropdown-container">
                      <input
                        type="text"
                        value={unitSearchTerms[item.id] !== undefined ? unitSearchTerms[item.id] : getUnitName(item.id)}
                        onChange={(e) => handleUnitSearch(item.id, e.target.value)}
                        onFocus={(e) => {
                          // Initialize search term with current selection if not already set
                          if (unitSearchTerms[item.id] === undefined) {
                            setUnitSearchTerms(prev => ({ ...prev, [item.id]: getUnitName(item.id) }))
                          }
                          toggleUnitDropdown(item.id, e)
                        }}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500 pr-6"
                        placeholder="Select unit"
                      />
                      <button
                        type="button"
                        onClick={(e) => toggleUnitDropdown(item.id, e)}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      
                      {showUnitDropdown[item.id] && createPortal(
                        <div
                          className="fixed z-[60] bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto min-w-[250px]"
                          style={{
                            top: `${unitDropdownPosition[item.id]?.top || 0}px`,
                            left: `${unitDropdownPosition[item.id]?.left || 0}px`,
                            width: `${Math.max(unitDropdownPosition[item.id]?.width || 200, 250)}px`
                          }}
                        >
                          {filteredUnits[item.id]?.map((unit) => (
                            <div
                              key={unit.id}
                              data-dropdown-item
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                selectUnit(item.id, unit)
                              }}
                              className="px-2 py-1.5 text-xs text-gray-900 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{unit.name}</div>
                                {unit.symbol && (
                                  <div className="text-gray-500 text-xs font-mono bg-gray-100 px-1 rounded">
                                    {unit.symbol}
                                  </div>
                                )}
                              </div>
                              <div className="text-gray-500 text-xs">{unit.category}</div>
                            </div>
                          ))}
                        </div>,
                        document.body
                      )}
                    </div>

                    {/* Customer */}
                    <div className="col-span-1 relative dropdown-container">
                        <input
                          type="text"
                          value={customerSearchTerms[item.id] !== undefined ? customerSearchTerms[item.id] : getCustomerName(item.id)}
                          onChange={(e) => handleCustomerSearch(item.id, e.target.value)}
                          onFocus={(e) => {
                            // Initialize search term with current selection if not already set
                            if (customerSearchTerms[item.id] === undefined) {
                              setCustomerSearchTerms(prev => ({ ...prev, [item.id]: getCustomerName(item.id) }))
                            }
                            toggleCustomerDropdown(item.id, e)
                          }}
                          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500 pr-6"
                          placeholder="Select customer"
                        />
                       <button
                         type="button"
                         onClick={(e) => toggleCustomerDropdown(item.id, e)}
                         className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                       >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      
                       {showCustomerDropdown[item.id] && createPortal(
                         <div
                           className="fixed z-[60] bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto min-w-[300px]"
                           style={{
                             top: `${customerDropdownPosition[item.id]?.top || 0}px`,
                             left: `${customerDropdownPosition[item.id]?.left || 0}px`,
                             width: `${Math.max(customerDropdownPosition[item.id]?.width || 200, 300)}px`
                           }}
                         >
                          {filteredCustomers[item.id]?.map((customer) => (
                            <div
                              key={customer.id}
                              data-dropdown-item
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                selectCustomer(item.id, customer)
                              }}
                              className="px-2 py-1.5 text-xs text-gray-900 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium">{customer.name}</div>
                              {customer.email && <div className="text-gray-500 text-xs">{customer.email}</div>}
                            </div>
                          ))}
                          <div
                            data-dropdown-item
                            onMouseDown={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setShowCustomerDropdown(prev => ({ ...prev, [item.id]: false }))
                              setShowCreateCustomerModal(true)
                            }}
                            className="px-2 py-1.5 text-xs text-blue-600 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 font-medium"
                          >
                            + Create New Customer
                          </div>
                        </div>,
                        document.body
                      )}
                    </div>

                    {/* Credit Toggle */}
                    <div className="col-span-1 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => updateItem(item.id, 'is_credit', !item.is_credit)}
                        className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                          item.is_credit 
                            ? 'bg-red-500' 
                            : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                          item.is_credit 
                            ? 'translate-x-6' 
                            : 'translate-x-0.5'
                        }`} />
                      </button>
                      <span className={`ml-2 text-xs font-medium ${
                        item.is_credit ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {item.is_credit ? 'Credit' : 'Cash'}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="col-span-1">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
                        placeholder="Enter description"
                      />
                    </div>

                    {/* Payment Method */}
                    <div className="col-span-1">
                      <select
                        value={item.payment_method}
                        onChange={(e) => updateItem(item.id, 'payment_method', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
                      >
                        <option value="">Select method</option>
                        <option value="cash">Cash</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="upi">UPI</option>
                        <option value="cheque">Cheque</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Date */}
                    <div className="col-span-1">
                      <input
                        type="date"
                        value={item.income_date}
                        onChange={(e) => updateItem(item.id, 'income_date', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-mountain-500 focus:border-mountain-500"
                        required
                      />
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => removeRow(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        disabled={incomeItems.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={addNewRow}
                className="flex items-center space-x-2 px-4 py-2 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Row</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save All Income Records'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Create Customer Modal */}
      {showCreateCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create New Customer</h3>
              <button
                onClick={() => setShowCreateCustomerModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
                <select
                  value={newCustomer.customer_type}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, customer_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                >
                  <option value="individual">Individual</option>
                  <option value="business">Business</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  placeholder="Enter address"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newCustomer.city}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={newCustomer.state}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                    placeholder="State"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500"
                  placeholder="Additional notes"
                  rows={2}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateCustomerModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomer}
                className="px-4 py-2 bg-mountain-600 text-white rounded-lg hover:bg-mountain-700 transition-colors"
              >
                Create Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExcelLikeIncomeForm
