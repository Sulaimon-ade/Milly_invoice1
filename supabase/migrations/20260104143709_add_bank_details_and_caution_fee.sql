/*
  # Add Bank Details and Refundable Caution Fee

  ## Changes
  1. New columns in `business_settings` table:
     - `bank_name` (text) - Bank name
     - `account_holder_name` (text) - Account holder name
     - `account_number` (text) - Bank account number
     
  2. New column in `invoices` table:
     - `refundable_caution_fee` (numeric) - Refundable caution deposit

  ## Details
  - Bank details are stored with default values (Mwuese Olukoya, 4098343017, Fcmb)
  - Refundable caution fee is added to invoice calculations
  - Includes backward compatibility with existing invoices (default 0)
*/

-- Add bank details columns to business_settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'business_settings' AND column_name = 'bank_name'
  ) THEN
    ALTER TABLE business_settings ADD COLUMN bank_name text DEFAULT 'Fcmb';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'business_settings' AND column_name = 'account_holder_name'
  ) THEN
    ALTER TABLE business_settings ADD COLUMN account_holder_name text DEFAULT 'Mwuese Olukoya';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'business_settings' AND column_name = 'account_number'
  ) THEN
    ALTER TABLE business_settings ADD COLUMN account_number text DEFAULT '4098343017';
  END IF;
END $$;

-- Add refundable_caution_fee column to invoices
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'refundable_caution_fee'
  ) THEN
    ALTER TABLE invoices ADD COLUMN refundable_caution_fee numeric(10, 2) DEFAULT 0;
  END IF;
END $$;

-- Update existing business settings with defaults if needed
UPDATE business_settings
SET
  bank_name = COALESCE(bank_name, 'Fcmb'),
  account_holder_name = COALESCE(account_holder_name, 'Mwuese Olukoya'),
  account_number = COALESCE(account_number, '4098343017')
WHERE bank_name IS NULL OR account_holder_name IS NULL OR account_number IS NULL;