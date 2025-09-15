# Inventory Management Setup Guide

## 🎯 **Complete Inventory Management System**

I've created a comprehensive inventory management system that integrates with your accounting system for your pickle business!

## 📋 **What's Included:**

### **1. Database Schema (`supabase-inventory-schema.sql`)**
- ✅ **Inventory Categories**: Raw Materials, Spices, Packaging, etc.
- ✅ **Inventory Items**: Individual items with stock levels, costs, suppliers
- ✅ **Inventory Transactions**: Track all stock movements (in/out/adjustments)
- ✅ **Stock Level Views**: Real-time stock status and alerts
- ✅ **Automatic Stock Updates**: Triggers to update stock when transactions occur

### **2. Inventory Service (`src/services/inventoryService.js`)**
- ✅ **CRUD Operations**: Create, read, update, delete inventory items
- ✅ **Stock Management**: Add stock, remove stock, adjust stock
- ✅ **Alerts & Reports**: Low stock alerts, expiry alerts, inventory summary
- ✅ **Search & Filter**: Find items by name, SKU, category

### **3. Inventory Dashboard (`src/components/admin/InventoryDashboard.jsx`)**
- ✅ **Overview Tab**: Summary cards, low stock alerts, expiry alerts
- ✅ **Inventory Items Tab**: Table view of all items with stock levels
- ✅ **Transactions Tab**: History of all stock movements
- ✅ **Alerts Tab**: Low stock and expiry notifications

### **4. Inventory Item Form (`src/components/admin/InventoryItemForm.jsx`)**
- ✅ **Add/Edit Items**: Complete form for inventory management
- ✅ **Stock Information**: Current stock, min/max levels, unit costs
- ✅ **Supplier Details**: Supplier name and contact information
- ✅ **Storage & Expiry**: Location tracking and expiry dates

### **5. Accounting Integration**
- ✅ **Expense Form Updated**: Now includes inventory item selection
- ✅ **Automatic Stock Updates**: When you use items in expenses, stock is automatically reduced
- ✅ **Batch Tracking**: Link inventory usage to specific production batches

## 🚀 **Setup Instructions:**

### **Step 1: Run Database Schema**
```sql
-- Run this in your Supabase SQL editor
-- Copy and paste the contents of supabase-inventory-schema.sql
```

### **Step 2: Access Inventory Management**
1. Go to your admin dashboard
2. Click on **"Inventory"** in the sidebar
3. You'll see the inventory management interface

### **Step 3: Add Your First Inventory Items**
1. Click **"Add Item"** button
2. Fill in the form:
   - **Item Name**: e.g., "Fresh Tomatoes"
   - **Category**: Select "Raw Materials"
   - **SKU**: e.g., "TOM-001"
   - **Unit**: Select "kg"
   - **Current Stock**: e.g., "50"
   - **Minimum Stock**: e.g., "10" (for low stock alerts)
   - **Unit Cost**: e.g., "25" (Rs. per kg)
   - **Supplier**: e.g., "Local Vegetable Market"
   - **Storage Location**: e.g., "Cold Storage A"

### **Step 4: Use Inventory in Expenses**
1. Go to **Accounting** → **Expenses**
2. Click **"Add Expense"**
3. In the expense items section:
   - **Product Name**: Enter manually or select from inventory
   - **Link to Inventory**: Select from your inventory items
   - **Quantity**: Enter how much you're using
   - **Amount**: Enter the cost

## 📊 **Key Features:**

### **Inventory Dashboard:**
- **Total Items**: Count of all inventory items
- **Low Stock**: Items below minimum stock level
- **Expiring Soon**: Items expiring within 30 days
- **Total Value**: Total value of current inventory

### **Stock Management:**
- **Real-time Updates**: Stock levels update automatically
- **Low Stock Alerts**: Get notified when stock is low
- **Expiry Tracking**: Track items with expiry dates
- **Supplier Management**: Keep track of suppliers

### **Accounting Integration:**
- **Expense Linking**: Link expenses to inventory items
- **Automatic Deduction**: Stock reduces when used in expenses
- **Batch Tracking**: Track which batch used which items
- **Cost Tracking**: Track costs per item and per batch

## 🥒 **Example Workflow for Your Pickle Business:**

### **1. Setup Inventory:**
```
Raw Materials:
- Fresh Tomatoes (50 kg, Rs.25/kg)
- Fresh Ginger (20 kg, Rs.150/kg)
- Green Chilies (10 kg, Rs.80/kg)
- Mustard Oil (30 liters, Rs.120/liter)

Spices:
- Turmeric Powder (5 kg, Rs.200/kg)
- Red Chili Powder (3 kg, Rs.180/kg)
- Cumin Seeds (2 kg, Rs.300/kg)

Packaging:
- Glass Jars (100 pieces, Rs.15/piece)
- Lids (100 pieces, Rs.5/piece)
- Labels (500 pieces, Rs.2/piece)
```

### **2. Create Production Batch:**
```
Batch: Mango Pickle - January 2024
- Link to inventory items
- Track usage in expenses
```

### **3. Add Expense with Inventory:**
```
Accounting Head: Raw Materials
Batch: Mango Pickle - January 2024

Items:
- Fresh Tomatoes: 10 kg from inventory (Rs.250)
- Fresh Ginger: 2 kg from inventory (Rs.300)
- Mustard Oil: 5 liters from inventory (Rs.600)

Total: Rs.1,150
```

### **4. Automatic Stock Updates:**
```
Before: Tomatoes 50 kg → After: 40 kg
Before: Ginger 20 kg → After: 18 kg
Before: Oil 30 liters → After: 25 liters
```

## 🔧 **Advanced Features:**

### **Low Stock Alerts:**
- Get notified when any item goes below minimum stock
- See exactly how much you need to reorder
- Track supplier information for quick reordering

### **Expiry Tracking:**
- Track items with expiry dates
- Get alerts 30 days before expiry
- Plan usage to avoid waste

### **Cost Analysis:**
- Track unit costs for each item
- Calculate total inventory value
- Analyze cost trends over time

### **Batch Integration:**
- Link inventory usage to specific batches
- Track which items were used in which production
- Calculate batch-wise material costs

## 📈 **Benefits for Your Pickle Business:**

1. **Never Run Out**: Low stock alerts prevent production delays
2. **Reduce Waste**: Expiry tracking helps use items before they expire
3. **Cost Control**: Track exact material costs for each batch
4. **Supplier Management**: Keep track of suppliers and their contact info
5. **Production Planning**: Know exactly what materials you have available
6. **Financial Accuracy**: Automatic stock updates ensure accurate accounting

## 🎯 **Next Steps:**

1. **Run the database schema** in Supabase
2. **Add your inventory items** (tomatoes, ginger, spices, etc.)
3. **Set minimum stock levels** for important items
4. **Start using inventory in expenses** for accurate tracking
5. **Monitor alerts** to maintain optimal stock levels

Your inventory management system is now fully integrated with your accounting system! 🥒📦💰
