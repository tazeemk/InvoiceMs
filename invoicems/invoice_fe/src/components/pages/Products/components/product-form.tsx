import React, { useState } from 'react';
import { ArrowLeft, Save, Calendar, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Product } from '@/impData/types';
import { CategoryResponse, createProduct } from '@/service/product';
import { useToast } from '@/components/ui/use-toast';

interface ProductFormProps {
  product: Product;
  categories: CategoryResponse[];
  onBack: () => void;
  onSave: (updatedProduct: Product) => void | Promise<void>;
  isAddPage?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product, 
  categories,
  onBack, 
  onSave, 
  isAddPage = false
}) => {
  const [formData, setFormData] = useState<any>({ ...product });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }
    if (!formData.productCode.trim()) {
      newErrors.productCode = "HSN/SAC code is required";
    }
    if (!formData.categoryId.trim()) {
      newErrors.categoryId = "Category ID is required";
    }
    if (formData.unitPrice < 0) {
      newErrors.unitPrice = "Unit price cannot be negative";
    }
    if (formData.taxRate < 0) {
      newErrors.taxRate = "Tax rate cannot be negative";
    }
    if (formData.quantity == null || formData.quantity === "") {
      newErrors.quantity = "Quantity is required";
    } else if (formData.quantity < 0) {
      newErrors.quantity = "Quantity cannot be negative";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    if (isAddPage) {
      setIsSaving(true);
      setSubmitError("");
      try {
        const created = await createProduct({
          productName: formData.productName.trim(),
          productCode: formData.productCode.trim(),
          categoryId: formData.categoryId,
          description: formData.description || "",
          unitPrice: String(formData.unitPrice ?? 0),
          stockUnit: formData.stockUnit || "PCS",
          taxRate: String(formData.taxRate ?? 0),
          status: formData.status || "ACTIVE",
          quantity: Number(formData.quantity ?? 0),
        });

        const createdProduct: Product = {
          ...formData,
          id: created.productId,
          productName: created.productName,
          productCode: created.productCode,
          categoryId: created.categoryId,
          unitPrice: Number(created.unitPrice),
          taxRate: Number(created.taxRate),
          status: created.status,
          productCount: created.quantity ?? Number(formData.quantity ?? 0),
          createdBy: created.createdBy || "",
          createdAt: created.createdDate || "",
          updatedAt: created.lastModifiedDate || created.createdDate || "",
        };
        await onSave(createdProduct);
        toast({ title: "Product created", description: `${created.productName} was added successfully.` });
        onBack();
      } catch (error) {
        const apiError = error as { response?: { data?: unknown }; message?: string };
        const message = typeof apiError.response?.data === "string"
          ? apiError.response.data
          : apiError.message || "The product could not be created. Please try again.";
        setSubmitError(message);
        toast({ title: "Product creation failed", description: message, variant: "destructive" });
      } finally {
        setIsSaving(false);
      }

      return;
    }

    // Edit flow: call onSave locally
    onSave({
      ...formData,
      updatedAt: new Date().toISOString().split('T')[0]
    });
    onBack();
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
              {isAddPage ? 'Add product' : 'Edit product'}
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              {isAddPage ? 'Add product information' : 'Modify product information'}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="h-4 w-4 " />
            {isSaving ? 'Saving...' : isAddPage ? 'Add' : 'Save'}
          </Button>
        </div>
      </div>
      {submitError && <p role="alert" className="text-sm text-red-600">{submitError}</p>}

      {/* Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          </div>
          <div className="p-6 space-y-4">
            {!isAddPage && <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
              <Input value={formData.id} disabled className="bg-gray-50 py-2 rounded-[8px]" />
              <p className="text-xs text-gray-500 mt-1">Product ID cannot be changed</p>
            </div>}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="Enter product name"
                  className={errors.productName ? "border-red-500 py-2 rounded-[8px]" : " py-2 rounded-[8px]"}
                />
                {errors.productName && <p className="text-xs text-red-500 mt-1">{errors.productName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">HSN/SAC Code <span className="text-red-500">*</span></label>
              <Input
                value={formData.productCode}
                onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                placeholder="Enter HSN/SAC code"
                className={errors.productCode ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
              />
              {errors.productCode && <p className="text-xs text-red-500 mt-1">{errors.productCode}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className={errors.categoryId ? "border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm border-red-500 py-2 rounded-[8px] w-full" : "border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm py-2 rounded-[8px] w-full"}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
              <Input
                type="number"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                min="0"
                className={errors.unitPrice ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
              />
              {errors.unitPrice && <p className="text-xs text-red-500 mt-1">{errors.unitPrice}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <Input
                type="number"
                value={formData.quantity ?? 0}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                min="0"
                className={errors.quantity ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
              />
              {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Unit</label>
              <select
                value={formData.stockUnit || ''}
                onChange={(e) => setFormData({ ...formData, stockUnit: e.target.value })}
                className="border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm w-full py-2 rounded-[8px]"
              >
                <option value="">--Select--</option>
                <option value="Nos">Nos</option>
                <option value="Bags">Bags</option>
                <option value="Bottle">Bottle</option>
                <option value="Box">Box</option>
                <option value="Cans">Cans</option>
                <option value="Dozens">Dozens</option>
                <option value="Feet">Feet</option>
                <option value="Grams">Grams</option>
                <option value="Kg">Kg</option>
                <option value="Litres">Litres</option>
                <option value="Metres">Metres</option>
                <option value="Packets">Packets</option>
                <option value="Pices">Pices</option>
                <option value="Pair">Pair</option>
                <option value="Units">Units</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
              <Input
                type="number"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                min="0"
                className={errors.taxRate ? "border-red-500 py-2 rounded-[8px]" : "py-2 rounded-[8px]"}
              />
              {errors.taxRate && <p className="text-xs text-red-500 mt-1">{errors.taxRate}</p>}
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
            {formData.id && <span className="text-sm text-gray-500">ID: {formData.id}</span>}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{formData.productName}</h3>
          <p className="text-gray-600 mb-4">{formData.description || "No description"}</p>
          <div className="flex items-center text-sm text-gray-500">
            <Package className="h-4 w-4 mr-1" />
            {formData.quantity ?? formData.productCount ?? 0} products
          </div>
        </div>
      </div>
    </div>
  );
};