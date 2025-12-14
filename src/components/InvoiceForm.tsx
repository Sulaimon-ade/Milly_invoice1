import { Plus, Trash2 } from 'lucide-react';
import type { InvoiceFormData, InvoiceFormItem } from '../types/invoice';

interface InvoiceFormProps {
  formData: InvoiceFormData;
  onChange: (data: InvoiceFormData) => void;
}

export function InvoiceForm({ formData, onChange }: InvoiceFormProps) {
  const addItem = () => {
    const newItem: InvoiceFormItem = {
      id: crypto.randomUUID(),
      item_name: '',
      quantity: 1,
      price_per_item: 0,
      total_price: 0,
    };
    onChange({
      ...formData,
      items: [...formData.items, newItem],
    });
  };

  const removeItem = (id: string) => {
    onChange({
      ...formData,
      items: formData.items.filter((item) => item.id !== id),
    });
  };

  const updateItem = (id: string, updates: Partial<InvoiceFormItem>) => {
    onChange({
      ...formData,
      items: formData.items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          updated.total_price = updated.quantity * updated.price_per_item;
          return updated;
        }
        return item;
      }),
    });
  };

  const updateField = (field: keyof InvoiceFormData, value: string | number) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-purple-900 mb-4">Client Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name *
            </label>
            <input
              type="text"
              value={formData.client_name}
              onChange={(e) => updateField('client_name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter client name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.client_phone}
              onChange={(e) => updateField('client_phone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Date *
            </label>
            <input
              type="date"
              value={formData.event_date}
              onChange={(e) => updateField('event_date', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Location *
            </label>
            <input
              type="text"
              value={formData.event_location}
              onChange={(e) => updateField('event_location', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter event location"
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-purple-900">Invoice Items</h2>
          <button
            onClick={addItem}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div className="space-y-3">
          {formData.items.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-3 items-end p-4 bg-purple-50 rounded-lg"
            >
              <div className="col-span-12 md:col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={item.item_name}
                  onChange={(e) => updateItem(item.id, { item_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Item description"
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price_per_item}
                  onChange={(e) => updateItem(item.id, { price_per_item: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-3 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total
                </label>
                <div className="px-3 py-2 bg-gray-100 rounded-lg font-semibold text-purple-700">
                  ₦{item.total_price.toFixed(2)}
                </div>
              </div>
              <div className="col-span-1 md:col-span-1 flex justify-center">
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {formData.items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No items added yet. Click "Add Item" to get started.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-purple-900 mb-4">Additional Charges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount (₦)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.discount}
              onChange={(e) => updateField('discount', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Fee (₦)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.delivery_fee}
              onChange={(e) => updateField('delivery_fee', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
