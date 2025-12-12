import { useState, useEffect, useRef } from 'react';
import { FileText, Settings, Download, Save, Plus, List } from 'lucide-react';
import { supabase } from './lib/supabase';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { BusinessSettings } from './components/BusinessSettings';
import type { InvoiceFormData, BusinessInfo } from './types/invoice';
import type { Invoice } from './lib/database.types';

function App() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    business_name: 'RentalsByMilly',
    email: '',
    phone: '',
    instagram_handle: '@rentalsbymilly',
    logo_url: '',
    thank_you_message: 'Thank you for your business! We look forward to making your event unforgettable.',
  });

  const [formData, setFormData] = useState<InvoiceFormData>({
    client_name: '',
    event_date: '',
    event_location: '',
    client_phone: '',
    items: [],
    discount: 0,
    delivery_fee: 0,
  });

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [savedInvoices, setSavedInvoices] = useState<Invoice[]>([]);
  const [showInvoiceList, setShowInvoiceList] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadBusinessInfo();
    loadInvoices();
    generateInvoiceNumber();
  }, []);

  const loadBusinessInfo = async () => {
    const { data } = await supabase
      .from('business_settings')
      .select('*')
      .maybeSingle();

    if (data) {
      setBusinessInfo({
        business_name: data.business_name,
        email: data.email,
        phone: data.phone,
        instagram_handle: data.instagram_handle,
        logo_url: data.logo_url,
        thank_you_message: data.thank_you_message,
      });
    }
  };

  const loadInvoices = async () => {
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setSavedInvoices(data);
    }
  };

  const generateInvoiceNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setInvoiceNumber(`INV-${timestamp}${random}`);
  };

  const saveBusinessInfo = async (info: BusinessInfo) => {
    const { data: existing } = await supabase
      .from('business_settings')
      .select('id')
      .maybeSingle();

    if (existing) {
      await supabase
        .from('business_settings')
        .update({
          business_name: info.business_name,
          email: info.email,
          phone: info.phone,
          instagram_handle: info.instagram_handle,
          logo_url: info.logo_url,
          thank_you_message: info.thank_you_message,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      await supabase.from('business_settings').insert({
        business_name: info.business_name,
        email: info.email,
        phone: info.phone,
        instagram_handle: info.instagram_handle,
        logo_url: info.logo_url,
        thank_you_message: info.thank_you_message,
      });
    }

    setBusinessInfo(info);
    setShowSettings(false);
  };

  const saveInvoice = async () => {
    if (!formData.client_name || !formData.event_date || !formData.event_location) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    const subtotal = formData.items.reduce((sum, item) => sum + item.total_price, 0);
    const total = subtotal - formData.discount + formData.delivery_fee;

    try {
      if (currentInvoiceId) {
        await supabase
          .from('invoices')
          .update({
            client_name: formData.client_name,
            event_date: formData.event_date,
            event_location: formData.event_location,
            client_phone: formData.client_phone,
            subtotal,
            discount: formData.discount,
            delivery_fee: formData.delivery_fee,
            total,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentInvoiceId);

        await supabase
          .from('invoice_items')
          .delete()
          .eq('invoice_id', currentInvoiceId);

        const itemsToInsert = formData.items.map((item, index) => ({
          invoice_id: currentInvoiceId,
          item_name: item.item_name,
          quantity: item.quantity,
          price_per_item: item.price_per_item,
          total_price: item.total_price,
          sort_order: index,
        }));

        await supabase.from('invoice_items').insert(itemsToInsert);

        alert('Invoice updated successfully!');
      } else {
        const { data: invoice, error: invoiceError } = await supabase
          .from('invoices')
          .insert({
            invoice_number: invoiceNumber,
            client_name: formData.client_name,
            event_date: formData.event_date,
            event_location: formData.event_location,
            client_phone: formData.client_phone,
            subtotal,
            discount: formData.discount,
            delivery_fee: formData.delivery_fee,
            total,
          })
          .select()
          .single();

        if (invoiceError) throw invoiceError;

        const itemsToInsert = formData.items.map((item, index) => ({
          invoice_id: invoice.id,
          item_name: item.item_name,
          quantity: item.quantity,
          price_per_item: item.price_per_item,
          total_price: item.total_price,
          sort_order: index,
        }));

        await supabase.from('invoice_items').insert(itemsToInsert);

        setCurrentInvoiceId(invoice.id);
        alert('Invoice saved successfully!');
      }

      await loadInvoices();
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice');
    }
  };

  const loadInvoice = async (invoice: Invoice) => {
    const { data: items } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoice.id)
      .order('sort_order');

    if (items) {
      setFormData({
        client_name: invoice.client_name,
        event_date: invoice.event_date,
        event_location: invoice.event_location,
        client_phone: invoice.client_phone,
        items: items.map((item) => ({
          id: item.id,
          item_name: item.item_name,
          quantity: item.quantity,
          price_per_item: item.price_per_item,
          total_price: item.total_price,
        })),
        discount: invoice.discount,
        delivery_fee: invoice.delivery_fee,
      });
      setInvoiceNumber(invoice.invoice_number);
      setCurrentInvoiceId(invoice.id);
      setShowInvoiceList(false);
    }
  };

  const createNewInvoice = () => {
    setFormData({
      client_name: '',
      event_date: '',
      event_location: '',
      client_phone: '',
      items: [],
      discount: 0,
      delivery_fee: 0,
    });
    setCurrentInvoiceId(null);
    generateInvoiceNumber();
    setShowInvoiceList(false);
  };

  const exportToPDF = () => {
    setShowPreview(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-purple-900 flex items-center gap-3">
                <FileText className="w-10 h-10" />
                {businessInfo.business_name}
              </h1>
              <p className="text-gray-600 mt-2">Professional Invoice Generator</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowInvoiceList(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <List className="w-5 h-5" />
                <span className="hidden sm:inline">Invoices</span>
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm text-gray-600">Invoice Number</p>
              <p className="text-2xl font-bold text-purple-700">#{invoiceNumber}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={createNewInvoice}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Invoice
              </button>
              <button
                onClick={saveInvoice}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                Save
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FileText className="w-5 h-5" />
                Preview
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-colors shadow-lg"
              >
                <Download className="w-5 h-5" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <InvoiceForm formData={formData} onChange={setFormData} />
          </div>

          {showPreview && (
            <div className="lg:sticky lg:top-8 h-fit">
              <div className="print:hidden mb-4">
                <h2 className="text-2xl font-bold text-purple-900">Preview</h2>
                <p className="text-gray-600">This is how your invoice will look</p>
              </div>
              <div className="print:shadow-none">
                <InvoicePreview
                  ref={previewRef}
                  invoiceNumber={invoiceNumber}
                  invoiceData={formData}
                  businessInfo={businessInfo}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {showSettings && (
        <BusinessSettings
          businessInfo={businessInfo}
          onSave={saveBusinessInfo}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showInvoiceList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-purple-900">Saved Invoices</h2>
              <p className="text-gray-600 mt-1">Select an invoice to view or edit</p>
            </div>
            <div className="p-6">
              {savedInvoices.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No saved invoices yet</p>
              ) : (
                <div className="space-y-2">
                  {savedInvoices.map((invoice) => (
                    <button
                      key={invoice.id}
                      onClick={() => loadInvoice(invoice)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-purple-700">#{invoice.invoice_number}</p>
                          <p className="text-gray-900">{invoice.client_name}</p>
                          <p className="text-sm text-gray-600">{invoice.event_location}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">₦{invoice.total.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(invoice.event_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowInvoiceList(false)}
                className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print\\:shadow-none,
            .print\\:shadow-none * {
              visibility: visible;
            }
            .print\\:shadow-none {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .print\\:hidden {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default App;
