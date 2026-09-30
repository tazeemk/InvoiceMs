import React, { useState } from 'react';
import { Eye, ChevronUp, ChevronDown, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { AssignUserDialog } from './assign-user-dialog';
import { Invoice, SortDirection } from '@/impData/types';

type SortField = keyof Invoice;

interface InvoiceTableProps {
  invoices: Invoice[];
  onView?: (invoice: Invoice) => void;
  onEdit?: (invoice: Invoice) => void;
  onDelete?: (invoice: Invoice) => void;
  onPayment?: (invoice: Invoice) => void;
  onAssign?: (updatedInvoice: Invoice) => void;
  onStatusChange?: (invoice: Invoice, nextStatus: Invoice["status"]) => void;
  onSort?: (field: SortField) => void;
  sortField?: SortField | null;
  sortDirection?: SortDirection;
}

const StatusBadge: React.FC<{ status: Invoice["status"] }> = ({ status }) => (
  <span
    className={`px-2 py-1 rounded text-xs font-medium ${
      status === "PAID"
        ? "bg-green-100 text-green-800 border border-green-200"
        : status === "PENDING"
        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
        : status === "OVERDUE"
        ? "bg-red-100 text-red-800 border border-red-200"
        : status === "CANCELLED"
        ? "bg-gray-300 text-gray-700 border border-gray-400"
        : status === "IN_PROGRESS"
        ? "bg-blue-100 text-blue-800 border border-blue-200"
        : status === "PARTIAL_PAID"
        ? "bg-orange-100 text-orange-800 border border-orange-200"
        : status === "ON_HOLD"
        ? "bg-purple-100 text-purple-800 border border-purple-200"
        : "bg-gray-100 text-gray-800 border border-gray-200"
    }`}
  >
    {status.replace(/_/g, ' ')}
  </span>
);

const SortableHeader: React.FC<{
  label: string;
  field: SortField;
  onSort?: (field: SortField) => void;
  sortField?: SortField | null;
  sortDirection?: SortDirection;
}> = ({ label, field, onSort, sortField, sortDirection }) => {
  const isSorting = sortField === field;
  return (
    <TableHead onClick={() => onSort && onSort(field)} className="cursor-pointer select-none whitespace-nowrap">
      <div className="flex items-center">
        {label}
        {isSorting ? (
          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
        ) : (
          <div className="h-4 w-4 ml-1" />
        )}
      </div>
    </TableHead>
  );
};

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  onView,
  onEdit,
  onDelete,
  onPayment,
  onAssign,
  onSort,
  sortField,
  sortDirection,
}) => {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [invoiceToAssign, setInvoiceToAssign] = useState<Invoice | null>(null);

  const openAssignDialog = (invoice: Invoice) => {
    setInvoiceToAssign(invoice);
    setAssignDialogOpen(true);
  };

  const closeAssignDialog = () => {
    setAssignDialogOpen(false);
    setInvoiceToAssign(null);
  };

  const handleAssigned = (updatedInvoice: Invoice) => {
    closeAssignDialog();
    onAssign && onAssign(updatedInvoice);
  };

  return (
    <>
      <div className="border border-green-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <SortableHeader label="Invoice #"       field="invoiceNumber"     onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <SortableHeader label="Status"          field="status"            onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <SortableHeader label="Customer Name"   field="customerName"      onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <SortableHeader label="Assigned User"   field="assignUser"        onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <SortableHeader label="Invoice Date"    field="invoiceDate"       onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <SortableHeader label="Due Date"        field="dueDate"           onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <SortableHeader label="Total"           field="totalAmount"       onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <SortableHeader label="Paid"            field="paidAmount"        onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <SortableHeader label="Outstanding"     field="outstandingAmount" onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell><StatusBadge status={invoice.status} /></TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>
                    {invoice.assignUser ? (
                      <span className="flex items-center gap-1.5 text-emerald-700 text-sm font-medium">
                        <UserCheck className="h-3.5 w-3.5" />
                        {invoice.assignUser}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>{invoice.invoiceDate}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>&#8377;{Number(invoice.totalAmount ?? 0).toFixed(2)}</TableCell>
                  <TableCell>&#8377;{Number(invoice.paidAmount ?? 0).toFixed(2) || 0}</TableCell>
                  <TableCell>&#8377;{Number(invoice.outstandingAmount ?? 0).toFixed(2) || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 justify-center">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(invoice)}
                          className="h-8 w-8 p-0 hover:bg-green-100"
                          title="View Invoice"
                        >
                          <Eye className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openAssignDialog(invoice)}
                        className="h-8 w-8 p-0 hover:bg-blue-100"
                        title="Assign User for Collection"
                      >
                        <UserCheck className="h-4 w-4 text-blue-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-gray-500 py-8">
                  No invoices found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AssignUserDialog
        isOpen={assignDialogOpen}
        invoice={invoiceToAssign}
        onClose={closeAssignDialog}
        onAssigned={handleAssigned}
      />
    </>
  );
};