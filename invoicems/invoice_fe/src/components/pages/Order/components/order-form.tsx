import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Calendar, Package, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Order, OrderItem, Product } from '@/impData/types';
import { dummyRetailers, dummySalespersons, dummyVendors } from '@/impData/data';
import { smClient } from '@/lib';
import { createOrder, CreateOrderDTO } from '@/service/order';
import { getAllProducts } from '@/service/product';
import { useToast } from '@/components/ui/use-toast';

interface OrderFormProps {
 order: Order; 
  orderItems?: OrderItem[];
  onBack?: () => void;
  onSuccess?: () => void;
  onCancel?: () => void;
  isAddPage?: boolean;
}


export const OrderForm: React.FC<OrderFormProps> = ({ 
  order, 
  orderItems: initialOrderItems = [],
  onBack, 
  onSuccess,
  onCancel,
  isAddPage = false
}) => {
  // Helper to generate order number in YYMMDDHHMMSSMMM format
  const generateOrderNumber = () => {
    const now = new Date();
    const pad = (n: number, len = 2) => n.toString().padStart(len, '0');
    const year = now.getFullYear().toString().slice(-2);
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hour = pad(now.getHours());
    const min = pad(now.getMinutes());
    const sec = pad(now.getSeconds());
    const ms = pad(now.getMilliseconds(), 3);
    return `${year}${month}${day}${hour}${min}${sec}${ms}`;
  };

  const initialOrderNumber = isAddPage ? generateOrderNumber() : (order?.orderNumber || '');

  const [formData, setFormData] = useState<Order>({
    orderNumber: initialOrderNumber,
    retailer: order?.retailer || '',
    salesperson: order?.salesperson || '',
    customer: order?.customer || '',
    orderDate: order?.orderDate || '',
    expectedDeliveryDate: order?.expectedDeliveryDate || '',
    totalAmount: order?.totalAmount || 0,
    description: order?.description || '',
    orderId: order?.orderId
  });

  // Customer dropdown state
  const [customerOptions, setCustomerOptions] = useState<{ id: string; businessName: string }[]>([]);
  const [customerLoading, setCustomerLoading] = useState(false);
  useEffect(() => {
    setCustomerLoading(true);
    smClient.post('/customers/filterCustomers', { limit: 1000, filters: [] })
      .then(res => {
        const customers = Array.isArray(res.data) ? res.data : [];
        setCustomerOptions(customers.map(c => ({ id: c.id || c.customerId, businessName: c.businessName })));
      })
      .catch(() => setCustomerOptions([]))
      .finally(() => setCustomerLoading(false));
  }, []);
  // const generateOrderNumber = () => {
  //   const now = new Date();

  //   const YY = String(now.getFullYear()).slice(-2);
  //   const MM = String(now.getMonth() + 1).padStart(2, '0');
  //   const DD = String(now.getDate()).padStart(2, '0');
  //   const HH = String(now.getHours()).padStart(2, '0');
  //   const MIN = String(now.getMinutes()).padStart(2, '0');
  //   const SS = String(now.getSeconds()).padStart(2, '0');
  //   const MS = String(now.getMilliseconds()).padStart(3, '0');

  //   return `${YY}${MM}${DD}${HH}${MIN}${SS}${MS}`;
  // };

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Order Items State
  const [orderItems, setOrderItems] = useState<OrderItem[]>(initialOrderItems);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [itemError, setItemError] = useState<string>('');
  const [productSearch, setProductSearch] = useState<string>('');

  // Auto-calculate total amount whenever order items change
  useEffect(() => {
    const total = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setFormData(prev => ({ ...prev, totalAmount: total }));
  }, [orderItems]);

  // Find product by id
  const getProduct = (id: string) => products.find(p => p.id === id);
  // Filtered products for search
  const filteredProducts = products.filter(p =>
    p.productName.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.productCode.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Add OrderItem handler
  const handleAddOrderItem = () => {
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
    const newItem: OrderItem = {
      product: product.productName,
      quantity: itemQuantity,
      unitPrice,
      totalPrice,
      taxRate,
      taxAmount,
    };
    setOrderItems([...orderItems, newItem]);
    setSelectedProductId('');
    setItemQuantity(1);
    setItemError('');
  };

    // ✅ Auto-fill order number when Add page opens
  useEffect(() => {
    if (isAddPage) {
      setFormData(prev => ({
        ...prev,
        orderNumber: generateOrderNumber()
      }));
    }
  }, [isAddPage]);

    const validateForm = () => {
      const newErrors: Record<string, string> = {};
      const today = new Date();
      today.setHours(0,0,0,0);
      if (!formData.orderNumber?.trim()) {
        newErrors.orderNumber = "Order number is required";
      }
      if (!formData.retailer?.trim()) {
        newErrors.retailer = "Retailer is required";
      }
      if (!formData.salesperson?.trim()) {
        newErrors.salesperson = "Salesperson is required";
      }
      if (!formData.customer?.trim()) {
        newErrors.customer = "Customer is required";
      }
      if (!formData.orderDate?.trim()) {
        newErrors.orderDate = "Order date is required";
      } else {
        const orderDateObj = new Date(formData.orderDate);
        orderDateObj.setHours(0,0,0,0);
        if (orderDateObj < today) {
          newErrors.orderDate = "Order date cannot be in the past";
        }
      }
      if (!formData.expectedDeliveryDate?.trim()) {
        newErrors.expectedDeliveryDate = "Expected delivery date is required";
      } else {
        const expectedDateObj = new Date(formData.expectedDeliveryDate);
        expectedDateObj.setHours(0,0,0,0);
        if (expectedDateObj < today) {
          newErrors.expectedDeliveryDate = "Expected delivery date cannot be in the past";
        }
      }
      if (formData.totalAmount !== undefined && formData.totalAmount < 0) {
        newErrors.totalAmount = "Total amount cannot be negative";
      }
      if (!orderItems || orderItems.length === 0) {
        newErrors.orderItems = "At least one order item is required";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
      let isMounted = true;
      getAllProducts()
        .then(items => {
          if (!isMounted) return;
          setProducts(items.map(item => ({
            id: item.productId,
            productName: item.productName,
            productCode: item.productCode,
            categoryId: item.categoryId,
            description: item.description || "",
            unitPrice: Number(item.unitPrice || 0),
            stockUnit: item.stockUnit || "",
            taxRate: Number(item.taxRate || 0),
            status: item.status,
            createdBy: item.createdBy || "",
            createdAt: item.createdDate || "",
            updatedAt: item.lastModifiedDate || item.createdDate || "",
          })));
        })
        .catch(() => {
          if (isMounted) {
            toast({ title: "Unable to load products", description: "Check the backend connection and try again.", variant: "destructive" });
          }
        })
        .finally(() => {
          if (isMounted) setProductsLoading(false);
        });
      return () => { isMounted = false; };
    }, []);

      const handleCancel = () => {
        if (onCancel) {
          onCancel();
        } else if (onBack) {
          onBack();
        }
      };

    const handleSave = async () => {
      console.log("💾 Saving order with data:", formData);
      if (validateForm()) {
        setIsLoading(true);
        try {
          const orderPayload: CreateOrderDTO = {
            orderNumber: formData.orderNumber,
            retailer: formData.retailer,
            salesperson: formData.salesperson,
            customer: formData.customer,
            orderDate: formData.orderDate,
            expectedDeliveryDate: formData.expectedDeliveryDate,
            totalAmount: formData.totalAmount,
            description: formData.description || "",
            orderlist: orderItems.map(item => ({
              product: item.product,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              taxRate: typeof item.taxRate === 'number' ? item.taxRate.toString() : item.taxRate || "0",
              taxAmount: item.taxAmount,
            }))
          };
        console.log("🚀 Order Payload:", JSON.stringify(orderPayload, null, 2));
        console.log("🔍 API Endpoint: POST /order/createOrder");
        const response = await createOrder(orderPayload);
        console.log("🔔 createOrder response:", response?.data ?? response);
        // Determine friendly message from backend response (lenient check)
        // `createOrder` returns `response.data` already, which can be a string or object.
        let respText = '';
        if (typeof response === 'string') respText = response;
        else if (response && typeof response === 'object') {
          respText = (response.description || response.message || response.status || JSON.stringify(response));
        }
        const respMsg = String(respText).trim().toLowerCase();
        if (respMsg && respMsg.includes('order') && (respMsg.includes('add') || respMsg.includes('success') || respMsg.includes('added') || respMsg.includes('created'))) {
  toast({
    title: "Success",
    description: "Order created successfully",
    variant: "default",
    className: "bg-green-50 border-green-200 text-green-900"
  });
console.log("➡️ Going back now");
  // Prefer explicit onSuccess, otherwise fall back to onBack or onCancel
  if (onSuccess) {
    onSuccess();
  } else if (onBack) {
    onBack();
  } else if (onCancel) {
    onCancel();
  }
}
        } catch (error: any) {
           console.error("❌ Error saving order:", error);
           let errorMessage = "Failed to create order";
           
           if (error.response) {
             // Server responded with error
             errorMessage = error.response.data || error.response.statusText || errorMessage;
             console.error("Server error:", error.response.status, error.response.data);
           } else if (error.request) {
             // Request made but no response
             errorMessage = "Cannot connect to server. Please check if the backend is running on port 8060.";
             console.error("Network error - no response received:", error.request);
           } else {
             // Error in request setup
             errorMessage = error.message || errorMessage;
             console.error("Request setup error:", error.message);
           }
           
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    return (

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-emerald-900">
                {isAddPage ? 'Add order' : 'Add order'}
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                {isAddPage ? 'Add order information' : 'Add order information'}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Save className="h-4 w-4 " />
              {isLoading ? 'Saving...' : (isAddPage ? 'Add' : 'Save')}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                <Input value={formData.orderId || 'Auto-generated'} disabled className="bg-gray-50 py-2 rounded-[8px]" />
                <p className="text-xs text-gray-500 mt-1">Order ID will be generated on save</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Number <span className="text-red-500">*</span></label>
                <Input
                  value={formData.orderNumber}
                  readOnly
                  disabled
                  placeholder="Auto-generated order number"
                  className={errors.orderNumber ? "border-red-500 py-2 rounded-[8px] bg-gray-100" : "py-2 rounded-[8px] bg-gray-100"}
                />
                <p className="text-xs text-gray-500 mt-1">Order number is auto-generated and read-only. Format: YYMMDDHHMMSSMMM</p>
                {errors.orderNumber && <p className="text-xs text-red-500 mt-1">{errors.orderNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Retailer <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.retailer}
                  onChange={(e) => setFormData({ ...formData, retailer: e.target.value })}
                  placeholder="Enter retailer name"
                  className={errors.retailer ? "border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm border-red-500 py-2 rounded-[8px] w-full" : "border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm py-2 rounded-[8px] w-full px-3"}
                />
                {errors.retailer && <p className="text-xs text-red-500 mt-1">{errors.retailer}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salesperson <span className="text-red-500">*</span></label>
                <Input
                  type="text"
                  value={formData.salesperson}
                  onChange={(e) => setFormData({ ...formData, salesperson: e.target.value })}
                  placeholder="Enter salesperson name"
                  className={errors.salesperson ? "border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm border-red-500 py-2 rounded-[8px] w-full" : "border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm py-2 rounded-[8px] w-full px-3"}
                />
                {errors.salesperson && <p className="text-xs text-red-500 mt-1">{errors.salesperson}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer <span className="text-red-500">*</span></label>
                <Select
                  value={formData.customer}
                  onValueChange={(value) => setFormData({ ...formData, customer: value })}
                  disabled={customerLoading}
                >
                  <SelectTrigger className={errors.customer ? "border border-red-500 py-2 rounded-[8px] w-full" : "border border-gray-300 py-2 rounded-[8px] w-full"}>
                    <SelectValue placeholder={customerLoading ? "Loading..." : "Select company name"} />
                  </SelectTrigger>
                  <SelectContent>
                    {customerOptions.map((customer) => (
                      <SelectItem key={customer.id} value={customer.businessName}>
                        {customer.businessName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.customer && <p className="text-xs text-red-500 mt-1">{errors.customer}</p>}
              </div>
              {/* Order Date and Expected Delivery Date moved to Additional Details */}
            </div>
          </div>
          {/* Additional Details */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Additional Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Date <span className="text-red-500">*</span></label>
                <Input
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                  className={errors.orderDate ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
                />
                {errors.orderDate && <p className="text-xs text-red-500 mt-1">{errors.orderDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery Date <span className="text-red-500">*</span></label>
                <Input
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                  className={errors.expectedDeliveryDate ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
                />
                {errors.expectedDeliveryDate && <p className="text-xs text-red-500 mt-1">{errors.expectedDeliveryDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <Input
                  type="number"
                    value={formData.totalAmount.toFixed(2)}
                    readOnly
                    disabled
                  placeholder="Auto-calculated from items"
                  className="py-2 rounded-[8px] bg-gray-100"
                />
                {errors.totalAmount && <p className="text-xs text-red-500 mt-1">{errors.totalAmount}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                  rows={4}
                  className="w-full border rounded-[8px] py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Section */}
        <div className="bg-white rounded-lg border border-gray-200 mt-8">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
            <Button
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              onClick={handleAddOrderItem}
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
                      disabled={productsLoading || products.length === 0}
                    >
                      <option value="">{productsLoading ? "Loading products..." : products.length ? "Select product" : "No products available"}</option>
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
            {/* Order Items Table */}
            {orderItems.length > 0 && (
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
                      {orderItems.map((item, idx) => {
                        return (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50'}>
                            <td className="border px-2 py-1">{item.product}</td>
                            <td className="border px-2 py-1 text-center">
                              <input
                                type="number"
                                min={1}
                                className="w-16 border rounded px-1 py-1 text-center"
                                value={item.quantity}
                                onChange={e => {
                                  const newQty = Number(e.target.value);
                                  if (newQty > 0) {
                                    const updated = orderItems.map((oi, i) =>
                                      i === idx
                                        ? {
                                            ...oi,
                                            quantity: newQty,
                                            totalPrice: newQty * oi.unitPrice,
                                            taxAmount: ((newQty * oi.unitPrice) * Number(oi.taxRate)) / 100,
                                          }
                                        : oi
                                    );
                                    setOrderItems(updated);
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
                                  setOrderItems(orderItems.filter((_, i) => i !== idx));
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
                    Total Amount: ₹{orderItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };