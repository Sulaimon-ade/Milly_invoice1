import { forwardRef } from 'react';
import type { InvoiceFormData, BusinessInfo } from '../types/invoice';

interface InvoicePreviewProps {
  invoiceNumber: string;
  invoiceData: InvoiceFormData;
  businessInfo: BusinessInfo;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ invoiceNumber, invoiceData, businessInfo }, ref) => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.total_price, 0);
    const total = subtotal - invoiceData.discount + invoiceData.delivery_fee;

    return (
      <div ref={ref} className="bg-white p-12 shadow-2xl max-w-4xl mx-auto">
        <div className="border-b-4 border-purple-600 pb-8 mb-8">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {businessInfo.logo_url && (
                <img
                  src={businessInfo.logo_url}
                  alt={businessInfo.business_name}
                  className="h-16 mb-4 object-contain"
                />
              )}
              <h1 className="text-4xl font-bold text-purple-700 mb-2">
                {businessInfo.business_name}
              </h1>
              <div className="text-gray-600 space-y-1">
                {businessInfo.email && <p>{businessInfo.email}</p>}
                {businessInfo.phone && <p>{businessInfo.phone}</p>}
                {businessInfo.instagram_handle && <p className="text-purple-600">{businessInfo.instagram_handle}</p>}
              </div>
            </div>
            <div className="text-right">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg">
                <p className="text-sm font-medium">INVOICE</p>
                <p className="text-2xl font-bold">#{invoiceNumber}</p>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Date: {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 bg-purple-50 p-6 rounded-lg border-l-4 border-purple-600">
          <h2 className="text-lg font-semibold text-purple-900 mb-3">Client Information</h2>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="text-sm text-gray-500 font-medium">Client Name</p>
              <p className="font-semibold">{invoiceData.client_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Phone Number</p>
              <p className="font-semibold">{invoiceData.client_phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Event Date</p>
              <p className="font-semibold">
                {new Date(invoiceData.event_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Event Location</p>
              <p className="font-semibold">{invoiceData.event_location}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-700 text-white">
                <th className="text-left py-3 px-4 font-semibold">Item</th>
                <th className="text-center py-3 px-4 font-semibold">Quantity</th>
                <th className="text-right py-3 px-4 font-semibold">Price per Item</th>
                <th className="text-right py-3 px-4 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="py-3 px-4 border-b border-gray-200">{item.item_name}</td>
                  <td className="text-center py-3 px-4 border-b border-gray-200">{item.quantity}</td>
                  <td className="text-right py-3 px-4 border-b border-gray-200">
                    ₦{item.price_per_item.toFixed(2)}
                  </td>
                  <td className="text-right py-3 px-4 border-b border-gray-200 font-semibold">
                    ₦{item.total_price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="flex justify-between py-2 text-gray-700">
              <span>Subtotal:</span>
              <span className="font-semibold">₦{subtotal.toFixed(2)}</span>
            </div>
            {invoiceData.discount > 0 && (
              <div className="flex justify-between py-2 text-purple-600">
                <span>Discount:</span>
                <span className="font-semibold">-₦{invoiceData.discount.toFixed(2)}</span>
              </div>
            )}
            {invoiceData.delivery_fee > 0 && (
              <div className="flex justify-between py-2 text-gray-700">
                <span>Delivery Fee:</span>
                <span className="font-semibold">₦{invoiceData.delivery_fee.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t-2 border-purple-600 mt-2 pt-3 flex justify-between text-xl">
              <span className="font-bold text-purple-900">Total:</span>
              <span className="font-bold text-purple-700">₦{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-gray-200 pt-6 text-center">
          <p className="text-gray-700 mb-2">{businessInfo.thank_you_message}</p>
          <p className="text-purple-600 font-medium">{businessInfo.instagram_handle}</p>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';
