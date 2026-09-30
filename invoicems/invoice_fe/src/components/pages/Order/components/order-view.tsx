import React from 'react';
import { ArrowLeft, Edit, Calendar, Package, BarChart3, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Order } from '@/impData/types';

interface OrderViewPageProps {
  order: Order;
  onBack: () => void;
  onEdit: () => void;
}

export const OrderViewPage: React.FC<OrderViewPageProps> = ({ 
  order, 
  onBack,
  onEdit
}) => {
  // Get order items from the order data
  const orderItems = order.orderlist || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-emerald-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-600 mt-1">Order Details</p>
          </div>
        </div>
        <Button 
          variant="outline"
          onClick={onEdit}
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <Edit className="h-4 w-4 " />
          Edit
        </Button>
      </div>

      {/* Status Badge */}
      <div className="flex items-center space-x-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          order.status === "COMPLETED"
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-gray-100 text-gray-800 border border-gray-200"
        }`}>
          {order.status}
        </span>
        <span className="text-sm text-gray-500">ID: {order.orderId}</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">{order.totalAmount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tax Amount</p>
                <p className="text-2xl font-bold text-gray-900">{order.totalAmount ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Final Amount</p>
                <p className="text-2xl font-bold text-gray-900">{order.totalAmount ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          </div>
          <div className="p-6 space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium">Retailer:</span> {order.retailer}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium">Salesperson:</span> {order.salesperson}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium">Customer:</span> {order.customer}
            </div>
          </div>
        </div>
        {/* Additional Details */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Additional Details</h2>
          </div>
          <div className="p-6 space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              Order Date: {order.orderDate}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              Expected Delivery: {order.expectedDeliveryDate}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Package className="h-4 w-4 mr-1 text-blue-500" />
              Total Amount: {order.totalAmount}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium">Description:</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <textarea
                value={order.description || ''}
                readOnly
                rows={3}
                className="w-full border rounded-[8px] py-2 px-3 bg-gray-50 text-sm resize-none"
                placeholder="No description"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="bg-white rounded-lg border border-gray-200 mt-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-emerald-100">
                <tr>
                  <th className="px-2 py-1 border border-emerald-200 text-emerald-900 font-semibold">Product</th>
                  <th className="px-2 py-1 border border-emerald-200 text-emerald-900 font-semibold">Quantity</th>
                  <th className="px-2 py-1 border border-emerald-200 text-emerald-900 font-semibold">Unit Price</th>
                  <th className="px-2 py-1 border border-emerald-200 text-emerald-900 font-semibold">Total Price</th>
                  <th className="px-2 py-1 border border-emerald-200 text-emerald-900 font-semibold">Tax Rate</th>
                  <th className="px-2 py-1 border border-emerald-200 text-emerald-900 font-semibold">Tax Amount</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.length > 0 ? orderItems.map((item: any, idx: number) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50'}>
                      <td className="border px-2 py-1">{item.product}</td>
                      <td className="border px-2 py-1 text-center">{item.quantity}</td>
                      <td className="border px-2 py-1 text-center">{item.unitPrice}</td>
                      <td className="border px-2 py-1 text-center">{item.totalPrice}</td>
                      <td className="border px-2 py-1 text-center">{item.taxRate}%</td>
                      <td className="border px-2 py-1 text-center">{item.taxAmount}</td>
                    </tr>
                  )) : (
                  <tr>
                    <td colSpan={9} className="text-center py-4 text-gray-400">No order items</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Order status: {order.status}</span>
              <span className="text-gray-400">• {order.updatedAt}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Order updated</span>
              <span className="text-gray-400">• {order.updatedAt}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Order created</span>
              <span className="text-gray-400">• {order.createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};