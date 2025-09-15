# Accounting System Setup Guide

## Overview
The Himalayan Flavours Hub accounting system provides comprehensive expense tracking, batch management, and profit analysis for your pickle business. It supports multiple costing methods based on batches, products, and accounting heads.

## 🏗️ **System Architecture**

### **Database Schema**
- **Accounting Heads**: Main categories (Raw Materials, Labor, Utilities, etc.)
- **Expense Categories**: Sub-categories under each head (Vegetables, Spices, Oil, etc.)
- **Batches**: Production batches for tracking costs
- **Expenses**: Individual expense entries with batch/product linking
- **Income**: Sales and other income tracking
- **Profit/Loss Analysis**: Automated calculations and reporting

### **Key Features**
- ✅ **Multi-level Categorization**: Accounting Heads → Expense Categories
- ✅ **Batch-based Costing**: Track costs per production batch
- ✅ **Product-specific Expenses**: Link expenses to specific products
- ✅ **Real-time Profit Analysis**: Automatic P&L calculations
- ✅ **Comprehensive Reporting**: Multiple views and filters
- ✅ **Indian Currency Support**: INR formatting and calculations

## 📊 **Accounting Structure Example**

### **For Your Pickle Business:**

```
Raw Materials (Accounting Head)
├── Vegetables (Expense Category)
│   ├── Tomato - Rs. 150 (Batch 1)
│   ├── Coriander - Rs. 550 (Batch 1)
│   └── Total: Rs. 700 (Batch 1)
├── Spices (Expense Category)
│   ├── Red Chili - Rs. 200 (Batch 1)
│   └── Turmeric - Rs. 100 (Batch 1)
└── Oil (Expense Category)
    └── Mustard Oil - Rs. 300 (Batch 1)

Labor Costs (Accounting Head)
├── Production Staff (Expense Category)
│   └── Wages - Rs. 500 (Batch 1)
└── Packaging Staff (Expense Category)
    └── Wages - Rs. 200 (Batch 1)

Packaging Materials (Accounting Head)
├── Jars & Lids (Expense Category)
│   └── Glass Jars - Rs. 400 (Batch 1)
└── Labels (Expense Category)
    └── Product Labels - Rs. 50 (Batch 1)

Total Batch 1 Expenses: Rs. 2,300
```

## 🚀 **Setup Instructions**

### **1. Database Setup**

#### Step 1: Run the Accounting Schema
Execute the SQL file in your Supabase SQL editor:
```sql
-- Run: supabase-accounting-schema.sql
```

#### Step 2: Verify Tables Created
Check that these tables are created:
- `accounting_heads`
- `expense_categories`
- `batches`
- `batch_products`
- `expenses`
- `income`

### **2. Default Data Setup**

The system comes with pre-configured accounting heads for pickle business:

**Expense Categories:**
- Raw Materials → Vegetables, Spices, Oil
- Packaging Materials → Jars & Lids, Labels, Boxes
- Labor Costs → Production Staff, Packaging Staff
- Utilities → Electricity, Water, Gas
- Transportation → Local Delivery, Shipping
- Marketing → Online Ads, Print Ads
- Administrative → Office Supplies, Phone & Internet

**Income Categories:**
- Sales Revenue
- Other Income

### **3. Admin Panel Integration**

The accounting system is integrated into your existing admin panel:

1. **Navigation**: New "Accounting" tab in admin sidebar
2. **Dashboard**: Accounting overview card added
3. **Components**: 
   - `AccountingDashboard.jsx` - Main accounting interface
   - `ExpenseManager.jsx` - Expense management
   - `accountingService.js` - Backend API calls

## 📋 **Usage Guide**

### **1. Creating Your First Batch**

1. Go to Admin Panel → Accounting → Batches
2. Click "Create Batch"
3. Fill in:
   - Batch Number: `BATCH-001`
   - Batch Name: `Mango Pickle - January 2024`
   - Production Date: Select date
   - Description: Optional details

### **2. Adding Expenses**

