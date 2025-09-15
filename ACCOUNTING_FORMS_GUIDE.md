# Accounting Forms Usage Guide

## 🎉 **Forms Are Now Working!**

The accounting system now has fully functional forms for entering data. Here's how to use them:

## 📝 **How to Enter Data**

### **1. Adding Expenses**

1. **Click "Add Expense"** button (green button in header or expenses tab)
2. **Fill in the form:**
   - **Accounting Head**: Select main category (Raw Materials, Labor, etc.)
   - **Expense Category**: Select sub-category (Vegetables, Spices, etc.)
   - **Batch**: Link to a production batch (optional)
   - **Product**: Link to specific product (optional)
   - **Description**: What you bought (e.g., "Tomato purchase for mango pickle")
   - **Amount**: Cost in Rs.
   - **Quantity**: How much you bought
   - **Unit**: kg, pieces, liters, etc.
   - **Expense Date**: When you bought it
   - **Vendor Name**: Who you bought from
   - **Payment Method**: How you paid
   - **Reference Number**: Invoice/receipt number
   - **Notes**: Additional details

3. **Click "Save Expense"**

### **2. Adding Income**

1. **Click "Add Income"** button (blue button in header or income tab)
2. **Fill in the form:**
   - **Income Category**: Sales Revenue or Other Income
   - **Batch**: Link to production batch (optional)
   - **Product**: Link to specific product (optional)
   - **Description**: What you sold (e.g., "Mango Pickle Sales")
   - **Amount**: Revenue in Rs.
   - **Quantity**: How many units sold
   - **Unit**: jars, pieces, kg, etc.
   - **Income Date**: When you sold it
   - **Customer Name**: Who bought it
   - **Payment Method**: How you received payment
   - **Reference Number**: Order/invoice number
   - **Notes**: Additional details

3. **Click "Save Income"**

### **3. Creating Batches**

1. **Click "Create Batch"** button (purple button in header or batches tab)
2. **Fill in the form:**
   - **Batch Number**: Auto-generated if left empty (e.g., BATCH-1234567890-ABC1)
   - **Batch Name**: Descriptive name (e.g., "Mango Pickle - January 2024")
   - **Production Date**: When you made the batch
   - **Status**: Active, Completed, or Cancelled
   - **Expected Quantity**: How many units you plan to make
   - **Unit**: jars, pieces, kg, etc.
   - **Description**: Special notes about this batch

3. **Click "Create Batch"**

## 🔄 **How It Works**

### **Data Flow:**
1. **Create a Batch** → Track all expenses and income for that batch
2. **Add Expenses** → Link to batch and categories
3. **Add Income** → Link to batch and track sales
4. **View Reports** → See profit/loss analysis automatically

### **Example Workflow:**
```
1. Create Batch: "Mango Pickle - Jan 2024"
2. Add Expenses:
   - Raw Materials → Vegetables → Tomato (Rs.150) → Batch: Mango Pickle - Jan 2024
   - Raw Materials → Spices → Mixed Spices (Rs.300) → Batch: Mango Pickle - Jan 2024
   - Labor Costs → Production Staff → Wages (Rs.500) → Batch: Mango Pickle - Jan 2024
3. Add Income:
   - Sales Revenue → Mango Pickle Sales (Rs.3000) → Batch: Mango Pickle - Jan 2024
4. View Results:
   - Total Expenses: Rs.950
   - Total Income: Rs.3000
   - Net Profit: Rs.2050
   - Profit Margin: 215.8%
```

## 📊 **What You'll See**

### **Dashboard Updates:**
- **Summary Cards**: Show total expenses, income, profit, and margin
- **Recent Transactions**: Latest expenses and income
- **Batch Performance**: Profit analysis for each batch
- **Real-time Calculations**: All numbers update automatically

### **Data Tables:**
- **Expenses Tab**: All expenses with filters and search
- **Income Tab**: All income with customer details
- **Batches Tab**: All batches with status and product counts

## 🎯 **Tips for Your Pickle Business**

### **1. Batch Organization:**
- Create separate batches for different pickle types
- Use consistent naming: `MANGO-2024-001`, `MIXED-2024-001`
- Include production date in batch name

### **2. Expense Categorization:**
- **Raw Materials**: All ingredients (vegetables, spices, oil, vinegar)
- **Packaging**: Jars, lids, labels, boxes
- **Labor**: Production and packaging staff wages
- **Utilities**: Electricity, water, gas for cooking
- **Transportation**: Delivery and shipping costs

### **3. Regular Data Entry:**
- Enter expenses daily or weekly
- Link all expenses to appropriate batches
- Keep vendor information for future reference

## 🚀 **Next Steps**

1. **Set up your first batch** for current production
2. **Enter historical expenses** if available
3. **Start tracking new expenses** as they occur
4. **Record sales** when you make them
5. **Monitor profit margins** regularly

## 🔧 **Troubleshooting**

### **If forms don't open:**
- Check browser console for errors
- Ensure database schema is set up
- Verify Supabase connection

### **If data doesn't save:**
- Check all required fields are filled
- Verify internet connection
- Check browser console for error messages

### **If data doesn't appear:**
- Refresh the page
- Check if data was saved successfully
- Verify you're looking in the right tab

---

**You're all set!** The accounting system is now fully functional and ready to help you track your pickle business finances! 🥒💰
