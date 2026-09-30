import React, { useState } from 'react';
import { ArrowLeft, Save, Calendar, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Retailer } from '@/impData/types';

interface RetailerFormProps {
  retailer: Retailer;
  onBack: () => void;
  onSave: (updatedRetailer: Retailer) => void;
  isAddPage?: boolean;
}


export const RetailerForm: React.FC<RetailerFormProps> = ({ 
  retailer, 
  onBack, 
  onSave, 
  isAddPage = false
}) => {
  const [formData, setFormData] = useState<any>({ ...retailer });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.shopName.trim()) {
      newErrors.shopName = "Shop name is required";
    }
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Owner name is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }
    if (!formData.shopAddressId.trim()) {
      newErrors.shopAddressId = "Shop address is required";
    }
    if (!formData.billingAddressId.trim()) {
      newErrors.billingAddressId = "Billing address is required";
    }
    if (!formData.deliveryAddressId.trim()) {
      newErrors.deliveryAddressId = "Delivery address is required";
    }
    if (formData.creditLimit < 0) {
      newErrors.creditLimit = "Credit limit cannot be negative";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        ...formData,
        updatedAt: new Date().toISOString().split('T')[0]
      });
      onBack();
    }
  };

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
            <h1 className="text-xl font-bold tracking-tight text-emerald-900">
              {isAddPage ? 'Add retailer' : 'Edit retailer'}
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              {isAddPage ? 'Add retailer information' : 'Modify retailer information'}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Retailer ID</label>
                <Input value={formData.id} disabled className="bg-gray-50 py-2 rounded-[8px]" />
                <p className="text-xs text-gray-500 mt-1">Retailer ID cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name <span className="text-red-500">*</span></label>
              <Input
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                placeholder="Enter shop name"
                className={errors.shopName ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
              />
              {errors.shopName && <p className="text-xs text-red-500 mt-1">{errors.shopName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name <span className="text-red-500">*</span></label>
              <Input
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="Enter owner name"
                className={errors.ownerName ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
              />
              {errors.ownerName && <p className="text-xs text-red-500 mt-1">{errors.ownerName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
                className={errors.phone ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Address ID <span className="text-red-500">*</span></label>
              <Input
                value={formData.shopAddressId}
                onChange={(e) => setFormData({ ...formData, shopAddressId: e.target.value })}
                placeholder="Enter shop address ID"
                className={errors.shopAddressId ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
              />
              {errors.shopAddressId && <p className="text-xs text-red-500 mt-1">{errors.shopAddressId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address ID <span className="text-red-500">*</span></label>
              <Input
                value={formData.billingAddressId}
                onChange={(e) => setFormData({ ...formData, billingAddressId: e.target.value })}
                placeholder="Enter billing address ID"
                className={errors.billingAddressId ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
              />
              {errors.billingAddressId && <p className="text-xs text-red-500 mt-1">{errors.billingAddressId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address ID <span className="text-red-500">*</span></label>
              <Input
                value={formData.deliveryAddressId}
                onChange={(e) => setFormData({ ...formData, deliveryAddressId: e.target.value })}
                placeholder="Enter delivery address ID"
                className={errors.deliveryAddressId ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
              />
              {errors.deliveryAddressId && <p className="text-xs text-red-500 mt-1">{errors.deliveryAddressId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
              <Input
                value={formData.gstNumber || ""}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                placeholder="Enter GST number"
                className="py-2 rounded-[8px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit</label>
              <Input
                type="number"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) || 0 })}
                min="0"
                className={errors.creditLimit ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
              />
              {errors.creditLimit && <p className="text-xs text-red-500 mt-1">{errors.creditLimit}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as "ACTIVE" | "INACTIVE" })}
              >
                <SelectTrigger className="w-full h-8 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm">
                  <SelectValue placeholder="Select status">
                    {formData.status === "ACTIVE" ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">Active</span>
                    ) : formData.status === "INACTIVE" ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">Inactive</span>
                    ) : null}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">Active</span>
                  </SelectItem>
                  <SelectItem value="INACTIVE">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">Inactive</span>
                  </SelectItem>
                </SelectContent>
              </Select>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter product description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formData.createdAt || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formData.updatedAt || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Preview Changes</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              formData.status === "Active"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-gray-100 text-gray-800 border border-gray-200"
            }`}>
              {formData.status}
            </span>
            <span className="text-sm text-gray-500">ID: {formData.id}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{formData.productName}</h3>
          <p className="text-gray-600 mb-4">{formData.description || "No description"}</p>
          <div className="flex items-center text-sm text-gray-500">
            <Package className="h-4 w-4 mr-1" />
            {formData.productCount} products
          </div>
        </div>
      </div>
    </div>
  );
};