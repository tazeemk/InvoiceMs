import React from "react";
import { ArrowLeft, Edit, Calendar, UserCircle2, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/impData/types";

interface UserViewPageProps {
  user: User;
  onBack: () => void;
  onEdit: () => void;
}

export const UserViewPage: React.FC<UserViewPageProps> = ({
  user,
  onBack,
  onEdit,
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
            <h1 className="text-2xl font-bold text-emerald-900">
              {user.username}
            </h1>
            <p className="text-gray-600">User Details</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={onEdit}
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <UserCircle2 className="h-5 w-5 text-emerald-700" />
            <span className="font-medium">Username:</span>
            <span>{user.username}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Email:</span>
            <span>{user.email}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <ShieldCheck className="h-5 w-5 text-purple-600" />
            <span className="font-medium">Role:</span>
            <span className="uppercase">{user.role}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-medium">Status:</span>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                user.status === "ACTIVE"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-gray-100 text-gray-600 border border-gray-300"
              }`}
            >
              {user.status}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-medium">Created By:</span>
            <span>{user.createdBy}</span>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-emerald-600" /> Timestamps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
          <div>
            <span className="font-medium">Created At:</span>{" "}
            {user.createdAt || "—"}
          </div>
          <div>
            <span className="font-medium">Updated At:</span>{" "}
            {user.updatedAt || "—"}
          </div>
        </div>
      </div>
    </div>
  );
};
