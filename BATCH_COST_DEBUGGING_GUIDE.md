# Batch Cost Debugging Guide

## 🔍 **Why Batch Costs Show Rs.0.00**

The batch costs are showing Rs.0.00 because expenses and income need to be properly linked to the batch. Here's how to fix this:

## ✅ **Step-by-Step Solution:**

### **1. Create a Batch First**
- Go to **Batches** tab
- Click **"Create Batch"**
- Fill in:
  - **Batch Name**: e.g., "Mango Pickle - January 2024"
  - **Batch Number**: e.g., "MANGO-2024-001"
  - **Production Date**: Select the date
  - **Status**: Active
  - **Notes**: Any additional info

### **2. Add Expenses Linked to the Batch**
- Go to **Expenses** tab
- Click **"Add Expense"**
- Fill in the form:
  - **Accounting Head**: Select "Raw Materials"
  - **Batch**: **IMPORTANT** - Select the batch you just created
  - **Product Name**: e.g., "Tomato"
  - **Quantity**: e.g., "2"
  - **Unit**: e.g., "kg"
  - **Amount**: e.g., "200"
  - Fill other details and save

### **3. Add Income Linked to the Batch**
- Go to **Income** tab
- Click **"Add Income"**
- Fill in the form:
  - **Accounting Head**: Select "Sales"
  - **Batch**: **IMPORTANT** - Select the same batch
  - **Description**: e.g., "Mango Pickle Sales"
  - **Amount**: e.g., "500"
  - Fill other details and save

### **4. Check Batch Costs**
- Go back to **Batches** tab
- You should now see the costs in the table:
  - **Total Cost**: Sum of all expenses for this batch
  - **Total Income**: Sum of all income for this batch
  - **Net Profit**: Income - Cost

## 🐛 **Debugging Steps:**

### **Check Console Logs**
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for logs like:
   ```
   Batch 123 - Expenses: 2, Income: 1
   Batch 123 - Total Expenses: 400, Total Income: 500
   ```

### **Verify Data in Database**
1. Check if expenses have `batch_id` set
2. Check if income has `batch_id` set
3. Verify the batch ID matches

### **Common Issues:**
1. **Expense not linked to batch**: Make sure to select the batch when adding expenses
2. **Income not linked to batch**: Make sure to select the batch when adding income
3. **Wrong batch ID**: Check that the batch ID in expenses/income matches the batch ID

## 📊 **New Table View Features:**

### **Batch Management Table:**
- **Batch Name**: Name and notes
- **Batch Number**: Unique identifier
- **Production Date**: When batch was made
- **Status**: Active, Completed, etc.
- **Total Cost**: All expenses for this batch
- **Total Income**: All income for this batch
- **Net Profit**: Profit/loss (green/red)
- **Products**: Number of products in batch
- **Actions**: View/Edit buttons

### **Summary Cards:**
- **Total Batches**: Count of all batches
- **Total Costs**: Sum of all batch costs
- **Total Income**: Sum of all batch income
- **Net Profit**: Overall profit/loss

## 🎯 **Test Scenario:**

1. **Create Batch**: "Test Pickle - 2024"
2. **Add Expense**: Raw Materials, Rs.300, linked to batch
3. **Add Expense**: Packaging, Rs.100, linked to batch
4. **Add Income**: Sales, Rs.600, linked to batch
5. **Check Batch**: Should show Rs.400 cost, Rs.600 income, Rs.200 profit

## 🔧 **If Still Showing Rs.0.00:**

1. **Check Console**: Look for error messages
2. **Verify Links**: Make sure expenses/income are linked to batch
3. **Refresh Page**: Sometimes data needs to reload
4. **Check Database**: Verify data is saved correctly

The key is making sure every expense and income entry is properly linked to a batch! 🥒💰
