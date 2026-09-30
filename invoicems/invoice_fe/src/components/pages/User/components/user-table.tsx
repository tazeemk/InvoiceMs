import React from "react";
import {
  Eye,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import ToggleSwitch from "@/components/ToggleSwitch";
import { User } from "@/impData/types";

interface UserTableProps {
  users: User[];
  sortField: keyof User | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof User) => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onApprove: (user: User) => void;
  onReject: (user: User) => void;
  onStatusToggle: (user: User) => void;
};

export const UserTable: React.FC<UserTableProps> = ({
  users,
  sortField,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onStatusToggle,
}) => {
  const SortableHeader = ({
    label,
    field,
  }: {
    label: string;
    field: keyof User;
  }) => (
    <TableHead>
      <button
        onClick={() => onSort(field)}
        className="flex items-center space-x-1 font-semibold"
      >
        <span>{label}</span>
        {sortField === field &&
          (sortDirection === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          ))}
      </button>
    </TableHead>
  );

  return (
    <div className="border border-green-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-emerald-50">
            <SortableHeader label="ID" field="id" />
            <SortableHeader label="Username" field="username" />
            <SortableHeader label="Email" field="email" />
            <SortableHeader label="Role" field="role" />
            <SortableHeader label="Status" field="status" />
            <SortableHeader label="Created By" field="createdBy" />
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell className="font-medium text-gray-900">
                  {user.username}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className="uppercase font-semibold text-emerald-800">
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <ToggleSwitch
                    checked={user.status === "ACTIVE"}
                    onChange={() => onStatusToggle(user)}
                    labelChecked="ACTIVE"
                    labelUnchecked="INACTIVE"
                  />
                </TableCell>
                <TableCell>{user.createdBy}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(user)}
                      title="View"
                    >
                      <Eye className="h-4 w-4 text-green-600" />
                    </Button>
                    {user.status === "INACTIVE" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onApprove(user)}
                        title="Approve"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    {user.status === "ACTIVE" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReject(user)}
                        title="Deactivate"
                      >
                        <XCircle className="h-4 w-4 text-orange-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(user)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(user)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-6 text-gray-500"
              >
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
