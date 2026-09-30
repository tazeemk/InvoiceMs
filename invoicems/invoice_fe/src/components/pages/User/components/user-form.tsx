import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/impData/types";

interface UserFormProps {
  user: User;
  onBack: () => void;
  onSave: (updatedUser: User) => void;
  isAddPage?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onBack,
  onSave,
  isAddPage = false,
}) => {
  const [formData, setFormData] = useState<User>({ ...user });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (isAddPage && !formData.password.trim())
      newErrors.password = "Password is required";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        ...formData,
        updatedAt: new Date().toISOString().split("T")[0],
      });
      
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
            <h1 className="text-xl font-bold text-emerald-900">
              {isAddPage ? "Add User" : "Edit User"}
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              {isAddPage
                ? "Enter details to create a new user"
                : "Update user information"}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Save className="h-4 w-4 mr-1" /> {isAddPage ? "Add" : "Save"}
          </Button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        {/* User ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User ID
          </label>
          <Input value={formData.id} disabled className="bg-gray-50" />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <Input
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            placeholder="Enter username"
            className={errors.username ? "border-red-500" : ""}
          />
          {errors.username && (
            <p className="text-xs text-red-500 mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter email"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password (only for Add mode) */}
        {isAddPage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter password"
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>
        )}

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <Select
            value={formData.role}
            onValueChange={(value) =>
              setFormData({ ...formData, role: value as User["role"] })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VENDOR">Vendor</SelectItem>
              <SelectItem value="SALESPERSON">Salesperson</SelectItem>
              <SelectItem value="RETAILER">Retailer</SelectItem>
              <SelectItem value="COLLECTION">COLLECTION</SelectItem>
              <SelectItem value="ACCOUNTS">ACCOUNTS</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-xs text-red-500 mt-1">{errors.role}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                status: value as "ACTIVE" | "INACTIVE",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>
    </div>
  );
};
