import { Customer } from '@/impData/types';
export type SortField = keyof Pick<Customer, 'id' | 'customerCode' | 'businessName' | 'contactPerson' | 'mobile' | 'email' | 'city' | 'state' | 'status' | 'createdAt' | 'updatedAt'>;
export type SortDirection = 'asc' | 'desc';
import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

interface CustomerTableProps {
  customers: Customer[];
  onView?: (customer: Customer) => void;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}

const StatusBadge: React.FC<{ status: Customer["status"] }> = ({ status }) => (
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
  customer: Customer;
  onView?: (customer: Customer) => void;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}> = ({ customer, onView, onEdit, onDelete }) => (
  <div className="flex items-center space-x-1">
    {onView && (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onView(customer)}
        className="h-8 w-8 p-0 hover:bg-green-100"
        aria-label={`View ${customer.businessName}`}
      >
        <Eye className="h-4 w-4 text-green-600" />
      </Button>
    )}
    {onEdit && (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(customer)}
        className="h-8 w-8 p-0 hover:bg-blue-100"
        aria-label={`Edit ${customer.businessName}`}
      >
        <Edit className="h-4 w-4 text-blue-600" />
      </Button>
    )}
    {onDelete && (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(customer)}
        className="h-8 w-8 p-0 hover:bg-red-100"
        aria-label={`Delete ${customer.businessName}`}
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    )}
  </div>
);

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <div className="border border-green-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer Code</TableHead>
            <TableHead>Business Name</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Outstanding</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.customerCode}</TableCell>
                <TableCell>{customer.businessName}</TableCell>
                <TableCell>{customer.contactPerson}</TableCell>
                <TableCell>{customer.mobile}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell>₹{(customer.currentOutstanding || 0).toFixed(2)}</TableCell>
                <TableCell><StatusBadge status={customer.status} /></TableCell>
                <TableCell>
                  <ActionButtons customer={customer} onView={onView} onEdit={onEdit} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                No customers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};