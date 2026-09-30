// Only allow sorting by fields that exist on Retailer
export type SortField = keyof Pick<Retailer, 'id' | 'shopName' | 'ownerName' | 'phone' | 'shopAddressId' | 'billingAddressId' | 'deliveryAddressId' | 'gstNumber' | 'creditLimit' | 'status' | 'createdAt' | 'updatedAt'>;
export type SortDirection = 'asc' | 'desc';
import React from 'react';
import { Eye, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

import { Retailer } from '@/impData/types';

interface RetailerTableProps {
  retailers: Retailer[];
  onView?: (retailer: Retailer) => void;
  onEdit?: (retailer: Retailer) => void;
  onDelete?: (retailer: Retailer) => void;
}

const StatusBadge: React.FC<{ status: Retailer["status"] }> = ({ status }) => (
  <span
    className={`px-2 py-1 rounded text-xs font-medium ${
      status === "ACTIVE"
        ? "bg-green-100 text-green-800 border border-green-200"
        : "bg-gray-100 text-gray-800 border border-gray-200"
    }`}
  >
    {status}
  </span>
);

const ActionButtons: React.FC<{ 
  retailer: Retailer;
  onView?: (retailer: Retailer) => void;
  onEdit?: (retailer: Retailer) => void;
  onDelete?: (retailer: Retailer) => void;
}> = ({ retailer, onView, onEdit, onDelete }) => (
  <div className="flex items-center space-x-1">
    {onView && (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onView(retailer)}
        className="h-8 w-8 p-0 hover:bg-green-100"
        aria-label={`View ${retailer.shopName}`}
      >
        <Eye className="h-4 w-4 text-green-600" />
      </Button>
    )}
    {onEdit && (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(retailer)}
        className="h-8 w-8 p-0 hover:bg-blue-100"
        aria-label={`Edit ${retailer.shopName}`}
      >
        <Edit className="h-4 w-4 text-blue-600" />
      </Button>
    )}
    {onDelete && (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(retailer)}
        className="h-8 w-8 p-0 hover:bg-red-100"
        aria-label={`Delete ${retailer.shopName}`}
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    )}
  </div>
);

const SortableHeader: React.FC<{
  label: string;
  field: SortField;
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}> = ({ label, field, sortField, sortDirection, onSort }) => (
  <TableHead>
    <button
      onClick={() => onSort(field)}
      className="flex items-center space-x-1 transition-colors"
    >
      <span>{label}</span>
      {sortField === field && (
        sortDirection === "asc" 
          ? <ChevronUp className="h-4 w-4" />
          : <ChevronDown className="h-4 w-4" />
      )}
    </button>
  </TableHead>
);

export const RetailerTable: React.FC<RetailerTableProps> = ({
  retailers,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <div className="border border-green-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Shop Name</TableHead>
            <TableHead>Owner Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Credit Limit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {retailers.length > 0 ? (
            retailers.map((ret) => (
              <TableRow key={ret.id}>
                <TableCell>{ret.id}</TableCell>
                <TableCell>{ret.shopName}</TableCell>
                <TableCell>{ret.ownerName}</TableCell>
                <TableCell>{ret.phone}</TableCell>
                <TableCell>₹{ret.creditLimit.toFixed(2)}</TableCell>
                <TableCell><StatusBadge status={ret.status} /></TableCell>
                <TableCell>
                  <ActionButtons retailer={ret} onView={onView} onEdit={onEdit} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                No retailers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};