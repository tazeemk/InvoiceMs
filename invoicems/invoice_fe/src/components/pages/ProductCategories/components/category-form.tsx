import React, { useState } from 'react';
import { ArrowLeft, Save, Calendar, Package, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Category } from '@/impData/types';
import { createProductCategory, updateProductCategory, CreateCategoryDTO } from '@/service/product';

interface CategoryFormProps {
  category: Category;
  onBack: () => void;
  onSave: (updatedCategory: Category) => void;
  isAddPage?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ 
  category, 
  onBack, 
  onSave, 
  isAddPage = false
}) => {
  const [formData, setFormData] = useState<Category>({ ...category });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }
    
    if (formData.productCount < 0) {
      newErrors.productCount = "Product count cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Convert status format from "Active"/"Inactive" to "ACTIVE"/"INACTIVE"
        const statusMap = {
          "Active": "ACTIVE" as const,
          "Inactive": "INACTIVE" as const
        };

        const categoryPayload: CreateCategoryDTO = {
          createdBy: null,
          createdDate: null,
          lastModifiedBy: null,
          lastModifiedDate: null,
          categoryId: isAddPage ? undefined : formData.id,
          categoryName: formData.name,
          description: formData.description || "",
          status: statusMap[formData.status as "Active" | "Inactive"] || "ACTIVE"
        };

        if (isAddPage) {
          // Create new category
          const response = await createProductCategory(categoryPayload);
          toast({
            title: "Success",
            description: "Category created successfully",
            duration: 3000,
          });
          
          // Convert response back to Category format
          const newCategory: Category = {
            id: response.categoryId,
            name: response.categoryName,
            status: response.status === "ACTIVE" ? "Active" : "Inactive",
            productCount: 0,
            description: response.description,
            createdBy: response.createdBy || "System",
            createdAt: response.createdDate || new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
          };
          
          onSave(newCategory);
        } else {
          // Update existing category
          const response = await updateProductCategory(formData.id, categoryPayload);
          toast({
            title: "Success",
            description: "Category updated successfully",
            duration: 3000,
          });
          
          const updatedCategory: Category = {
            ...formData,
            updatedAt: new Date().toISOString().split('T')[0]
          };
          
          onSave(updatedCategory);
        }
        
        onBack();
      } catch (error: any) {
        console.error("Error saving category:", error);
        const errorMessage = error?.response?.data?.message || 
                           error?.message || 
                           "Failed to save category";
        toast({
          title: "Error",
          description: errorMessage,
          duration: 3000,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
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
              {isAddPage ? 'Add Category' : 'Edit Category'}
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              {isAddPage ? 'Add category information' : 'Modify category information'}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                {isAddPage ? 'Adding...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 " />
                {isAddPage ? 'Add' : 'Save'}
              </>
            )}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Category ID</label>
              <Input value={formData.id} disabled className="bg-gray-50 py-2 rounded-[8px]" />
              <p className="text-xs text-gray-500 mt-1">Category ID cannot be changed</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
                className={errors.name ? "border-red-500 py-2 rounded-[8px]" : " py-2 rounded-[8px]"}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Count</label>
              <Input
                type="number"
                value={formData.productCount}
                onChange={(e) => setFormData({ ...formData, productCount: parseInt(e.target.value) || 0 })}
                min="0"
                className={errors.productCount ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
              />
              {errors.productCount && <p className="text-xs text-red-500 mt-1">{errors.productCount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as "Active" | "Inactive" })}
              >
                <SelectTrigger className="w-full h-8 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm">
                  <SelectValue placeholder="Select status">
                    {formData.status === "Active" ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">Active</span>
                    ) : formData.status === "Inactive" ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">Inactive</span>
                    ) : null}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">Active</span>
                  </SelectItem>
                  <SelectItem value="Inactive">
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
                placeholder="Enter category description"
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">{formData.name}</h3>
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