1. Go to Accounting → Expenses
2. Click "Add Expense"
3. Fill in expense details:
   - **Accounting Head**: Select category (e.g., Raw Materials)
   - **Expense Category**: Select sub-category (e.g., Vegetables)
   - **Batch**: Link to your batch
   - **Product**: Optional - link to specific product
   - **Description**: "Tomato purchase for mango pickle"
   - **Amount**: 150
   - **Quantity**: 5
   - **Unit**: kg
   - **Vendor**: "Local Vegetable Market"
   - **Payment Method**: Cash/Bank Transfer/UPI

### **3. Tracking Income**

1. Go to Accounting → Income
2. Click "Add Income"
3. Fill in income details:
   - **Accounting Head**: Sales Revenue
   - **Batch**: Link to batch
   - **Description**: "Mango Pickle Sales"
   - **Amount**: 5000
   - **Customer**: Customer name
   - **Payment Method**: How payment received

### **4. Viewing Reports**

1. **Overview Tab**: See summary cards and recent transactions
2. **Expenses Tab**: Detailed expense list with filters
3. **Income Tab**: Income tracking and management
4. **Batches Tab**: Batch-wise cost analysis
5. **Reports Tab**: Charts and detailed analytics

## 💡 **Best Practices for Pickle Business**

### **1. Batch Organization**
- Create separate batches for different pickle types
- Use consistent naming: `MANGO-2024-001`, `MIXED-2024-001`
- Include production date in batch name

### **2. Expense Categorization**
- **Raw Materials**: All ingredients (vegetables, spices, oil, vinegar)
- **Packaging**: Jars, lids, labels, boxes
- **Labor**: Production and packaging staff wages
- **Utilities**: Electricity, water, gas for cooking
- **Transportation**: Delivery and shipping costs
- **Marketing**: Advertising and promotional expenses

### **3. Regular Data Entry**
- Enter expenses daily or weekly
- Link all expenses to appropriate batches
- Keep vendor information for future reference
- Maintain proper documentation

### **4. Profit Analysis**
- Review batch-wise profitability regularly
- Identify high-cost ingredients
- Optimize production processes
- Track seasonal variations

## 📈 **Key Metrics to Track**

### **1. Batch Profitability**
- Total batch expenses vs. income
- Profit margin percentage
- Cost per unit produced

### **2. Category-wise Analysis**
- Which expense categories are highest
- Seasonal variations in costs
- Vendor performance

### **3. Product Performance**
- Most profitable pickle types
- Cost breakdown per product
- Pricing optimization opportunities

## 🔧 **Customization Options**

### **1. Adding New Accounting Heads**
```sql
INSERT INTO accounting_heads (name, description, type) VALUES 
('New Category', 'Description', 'expense');
```

### **2. Adding New Expense Categories**
```sql
INSERT INTO expense_categories (name, accounting_head_id, description) VALUES 
('New Sub-category', head_id, 'Description');
```

### **3. Customizing Reports**
- Modify `AccountingDashboard.jsx` for custom views
- Add new chart types in Reports tab
- Create custom export formats

## 🚨 **Important Notes**

### **1. Data Backup**
- Regular database backups recommended
- Export expense data monthly
- Keep physical receipts for audit

### **2. Security**
- All accounting data is protected by admin authentication
- Row-level security enabled on all tables
- Audit trail maintained for all changes

### **3. Scalability**
- System designed to handle thousands of transactions
- Optimized queries for large datasets
- Efficient reporting with proper indexing

## 🆘 **Troubleshooting**

### **Common Issues**

1. **Expense not showing in batch**
   - Check if expense is linked to correct batch
   - Verify batch ID in expense record

2. **Profit calculation incorrect**
   - Ensure all expenses are properly categorized
   - Check date ranges in filters

3. **Categories not loading**
   - Verify accounting heads are created
   - Check database connection

### **Support**
- Check browser console for errors
- Verify database schema is properly set up
- Contact development team for assistance

## 🎯 **Next Steps**

1. **Set up your first batch** for current production
2. **Enter historical expenses** if available
3. **Configure your specific categories** if needed
4. **Train your team** on data entry procedures
5. **Set up regular reporting** schedule

---

**Note**: This accounting system is specifically designed for the Himalayan Flavours Hub pickle business. Customize the categories and workflows to match your specific business needs.
