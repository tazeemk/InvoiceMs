import React, { useState } from 'react';
import { ArrowLeft, Save, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Customer } from '@/impData/types';

interface CustomerFormProps {
  customer: Customer;
  onBack: () => void;
  onSave: (updatedCustomer: Customer) => void;
  isAddPage?: boolean;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ 
  customer, 
  onBack, 
  onSave, 
  isAddPage = false
}) => {
  const [formData, setFormData] = useState<Customer>({ ...customer });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = "Contact person is required";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        ...formData,
        customerCode: formData.customerCode.trim() || `CUS-${Date.now()}`,
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
              {isAddPage ? 'Add Customer' : 'Edit Customer'}
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              {isAddPage ? 'Add customer information' : 'Modify customer information'}
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
            <Save className="h-4 w-4 mr-2" />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
              <Input value={formData.id} disabled className="bg-gray-50 py-2 rounded-[8px]" />
              <p className="text-xs text-gray-500 mt-1">Customer ID cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name <span className="text-red-500">*</span></label>
              <Input
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="Enter business name"
                className={errors.businessName ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
              />
              {errors.businessName && <p className="text-xs text-red-500 mt-1">{errors.businessName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person <span className="text-red-500">*</span></label>
              <Input
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Enter contact person name"
                className={errors.contactPerson ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
              />
              {errors.contactPerson && <p className="text-xs text-red-500 mt-1">{errors.contactPerson}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile <span className="text-red-500">*</span></label>
              <Input
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="Enter mobile number"
                className={errors.mobile ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
              />
              {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
              <Input
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                placeholder="Enter GSTIN"
                className="py-2 rounded-[8px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as "ACTIVE" | "INACTIVE" })}
              >
                <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm">
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
            <h2 className="text-lg font-semibold text-gray-900">Address & Additional Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter full address"
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Enter city"
                className={errors.city ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
              />
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Enter state"
                className={errors.state ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
              />
              {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credit Days</label>
              <Input
                type="number"
                value={formData.creditDays}
                onChange={(e) => setFormData({ ...formData, creditDays: parseInt(e.target.value) || 0 })}
                min="0"
                placeholder="Enter credit days"
                className="py-2 rounded-[8px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Outstanding</label>
              <Input
                type="number"
                value={formData.currentOutstanding}
                onChange={(e) => setFormData({ ...formData, currentOutstanding: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
                placeholder="Enter current outstanding"
                className="py-2 rounded-[8px]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
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
              formData.status === "ACTIVE"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-gray-100 text-gray-800 border border-gray-200"
            }`}>
              {formData.status}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{formData.businessName}</h3>
          <p className="text-gray-600 mb-2">Contact: {formData.contactPerson}</p>
          <p className="text-gray-600 mb-2">Mobile: {formData.mobile}</p>
          <p className="text-gray-600">{formData.city}, {formData.state}</p>
        </div>
      </div>
    </div>
  );
};