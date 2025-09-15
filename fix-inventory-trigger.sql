-- Fix inventory trigger to not modify current_stock for adjustment transactions
-- This prevents invoiced quantities from affecting physical stock

-- Update the trigger function
CREATE OR REPLACE FUNCTION update_inventory_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update current stock based on transaction
    IF NEW.transaction_type = 'in' THEN
      UPDATE inventory_items 
      SET current_stock = current_stock + NEW.quantity,
          unit_cost = NEW.unit_cost,
          updated_at = NOW()
      WHERE id = NEW.item_id;
    ELSIF NEW.transaction_type = 'out' THEN
      UPDATE inventory_items 
      SET current_stock = current_stock - NEW.quantity,
          updated_at = NOW()
      WHERE id = NEW.item_id;
    ELSIF NEW.transaction_type = 'adjustment' THEN
      -- For adjustment transactions, don't modify current_stock
      -- This is used for invoiced quantities and other adjustments
      -- that don't affect physical stock
      NULL;
    END IF;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Reset the tomato inventory to correct values
UPDATE inventory_items 
SET current_stock = 20, invoiced_quantity = 0 
WHERE name ILIKE '%tomato%';

-- Verify the fix
SELECT 
  name, 
  current_stock, 
  invoiced_quantity, 
  (current_stock - invoiced_quantity) as available_for_invoice
FROM inventory_items 
WHERE name ILIKE '%tomato%';
