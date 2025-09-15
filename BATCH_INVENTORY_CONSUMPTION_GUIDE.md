# Batch Inventory Consumption Guide

## Overview
The Batch Inventory Consumption feature allows you to track which raw materials are consumed in each production batch. This provides complete visibility into your production costs and inventory usage.

## Features

### 1. **Track Inventory Consumption per Batch**
- Link inventory items to specific production batches
- Record quantities consumed during production
- Track unit costs and total consumption costs
- Add notes for each consumption entry

### 2. **Automatic Stock Management**
- Physical inventory is automatically reduced when items are consumed
- Stock validation prevents over-consumption
- Real-time inventory updates

### 3. **Cost Analysis**
- View total inventory costs per batch
- Compare inventory costs vs. other expenses
- Track profit margins including raw material costs

### 4. **View and Edit Management**
- View detailed consumption data for each batch
- Edit quantities and costs if mistakes are made
- Delete consumption items (inventory is automatically restored)
- Real-time inventory adjustments when editing

## How to Use

### Step 1: Create a Production Batch
1. Go to **Admin Dashboard** → **Accounting** tab
2. Click **"Create Batch"** button
3. Fill in batch details:
   - Batch Name (e.g., "Pickle Batch #001")
   - Batch Number (e.g., "PB-2024-001")
   - Production Date
   - Status (e.g., "In Production")
   - Notes (optional)

### Step 2: Add Inventory Consumption
1. In the **Batch Management** section, find your batch
2. Click the **Package icon** (📦) in the Actions column
3. **Quick Overview**: See available inventory at the top of the form
4. Fill in the consumption form:
   - **Select Inventory Item**: Choose from dropdown showing available quantities
     - Green: Good stock levels
     - Orange: Low stock warning
     - Red: Out of stock (disabled)
   - **Quantity Consumed**: Enter amount used (e.g., 50kg of tomatoes)
   - **Unit Cost**: Auto-filled from inventory, can be adjusted
   - **Notes**: Optional description

### Step 3: Add Multiple Items
- Click **"Add Item"** to track multiple inventory items
- Each item can have different quantities and costs
- System validates stock availability for each item

### Step 4: Review and Save
- Review total consumption cost
- Click **"Save Consumption"** to record
- Physical inventory is automatically updated

### Step 5: View and Manage Consumption
- Click the **Eye icon** (👁️) next to any batch to view consumption details
- **View all consumed items** with quantities and costs
- **Edit quantities and costs** by clicking the Edit button
- **Delete items** if mistakes were made (inventory will be restored)
- **Add new items** using the "Add Item" button

## Example Workflow

### Pickle Production Batch
**Batch**: "Spicy Pickle Batch #001"

**Inventory Consumed**:
- Tomatoes: 50kg × Rs.80/kg = Rs.4,000
- Onions: 20kg × Rs.60/kg = Rs.1,200
- Spices Mix: 5kg × Rs.200/kg = Rs.1,000
- Vinegar: 10L × Rs.50/L = Rs.500
- **Total Inventory Cost**: Rs.6,700

## Benefits

### 1. **Complete Cost Tracking**
- Know exactly what raw materials cost per batch
- Track inventory usage patterns
- Identify cost optimization opportunities

### 2. **Inventory Management**
- Prevent over-consumption with stock validation
- Real-time inventory updates
- Better planning for future batches

### 3. **Profit Analysis**
- Compare total batch costs (inventory + other expenses) vs. income
- Track profit margins per batch
- Make data-driven pricing decisions

## Database Schema

The system creates these tables:
- `batch_inventory_consumption`: Tracks consumption per batch
- `batch_inventory_details`: View with detailed consumption info
- `batch_cost_summary`: Cost analysis per batch

## Integration

- **Inventory System**: Automatically reduces physical stock
- **Accounting System**: Links consumption to batch costs
- **Reporting**: Provides cost analysis and profit tracking

## Best Practices

1. **Record consumption immediately** after production
2. **Use accurate quantities** - measure what you actually use
3. **Add descriptive notes** for future reference
4. **Review costs regularly** to optimize production
5. **Keep inventory levels updated** to prevent stockouts

## Troubleshooting

### "Insufficient Stock" Error
- Check current inventory levels
- Add more stock if needed
- Verify quantities are correct

### Missing Inventory Items
- Ensure items are added to inventory first
- Check if items are marked as active
- Verify proper categorization

### Cost Calculations
- Unit costs are auto-filled from inventory
- Can be adjusted for specific batches
- Total cost = quantity × unit cost

---

This feature provides complete visibility into your production costs and helps optimize your pickle business operations! 🥒📊
