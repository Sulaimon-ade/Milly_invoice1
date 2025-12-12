/*
  # Create Invoice System for RentalsByMilly

  ## Overview
  This migration creates a complete invoice management system for a luxury event rentals business.

  ## New Tables
  
  ### `business_settings`
  Stores business contact information and branding
  - `id` (uuid, primary key)
  - `business_name` (text) - Business name
  - `email` (text) - Contact email
  - `phone` (text) - Contact phone number
  - `instagram_handle` (text) - Instagram handle
  - `logo_url` (text) - Logo image URL
  - `thank_you_message` (text) - Footer message
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `invoices`
  Main invoice records
  - `id` (uuid, primary key)
  - `invoice_number` (text, unique) - Auto-generated invoice number
  - `client_name` (text) - Customer name
  - `event_date` (date) - Event date
  - `event_location` (text) - Event location
  - `client_phone` (text) - Customer phone
  - `subtotal` (numeric) - Subtotal amount
  - `discount` (numeric) - Discount amount
  - `delivery_fee` (numeric) - Delivery fee
  - `total` (numeric) - Final total
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `invoice_items`
  Line items for each invoice
  - `id` (uuid, primary key)
  - `invoice_id` (uuid, foreign key) - References invoices
  - `item_name` (text) - Item description
  - `quantity` (integer) - Quantity
  - `price_per_item` (numeric) - Unit price
  - `total_price` (numeric) - Line total
  - `sort_order` (integer) - Display order
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Allow public read/write access for business_settings (single row)
  - Allow public read/write access for invoices and invoice_items (for demo purposes)
*/

-- Create business_settings table
CREATE TABLE IF NOT EXISTS business_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text DEFAULT 'RentalsByMilly',
  email text DEFAULT '',
  phone text DEFAULT '',
  instagram_handle text DEFAULT '@rentalsbymilly',
  logo_url text DEFAULT '',
  thank_you_message text DEFAULT 'Thank you for your business! We look forward to making your event unforgettable.',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  client_name text NOT NULL,
  event_date date NOT NULL,
  event_location text NOT NULL,
  client_phone text DEFAULT '',
  subtotal numeric(10, 2) DEFAULT 0,
  discount numeric(10, 2) DEFAULT 0,
  delivery_fee numeric(10, 2) DEFAULT 0,
  total numeric(10, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price_per_item numeric(10, 2) NOT NULL,
  total_price numeric(10, 2) NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies for business_settings (public access for demo)
CREATE POLICY "Allow public read access to business_settings"
  ON business_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to business_settings"
  ON business_settings FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to business_settings"
  ON business_settings FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create policies for invoices (public access for demo)
CREATE POLICY "Allow public read access to invoices"
  ON invoices FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to invoices"
  ON invoices FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to invoices"
  ON invoices FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to invoices"
  ON invoices FOR DELETE
  TO public
  USING (true);

-- Create policies for invoice_items (public access for demo)
CREATE POLICY "Allow public read access to invoice_items"
  ON invoice_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to invoice_items"
  ON invoice_items FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to invoice_items"
  ON invoice_items FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to invoice_items"
  ON invoice_items FOR DELETE
  TO public
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);

-- Insert default business settings
INSERT INTO business_settings (business_name, instagram_handle, thank_you_message)
VALUES (
  'RentalsByMilly',
  '@rentalsbymilly',
  'Thank you for your business! We look forward to making your event unforgettable.'
)
ON CONFLICT DO NOTHING;