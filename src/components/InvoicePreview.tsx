import { forwardRef, useState } from 'react';
import type { InvoiceFormData, BusinessInfo } from '../types/invoice';

interface InvoicePreviewProps {
  invoiceNumber: string;
  invoiceData: InvoiceFormData;
  businessInfo: BusinessInfo;
  onAccountChange?: (account: number) => void;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ invoiceNumber, invoiceData, businessInfo, onAccountChange }, ref) => {
    const [selectedAccount, setSelectedAccount] = useState<number>(invoiceData.selected_account || 1);
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.total_price, 0);
    const total = subtotal - invoiceData.discount + invoiceData.delivery_fee + invoiceData.refundable_caution_fee;

    const handleAccountChange = (account: number) => {
      setSelectedAccount(account);
      onAccountChange?.(account);
    };

    const hasMultipleAccounts = !!(businessInfo.account2_bank_name || businessInfo.account2_number || businessInfo.account2_holder_name);
    const currentAccount = selectedAccount === 2 ? {
      holder: businessInfo.account2_holder_name,
      bank: businessInfo.account2_bank_name,
      number: businessInfo.account2_number,
    } : {
      holder: businessInfo.account_holder_name,
      bank: businessInfo.bank_name,
      number: businessInfo.account_number,
    };

    return (
      <>
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
              <p className="text-gray-500 text-xs md:text-sm mt-2">
                Date: {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
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
            {invoiceData.refundable_caution_fee > 0 && (
              <div className="flex justify-between py-2 bg-yellow-50 px-3 py-2 rounded border-l-4 border-yellow-400">
                <span className="font-bold text-yellow-900">Refundable Caution Fee:</span>
                <span className="font-bold text-yellow-700">₦{invoiceData.refundable_caution_fee.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t-2 border-purple-600 mt-2 pt-3 flex justify-between text-xl">
              <span className="font-bold text-purple-900">Total:</span>
              <span className="font-bold text-purple-700">₦{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {(currentAccount.bank || currentAccount.number || currentAccount.holder) && (
          <div className="mb-6 md:mb-8 bg-gray-50 p-4 md:p-6 rounded-lg border-l-4 border-gray-400">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs md:text-sm font-semibold text-gray-900 uppercase">Bank Details</h3>
              {hasMultipleAccounts && (
                <div className="print:hidden flex gap-2">
                  <button
                    onClick={() => handleAccountChange(1)}
                    className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                      selectedAccount === 1
                        ? 'bg-purple-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-purple-400'
                    }`}
                  >
                    Account 1
                  </button>
                  <button
                    onClick={() => handleAccountChange(2)}
                    className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                      selectedAccount === 2
                        ? 'bg-purple-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-purple-400'
                    }`}
                  >
                    Account 2
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-gray-700 text-xs md:text-sm">
              {currentAccount.holder && (
                <div>
                  <p className="text-gray-500 font-medium">Account Holder</p>
                  <p className="font-semibold">{currentAccount.holder}</p>
                </div>
              )}
              {currentAccount.bank && (
                <div>
                  <p className="text-gray-500 font-medium">Bank</p>
                  <p className="font-semibold">{currentAccount.bank}</p>
                </div>
              )}
              {currentAccount.number && (
                <div>
                  <p className="text-gray-500 font-medium">Account Number</p>
                  <p className="font-semibold font-mono">{currentAccount.number}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="border-t-2 border-gray-200 pt-4 md:pt-6 text-center">
          <p className="text-gray-700 mb-2 text-sm md:text-base">{businessInfo.thank_you_message}</p>
          <p className="text-purple-600 font-medium text-sm md:text-base">{businessInfo.instagram_handle}</p>
        </div>
      </div>

      {businessInfo.terms_and_conditions && (
        <div className="bg-white p-12 shadow-2xl max-w-4xl mx-auto break-before-page">
          <div className="mb-12">
            <div className="flex items-center justify-center mb-8">
              <div className="flex-1 border-b-2 border-purple-600"></div>
              <h1 className="text-4xl font-bold text-purple-700 mx-8">Terms & Conditions</h1>
              <div className="flex-1 border-b-2 border-purple-600"></div>
            </div>
            <p className="text-center text-gray-500 text-sm mb-8">{businessInfo.business_name}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-gray-50 p-8 rounded-xl border border-purple-100">
            <div className="columns-2 gap-6 text-gray-700 text-sm leading-relaxed break-inside-avoid-column">
              {businessInfo.terms_and_conditions.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-justify mb-4 font-light tracking-wide">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-12 flex items-end gap-12">
            <div className="flex-1">
              <p className="text-gray-500 text-xs mb-6">Client Signature</p>
              <div className="border-b-2 border-gray-400 h-12"></div>
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-xs mb-6">Date</p>
              <div className="border-b-2 border-gray-400 h-12"></div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-purple-600 font-medium text-sm">{businessInfo.instagram_handle}</p>
          </div>
        </div>
      )}
    </>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';
