import React from 'react';
import { ArrowLeft, Edit, Calendar, Package, BarChart3, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Retailer } from '@/impData/types';

interface RetailerViewPageProps {
  retailer: Retailer;
  onBack: () => void;
  onEdit: () => void;
}

export const RetailerViewPage: React.FC<RetailerViewPageProps> = ({ 
  retailer, 
  onBack,
  onEdit
}) => {
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
              {retailer.shopName}
            </h1>
            <p className="text-gray-600 mt-1">Retailer Details</p>
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
          retailer.status === "ACTIVE"
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-gray-100 text-gray-800 border border-gray-200"
        }`}>
          {retailer.status === "ACTIVE" ? "Active" : "Inactive"}
        </span>
        <span className="text-sm text-gray-500">ID: {retailer.id}</span>
      </div>

      {/* Stats Cards */}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Credit Limit</p>
              <p className="text-2xl font-bold text-gray-900">₹{retailer.creditLimit.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Phone</p>
              <p className="text-2xl font-bold text-gray-900">{retailer.phone}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">GST Number</p>
              <p className="text-2xl font-bold text-gray-900">{retailer.gstNumber || '-'}</p>
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
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Retailer ID</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{retailer.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">User ID</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{retailer.userId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Shop Name</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{retailer.shopName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Owner Name</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{retailer.ownerName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{retailer.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="mt-1">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  retailer.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-200 text-gray-800"
                }`}>
                  {retailer.status === "ACTIVE" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Address & GST Details */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Address & GST Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Shop Address ID</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{retailer.shopAddressId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Billing Address ID</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{retailer.billingAddressId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Delivery Address ID</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{retailer.deliveryAddressId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">GST Number</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{retailer.gstNumber || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Credit Limit</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">₹{retailer.creditLimit.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Additional Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{retailer.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Created Date</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  {retailer.createdAt || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Updated</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  {retailer.updatedAt || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Retailer status updated to {retailer.status === "ACTIVE" ? "Active" : "Inactive"}</span>
              <span className="text-gray-400">• {retailer.updatedAt}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Retailer updated</span>
              <span className="text-gray-400">• {retailer.updatedAt}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Retailer created</span>
              <span className="text-gray-400">• {retailer.createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};