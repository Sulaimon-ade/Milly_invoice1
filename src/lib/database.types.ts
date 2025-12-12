export interface Database {
  public: {
    Tables: {
      business_settings: {
        Row: {
          id: string;
          business_name: string;
          email: string;
          phone: string;
          instagram_handle: string;
          logo_url: string;
          thank_you_message: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['business_settings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['business_settings']['Insert']>;
      };
      invoices: {
        Row: {
          id: string;
          invoice_number: string;
          client_name: string;
          event_date: string;
          event_location: string;
          client_phone: string;
          subtotal: number;
          discount: number;
          delivery_fee: number;
          total: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>;
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          item_name: string;
          quantity: number;
          price_per_item: number;
          total_price: number;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['invoice_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['invoice_items']['Insert']>;
      };
    };
  };
}

export type BusinessSettings = Database['public']['Tables']['business_settings']['Row'];
export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type InvoiceItem = Database['public']['Tables']['invoice_items']['Row'];
