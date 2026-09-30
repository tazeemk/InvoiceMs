import React from 'react';
import { Eye, Edit, Trash2, ChevronUp, ChevronDown, CheckCircle2, CheckCheck, CheckCircle, PackageCheck, Compass, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';


import { Order } from '@/impData/types';

interface OrderTableProps {
  orders: Order[];
  onView?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  onDelete?: (orderNumber: string) => void;
  onApprove?: (order: Order) => void;
  onCancel?: (orderNumber: string) => void;
  onReject?: (orderNumber: string) => void;
  onConfirm?: (orderNumber: string) => void;
}

const statusColorMap: Record<string, { bg: string; text: string; border: string }> = {
  ALL: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border border-gray-200' },
  CREATED: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border border-amber-200' },
  IN_PROGRESS: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border border-cyan-200' },
  COMPLETED: { bg: 'bg-green-50', text: 'text-green-800', border: 'border border-green-200' },
  CANCELLED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border border-red-200' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-800', border: 'border border-red-300' },
};

const statusLabelMap: Record<string, string> = {
  CREATED: 'Created',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REJECTED: 'Rejected',
  ALL: 'All Orders',
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const displayStatus = status.trim().toUpperCase().replaceAll(' ', '_');
  const color = statusColorMap[displayStatus] || statusColorMap.ALL;
  const label = statusLabelMap[displayStatus] || status;
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${color.bg} ${color.text} ${color.border}`}>{label}</span>
  );
};

import { Download, FileText, FileCheck2, FileSearch2, RefreshCw, Truck, Check, X, Edit2, Play, RotateCcw, Receipt, Info, Mail, CreditCard, ClipboardEdit, ClipboardList, ArrowDownToLine, Undo2 } from 'lucide-react';
import { smClient } from '@/lib';

const ActionButtons: React.FC<{ 
  order: Order;
  onView?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  onDelete?: (orderNumber: string) => void;
  onApprove?: (order: Order) => void;
  onCancel?: (orderNumber: string) => void;
  onReject?: (orderNumber: string) => void;
  onConfirm?: (orderNumber: string) => void;
}> = ({ order, onView, onEdit, onDelete, onApprove, onCancel, onReject, onConfirm }) => {
  // Helper to render a button with icon and label
  const ActionBtn = ({ icon, label, onClick, color, className = "" }: { icon: React.ReactNode, label: string, onClick?: () => void, color?: string, className?: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`h-10 w-10 p-0 flex items-center justify-center ${className}`}
      aria-label={label}
      title={label}
    >
      {React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<any>, {
            className: `${(icon as React.ReactElement<any>).props.className || ''} h-6 w-6 font-bold`,
            style: {
              ...((icon as React.ReactElement<any>).props.style || {}),
              ...(color ? { color } : {}),
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.10))',
            },
          })
        : icon}
    </Button>
  );

  const normalizedStatus = (order.status || '').trim().toUpperCase().replaceAll(' ', '_');
  const orderNumber = order.orderNumber || '';
  const viewButton = onView && <ActionBtn icon={<Eye />} label="View Details" onClick={() => onView(order)} />;
  const cancelButton = onCancel && <ActionBtn icon={<X />} label="Cancel Order" onClick={() => onCancel(orderNumber)} color="#EF4444" />;
  const rejectButton = onReject && <ActionBtn icon={<X />} label="Reject Order" onClick={() => onReject(orderNumber)} color="#B91C1C" />;

  if (normalizedStatus === 'CREATED') {
    return <div className="flex items-center space-x-1">
      {viewButton}
      {onConfirm && <ActionBtn icon={<Play />} label="Start Order" onClick={() => onConfirm(orderNumber)} color="#2563EB" />}
      {cancelButton}
      {rejectButton}
    </div>;
  }

  if (normalizedStatus === 'IN_PROGRESS') {
    return <div className="flex items-center space-x-1">
      {viewButton}
      {onConfirm && <ActionBtn icon={<BadgeCheck />} label="Mark as Completed" onClick={() => onConfirm(orderNumber)} color="#059669" />}
      {cancelButton}
      {rejectButton}
    </div>;
  }

  return <div className="flex items-center space-x-1">
    {viewButton}
    {onDelete && ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(normalizedStatus) &&
      <ActionBtn icon={<Trash2 />} label="Delete Order" onClick={() => onDelete(orderNumber)} color="#EF4444" />}
  </div>;
};

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onCancel,
  onReject,
  onConfirm
}) => {
  // Backend now returns plain names for `retailer`, `salesperson`, `customer`.
  const getRetailerName = (value?: string) => value || "-";
  const getSalespersonName = (value?: string) => value || "-";
  const getCustomerName = (value?: string) => value || "-";

  // State for showing success message
  const [deleteMsg, setDeleteMsg] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [orderNumberToDelete, setOrderNumberToDelete] = React.useState<string | null>(null);
  const [localOrders, setLocalOrders] = React.useState<Order[]>(orders);

  // Keep localOrders in sync with prop changes
  React.useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  // Open custom confirm dialog
  const handleDelete = (orderNumber: string) => {
    setOrderNumberToDelete(orderNumber);
    setConfirmOpen(true);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (!orderNumberToDelete) return;
    try {
      const res = await smClient.delete(`order/deleteOrder/${orderNumberToDelete}`);
      if (res.status === 200) {
        setDeleteMsg("Order deleted successfully");
        setLocalOrders((prev) => prev.filter(o => o.orderNumber !== orderNumberToDelete));
        setTimeout(() => setDeleteMsg(""), 3000);
      } else {
        setDeleteMsg("Failed to delete order");
        setTimeout(() => setDeleteMsg(""), 3000);
      }
    } catch (err) {
      setDeleteMsg("Failed to delete order");
      setTimeout(() => setDeleteMsg(""), 3000);
    }
    setConfirmOpen(false);
    setOrderNumberToDelete(null);
  };

  // Cancel delete action
  const cancelDelete = () => {
    setConfirmOpen(false);
    setOrderNumberToDelete(null);
  };

  return (
    <div className="border border-green-200 rounded-lg overflow-hidden">
      {deleteMsg && (
        <div className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium">{deleteMsg}</div>
      )}

      {/* Custom Confirm Dialog (no background blur/overlay) */}
      {confirmOpen && (
        <div className="absolute left-0 right-0 top-0 flex items-center justify-center z-50" style={{ pointerEvents: 'auto' }}>
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col items-center mt-24">
            <div className="text-lg font-semibold mb-2 text-gray-800">Delete Order</div>
            <div className="mb-4 text-gray-600 text-center">Are you sure you want to delete this order?</div>
            <div className="flex space-x-3">
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Yes, Delete</button>
              <button onClick={cancelDelete} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Retailer</TableHead>
            <TableHead>Salesperson</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead>Total</TableHead>
            {/* <TableHead>Notes</TableHead> */}
            {(onView || onEdit || onDelete || onApprove || onCancel || onReject || onConfirm) && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {localOrders.length > 0 ? (
            localOrders.map((order) => (
              <TableRow key={order.orderId ?? order.orderNumber}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell><StatusBadge status={order.status || ""} /></TableCell>
                <TableCell>{getRetailerName(order.retailer)}</TableCell>
                <TableCell>{getSalespersonName(order.salesperson)}</TableCell>
                <TableCell>{getCustomerName(order.customer)}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.expectedDeliveryDate}</TableCell>
                <TableCell>₹{(order.totalAmount ?? 0).toFixed(2)}</TableCell>
                {/* <TableCell>{order.description}</TableCell> */}
            {(onView || onEdit || onApprove || onCancel || onReject || onConfirm) && (
                  <TableCell>
                    <ActionButtons order={order} onView={onView} onEdit={onEdit} onDelete={handleDelete} onApprove={onApprove} onCancel={onCancel} onReject={onReject} onConfirm={onConfirm} />
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-gray-500 py-8">
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};