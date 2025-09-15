# Inventory System Test Flow

## Step-by-Step Testing Guide

### 1. Reset Inventory Data
Run this SQL in Supabase to reset tomato inventory:
```sql
UPDATE inventory_items 
SET current_stock = 20, invoiced_quantity = 0 
WHERE name ILIKE '%tomato%';
```

### 2. Test the Flow

#### Step 1: Check Initial State
- Go to Inventory Dashboard
- Find Tomato item
- Should show: Physical: 20kg, Invoiced: 0kg, Available: 20kg

#### Step 2: Create First Expense
- Go to Accounting → Add Expense
- Select Tomato from inventory dropdown
- Enter quantity: 5kg
- Enter amount: Rs.100
- Save expense
- Check console logs for debugging info

#### Step 3: Verify After First Expense
- Go back to Inventory Dashboard
- Should show: Physical: 20kg, Invoiced: 5kg, Available: 15kg

#### Step 4: Create Second Expense
- Go to Accounting → Add Expense
- Select Tomato from inventory dropdown
- Enter quantity: 10kg
- Should work fine (15kg available)

#### Step 5: Try Over-Invoicing
- Go to Accounting → Add Expense
- Select Tomato from inventory dropdown
- Enter quantity: 10kg
- Should show error: "Insufficient available quantity for invoice! Available: 5kg, Requested: 10kg"

### 3. Debug Information

Check browser console for these logs:
- "Adding invoiced quantity: {itemId, quantity, referenceData}"
- "Current item data: {invoiced_quantity, current_stock, name}"
- "Updating invoiced quantity: {currentInvoiced, newInvoicedQuantity}"
- "Successfully updated invoiced quantity"
- "Validation data: {itemId, itemName, requestedQuantity, physicalStock, invoicedQuantity, availableForInvoice}"

### 4. Expected Behavior

✅ **Correct Flow:**
- Physical stock never changes (always 20kg)
- Invoiced quantity increases with each expense
- Available = Physical - Invoiced
- System prevents over-invoicing

❌ **If Still Not Working:**
- Check console logs for errors
- Verify database updates are happening
- Check if inventory data is refreshing properly
