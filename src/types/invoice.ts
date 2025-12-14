export interface InvoiceFormItem {
  id: string;
  item_name: string;
  quantity: number;
  price_per_item: number;
  total_price: number;
}

export interface InvoiceFormData {
  client_name: string;
  event_date: string;
  event_location: string;
  client_phone: string;
  items: InvoiceFormItem[];
  discount: number;
  delivery_fee: number;
}

export interface BusinessInfo {
  business_name: string;
  email: string;
  phone: string;
  instagram_handle: string;
  logo_url: string;
  thank_you_message: string;
  bank_name?: string;
  account_number?: string;
  account_holder_name?: string;
}
