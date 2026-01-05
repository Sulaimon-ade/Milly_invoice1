/*
  # Add Terms and Conditions

  ## Changes
  - Add `terms_and_conditions` column to `business_settings` table
  - Stores full terms and conditions text for the business
  - Includes default terms for RentalsByMilly

  ## Details
  - Field is text type to accommodate lengthy terms
  - Default includes comprehensive damage/loss liability terms
  - Editable through business settings
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'business_settings' AND column_name = 'terms_and_conditions'
  ) THEN
    ALTER TABLE business_settings ADD COLUMN terms_and_conditions text DEFAULT '';
  END IF;
END $$;