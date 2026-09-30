import React from 'react';
import { ArrowLeft, Edit, Calendar, Phone, Mail, MapPin, CreditCard, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Customer } from '@/impData/types';

interface CustomerViewPageProps {
  customer: Customer;
  onBack: () => void;
  onEdit: () => void;
}

export const CustomerViewPage: React.FC<CustomerViewPageProps> = ({ 
  customer, 
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
              {customer.businessName}
            </h1>
            <p className="text-gray-600 mt-1">Customer Details</p>
          </div>
        </div>
        <Button 
          variant="outline"
          onClick={onEdit}
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Status Badge */}
      <div className="flex items-center space-x-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          customer.status === "ACTIVE"
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-gray-100 text-gray-800 border border-gray-200"
        }`}>
          {customer.status === "ACTIVE" ? "Active" : "Inactive"}
        </span>
        <span className="text-sm text-gray-500">Code: {customer.customerCode}</span>
        <span className="text-sm text-gray-500">User ID: {customer.userId}</span>
        <span className="text-sm text-gray-500">ID: {customer.id}</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Phone className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mobile</p>
              <p className="text-xl font-bold text-gray-900">{customer.mobile}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Credit Days</p>
              <p className="text-2xl font-bold text-gray-900">{customer.creditDays} days</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <IndianRupee className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">₹{(customer.currentOutstanding || 0).toFixed(2)}</p>
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
              <label className="text-sm font-medium text-gray-700">Business Name</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{customer.businessName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Customer Code</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{customer.customerCode}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Contact Person</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{customer.contactPerson}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Mobile</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                {customer.mobile}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                {customer.email}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="mt-1">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  customer.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-200 text-gray-800"
                }`}>
                  {customer.status === "ACTIVE" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tax & Financial Details */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Tax & Financial Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">GSTIN</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{customer.gstin || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">PAN</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{customer.pan || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Credit Days</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{customer.creditDays} days</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Current Outstanding</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md font-semibold text-purple-700">
                ₹{(customer.currentOutstanding || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Created Date</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                {customer.createdAt || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Last Updated</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                {customer.updatedAt || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-gray-600" />
            Address Information
          </h2>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-900 mb-2">{customer.address}</p>
            <p className="text-sm text-gray-700">
              {customer.city}, {customer.state}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Customer status updated to {customer.status === "ACTIVE" ? "Active" : "Inactive"}</span>
              <span className="text-gray-400">• {customer.updatedAt}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Customer details updated</span>
              <span className="text-gray-400">• {customer.updatedAt}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Customer created</span>
              <span className="text-gray-400">• {customer.createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};