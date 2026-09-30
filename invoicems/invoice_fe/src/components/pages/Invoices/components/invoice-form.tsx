import React, { useState } from 'react';
import { ArrowLeft, Save, Calendar, Package, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Invoice, InvoiceItem, Product } from '@/impData/types';
import { dummyProducts, dummyInvoiceItems, dummyRetailers, dummySalespersons, dummyVendors } from '@/impData/data';

interface InvoiceFormProps {
  invoice: Invoice;
  onBack: () => void;
  onSave: (updatedInvoice: Invoice, items: InvoiceItem[]) => void;
  isAddPage?: boolean;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ 
  invoice, 
  onBack, 
  onSave, 
  isAddPage = false
}) => {
  const [formData, setFormData] = useState<Invoice>({ ...invoice });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Invoice Items State
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(dummyInvoiceItems.filter(i => i.invoiceId === invoice.id));
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [itemError, setItemError] = useState<string>('');
  const [productSearch, setProductSearch] = useState<string>('');

  // Find product by id
  const getProduct = (id: string) => dummyProducts.find(p => p.id === id);
  // Filtered products for search
  const filteredProducts = dummyProducts.filter(p =>
    p.productName.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.productCode.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Add InvoiceItem handler
  const handleAddInvoiceItem = () => {
    if (!selectedProductId) {
      setItemError('Select a product');
      return;
    }
    if (!itemQuantity || itemQuantity <= 0) {
      setItemError('Enter valid quantity');
      return;
    }
    const product = getProduct(selectedProductId);
    if (!product) {
      setItemError('Product not found');
      return;
    }
    // Calculate prices
    const unitPrice = product.unitPrice;
    const taxRate = product.taxRate;
    const totalPrice = unitPrice * itemQuantity;
    const taxAmount = (totalPrice * taxRate) / 100;
    const newItem: InvoiceItem = {
      id: 'II' + (invoiceItems.length + 1),
      invoiceId: formData.id,
      productId: product.id,
      quantity: itemQuantity,
      unitPrice,
      totalPrice,
      taxRate,
      taxAmount,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setInvoiceItems([...invoiceItems, newItem]);
    setSelectedProductId('');
    setItemQuantity(1);
    setItemError('');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.invoiceNumber?.trim()) {
      newErrors.invoiceNumber = "Invoice number is required";
    }
    if (!formData.retailerId?.trim()) {
      newErrors.retailerId = "Retailer ID is required";
    }
    if (!formData.salespersonId?.trim()) {
      newErrors.salespersonId = "Salesperson ID is required";
    }
    if (!formData.vendorId?.trim()) {
      newErrors.vendorId = "Vendor ID is required";
    }
    if (!formData.invoiceDate?.trim()) {
      newErrors.invoiceDate = "Invoice date is required";
    }
    if (!formData.dueDate?.trim()) {
      newErrors.dueDate = "Due date is required";
    }
    if (formData.totalAmount !== undefined && formData.totalAmount < 0) {
      newErrors.totalAmount = "Total amount cannot be negative";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        ...formData,
        updatedAt: new Date().toISOString().split('T')[0]
      }, invoiceItems);
      onBack();
    }
  };

    return (

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-emerald-900">
                {isAddPage ? 'Add invoice' : 'Edit invoice'}
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                {isAddPage ? 'Add invoice information' : 'Modify invoice information'}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Save className="h-4 w-4 " />
              {isAddPage ? 'Add' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Edit Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice ID</label>
                <Input value={formData.id} disabled className="bg-gray-50 py-2 rounded-[8px]" />
                <p className="text-xs text-gray-500 mt-1">Invoice ID cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number <span className="text-red-500">*</span></label>
                <Input
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  placeholder="Enter invoice number"
                  className={errors.invoiceNumber ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
                />
                {errors.invoiceNumber && <p className="text-xs text-red-500 mt-1">{errors.invoiceNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Retailer <span className="text-red-500">*</span></label>
                <select
                  value={formData.retailerId}
                  onChange={e => setFormData({ ...formData, retailerId: e.target.value })}
                  className={errors.retailerId ? "border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm border-red-500 py-2 rounded-[8px] w-full" : "border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm py-2 rounded-[8px] w-full"}
                >
                  <option value="">Select retailer</option>
                  {dummyRetailers.map(r => (
                    <option key={r.id} value={r.id}>{r.shopName} ({r.ownerName})</option>
                  ))}
                </select>
                {errors.retailerId && <p className="text-xs text-red-500 mt-1">{errors.retailerId}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salesperson <span className="text-red-500">*</span></label>
                <select
                  value={formData.salespersonId}
                  onChange={e => setFormData({ ...formData, salespersonId: e.target.value })}
                  className={errors.salespersonId ? "border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm border-red-500 py-2 rounded-[8px] w-full" : "border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm py-2 rounded-[8px] w-full"}
                >
                  <option value="">Select salesperson</option>
                  {dummySalespersons.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName}</option>
                  ))}
                </select>
                {errors.salespersonId && <p className="text-xs text-red-500 mt-1">{errors.salespersonId}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor <span className="text-red-500">*</span></label>
                <select
                  value={formData.vendorId}
                  onChange={e => setFormData({ ...formData, vendorId: e.target.value })}
                  className={errors.vendorId ? "border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm border-red-500 py-2 rounded-[8px] w-full" : "border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm py-2 rounded-[8px] w-full"}
                >
                  <option value="">Select vendor</option>
                  {dummyVendors.map(v => (
                    <option key={v.id} value={v.id}>{v.companyName} ({v.contactPerson})</option>
                  ))}
                </select>
                {errors.vendorId && <p className="text-xs text-red-500 mt-1">{errors.vendorId}</p>}
              </div>
              {/* Invoice Date and Due Date moved to Additional Details */}
            </div>
          </div>
          {/* Additional Details */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Additional Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date <span className="text-red-500">*</span></label>
                <Input
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                  className={errors.invoiceDate ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
                />
                {errors.invoiceDate && <p className="text-xs text-red-500 mt-1">{errors.invoiceDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date <span className="text-red-500">*</span></label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className={errors.dueDate ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
                />
                {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <Input
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) })}
                  placeholder="Enter total amount"
                  className={errors.totalAmount ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
                />
                {errors.totalAmount && <p className="text-xs text-red-500 mt-1">{errors.totalAmount}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Enter description"
                  rows={4}
                  className="w-full border rounded-[8px] py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items Section */}
        <div className="bg-white rounded-lg border border-gray-200 mt-8">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Invoice Items</h2>
            <Button
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              onClick={handleAddInvoiceItem}
            >
              Add Product
            </Button>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-end gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="text"
                      className="border rounded px-3 py-2 w-1/2"
                      placeholder="Search product by name or code"
                      value={productSearch}
                      onChange={e => setProductSearch(e.target.value)}
                    />
                    <select
                      className="border rounded px-3 py-2 w-1/2"
                      value={selectedProductId}
                      onChange={e => setSelectedProductId(e.target.value)}
                    >
                      <option value="">Select product</option>
                      {filteredProducts.map(p => (
                        <option key={p.id} value={p.id}>{p.productName} ({p.productCode})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    className="border rounded px-3 py-2 w-24"
                    value={itemQuantity}
                    onChange={e => setItemQuantity(Number(e.target.value))}
                  />
                </div>
                {selectedProductId && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                    <input
                      className="border rounded px-3 py-2 w-full bg-gray-50"
                      value={getProduct(selectedProductId)?.unitPrice ?? ''}
                      disabled
                    />
                  </div>
                )}
                {selectedProductId && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                    <input
                      className="border rounded px-3 py-2 w-full bg-gray-50"
                      value={getProduct(selectedProductId)?.taxRate ?? ''}
                      disabled
                    />
                  </div>
                )}
              </div>
            </div>
            {itemError && <p className="text-xs text-red-500 mt-1">{itemError}</p>}
            {/* Invoice Items Table */}
            {invoiceItems.length > 0 && (
              <>
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full border text-sm">
                    <thead className="bg-emerald-100">
                      <tr>
                        <th className="px-2 py-1 border border-emerald-200 text-emerald-900 font-semibold">Product</th>
                        <th className="px-2 py-1 border border-emerald-200 text-emerald-900 font-semibold">Quantity</th>
                        <th className="px-2 py-1 border border-emerald-200 text-emerald-900 font-semibold">Unit Price</th>
                        <th className="px-2 py-1 border border-emerald-200 text-emerald-900 font-semibold">Total Price</th>
                        <th className="px-2 py-1 border border-emerald-200 text-emerald-900 font-semibold">Tax Rate</th>
                        <th className="px-2 py-1 border border-emerald-200 text-emerald-900 font-semibold">Tax Amount</th>
                        <th className="px-2 py-1 border border-emerald-200 text-emerald-900 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceItems.map((item, idx) => {
                        const prod = getProduct(item.productId);
                        return (
                          <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50'}>
                            <td className="border px-2 py-1">{prod?.productName || item.productId}</td>
                            <td className="border px-2 py-1 text-center">
                              <input
                                type="number"
                                min={1}
                                className="w-16 border rounded px-1 py-1 text-center"
                                value={item.quantity}
                                onChange={e => {
                                  const newQty = Number(e.target.value);
                                  if (newQty > 0) {
                                    const updated = invoiceItems.map((oi, i) =>
                                      i === idx
                                        ? {
                                            ...oi,
                                            quantity: newQty,
                                            totalPrice: newQty * oi.unitPrice,
                                            taxAmount: ((newQty * oi.unitPrice) * oi.taxRate) / 100,
                                          }
                                        : oi
                                    );
                                    setInvoiceItems(updated);
                                  }
                                }}
                              />
                            </td>
                            <td className="border px-2 py-1 text-center">{item.unitPrice}</td>
                            <td className="border px-2 py-1 text-center">{item.totalPrice}</td>
                            <td className="border px-2 py-1 text-center">{item.taxRate}%</td>
                            <td className="border px-2 py-1 text-center">{item.taxAmount}</td>
                            <td className="border px-2 py-1 text-center">
                              <button
                                className="text-red-600 hover:bg-red-50 rounded-full p-1"
                                title="Remove"
                                onClick={() => {
                                  setInvoiceItems(invoiceItems.filter((_, i) => i !== idx));
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-2">
                  <div className="font-semibold text-base">
                    Total Amount: ₹{invoiceItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };