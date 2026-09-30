"use client";
import { } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useState, useMemo, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { OrderTable } from "./components/order-table";
import { DeleteDialog } from "./components/delete-dialog";
import { OrderForm } from "./components/order-form";
import { OrderViewPage } from "./components/order-view";
import { changeOrderStatus, cancelOrder, rejectOrder } from "@/service/order";
import { smClient } from "@/lib";

import { Order, SortDirection, CurrentPage } from "@/impData/types";
import { useToast } from "@/components/ui/use-toast";

type SortField = keyof Order;

const statusMap: Record<string, string> = {
  all: "",
  created: "CREATED",
  "in-progress": "IN_PROGRESS",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
  rejected: "REJECTED",
};

export default function OrderList() {

  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const pathname = usePathname();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [currentPage, setCurrentPage] = useState<CurrentPage>("list");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [cancelReasonOpen, setCancelReasonOpen] = useState(false);
  const [cancelTargetOrder, setCancelTargetOrder] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  // Custom confirm dialog for order confirmation
  const [confirmOrderDialogOpen, setConfirmOrderDialogOpen] = useState(false);
  const [orderToConfirm, setOrderToConfirm] = useState<string | null>(null);
  const [rejectOrderDialogOpen, setRejectOrderDialogOpen] = useState(false);
  const [orderToReject, setOrderToReject] = useState<string | null>(null);

  const pageSize = 5;


  const fetchOrders = async () => {
    try {

      const match = pathname.match(/\/orders\/?([^\/]*)/);
      const statusKey = match && match[1] ? match[1] : "all";
      const mappedStatus = statusMap[statusKey];

      let filters: any[] = [];

      if (mappedStatus && mappedStatus !== "") {
        filters.push({
          attribute: "status",
          operation: "EQUALS",
          value: mappedStatus
        });
      }

      const requestBody = {
        limit: 100,
        filters: filters
      };

      console.log("Sending request:", requestBody);

      const response = await smClient.post("order/filterOrder", requestBody);

      if (!response || response.status !== 200) {
        console.error("Backend error:", response?.status);
        return;
      }

      const data = response.data;
      console.log("Backend response:", data);

      setOrders(data);

    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };


  useEffect(() => {
    fetchOrders();
  }, [pathname]);


  const processedData = useMemo(() => {

    let filtered = [...orders];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.orderNumber?.toLowerCase().includes(term) ||
        item.retailer?.toLowerCase().includes(term) ||
        item.status?.toLowerCase().includes(term)
      );
    }

    if (sortField) {
      filtered.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (typeof aVal === "string") {
          const result = aVal.localeCompare(bVal as string);
          return sortDirection === "asc" ? result : -result;
        } else {
          const result = (aVal as number) - (bVal as number);
          return sortDirection === "asc" ? result : -result;
        }
      });
    }

    return filtered;

  }, [orders, searchTerm, sortField, sortDirection]);

  const pagedData = processedData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(processedData.length / pageSize);

  // Ensure current page remains valid when data length changes
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalPages]);

 
  const handleSearch = async (value: string) => {
    setSearchTerm(value);
   try {
      const match = pathname.match(/\/orders\/?([^\/]*)/);
      const statusKey = match && match[1] ? match[1] : "all";
      let filters: any[] = [];

        filters.push({
          attribute: "orderNumber",
          operation: "EQUALS",
          value: value
        });
      

      const requestBody = {
        limit: 100,
        filters: filters
      };

      console.log("Sending request:", requestBody);

      const response = await smClient.post("order/filterOrder", requestBody);

      if (!response || response.status !== 200) {
        console.error("Backend error:", response?.status);
        return;
      }

      const data = response.data;
      console.log("Backend response:", data);

      setOrders(data);

    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      setOrders(prev =>
        prev.filter(o => o.orderId !== orderToDelete.orderId)
      );
    }
    setDeleteDialogOpen(false);
  };

  // Show custom confirm dialog before confirming order
  const handleConfirmOrder = (orderNumber: string) => {
    setOrderToConfirm(orderNumber);
    setConfirmOrderDialogOpen(true);
  };

  // Actually confirm the order after user confirms
  const doConfirmOrder = async () => {
    if (!orderToConfirm) return;
    try {
      const orderNumber = orderToConfirm;
      setConfirmOrderDialogOpen(false);
      setOrderToConfirm(null);
      console.log("Confirming order:", orderNumber);
      const response = await changeOrderStatus(orderNumber);
      console.log("Order status changed successfully:", response);
      const nextStatus = String(response.data.status || "updated").replaceAll("_", " ");
      toast({ title: `Order ${orderNumber} moved to ${nextStatus}.` });
      await fetchOrders();
    } catch (error) {
      console.error("Error confirming order:", error);
      const responseData = (error as { response?: { data?: unknown } }).response?.data;
      const responseMessage =
        responseData && typeof responseData === "object" && "message" in responseData
          ? responseData.message
          : responseData;
      toast({
        title: typeof responseMessage === "string"
          ? responseMessage
          : `Failed to confirm order ${orderToConfirm}`,
        variant: "destructive",
      });
    }
  };

  const handleRejectOrder = (orderNumber: string) => {
    setOrderToReject(orderNumber);
    setRejectOrderDialogOpen(true);
  };

  const doRejectOrder = async () => {
    if (!orderToReject) return;
    try {
      await rejectOrder(orderToReject);
      toast({ title: `Order ${orderToReject} rejected.` });
      setRejectOrderDialogOpen(false);
      setOrderToReject(null);
      await fetchOrders();
    } catch (error) {
      console.error("Error rejecting order:", error);
      toast({ title: `Failed to reject order ${orderToReject}`, variant: "destructive" });
    }
  };

  // Start cancel flow: ask confirmation first
  const handleCancelOrder = async (orderNumber: string) => {
    setCancelTargetOrder(orderNumber);
    setCancelReason("");
    setCancelConfirmOpen(true);
  };

  // Called after user confirms they want to cancel (opens reason dialog)
  const proceedToCancelReason = () => {
    setCancelConfirmOpen(false);
    setCancelReasonOpen(true);
  };

  const submitCancelWithReason = async () => {
    if (!cancelTargetOrder) return;
    try {
      console.log("Cancelling order:");
      const orderNumber = cancelTargetOrder;
      const reason = cancelReason.trim();
      if (!reason) {
        toast({ title: "Please provide a reason for cancellation.", variant: 'destructive' });
        return;
      }
      const response = await cancelOrder(orderNumber, reason);
      console.log("Order cancelled successfully:", response);
      toast({ title: `Order ${orderNumber} cancelled successfully!` });
      setCancelReasonOpen(false);
      setCancelTargetOrder(null);
      // Refresh orders after successful cancellation
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({ title: `Failed to cancel order ${cancelTargetOrder}`, variant: 'destructive' });
    }
  };


if (currentPage === "add") {
  return (
    <OrderForm
      order={{} as Order}
      isAddPage={true}
      onCancel={() => setCurrentPage("list")}
      onSuccess={() => {
        setCurrentPage("list");
        fetchOrders();
      }}
    />
  );
}

// 🔹 LINE 12
{/* <ERROR></ERROR> */}
if (currentPage === "view" && selectedOrder) {
  return (
    <OrderViewPage
      order={selectedOrder}
      onBack={() => setCurrentPage("list")}
      onEdit={() => {}}
    />
  );
}

// 🔹 LINE 22
return (
  <div className="space-y-4">

    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="flex gap-3">

        <Input
          placeholder="Search by order number .."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-64"
        />

        <Button onClick={fetchOrders}>
          Refresh
        </Button>

        <Button onClick={() => setCurrentPage("add")}>
          Add Order
        </Button>

      </div>
    </div>

    <OrderTable
      orders={pagedData}
      onView={(o) => {
        setSelectedOrder(o);
        setCurrentPage("view");
      }}
      onEdit={() => {}}
      onDelete={() => {}}
      onApprove={() => {}}
      onCancel={handleCancelOrder}
      onReject={handleRejectOrder}
      onConfirm={handleConfirmOrder}
    />

    {/* Custom confirm dialog for confirming order */}
    <Dialog open={confirmOrderDialogOpen} onOpenChange={setConfirmOrderDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Order</DialogTitle>
          <DialogDescription>
            Are you sure you want to confirm order <strong>{orderToConfirm}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setConfirmOrderDialogOpen(false)}>Cancel</Button>
          <Button onClick={doConfirmOrder}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AlertDialog open={rejectOrderDialogOpen} onOpenChange={setRejectOrderDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject order</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to reject order <strong>{orderToReject}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setRejectOrderDialogOpen(false)}>Keep order</AlertDialogCancel>
          <AlertDialogAction onClick={doRejectOrder}>Reject order</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Confirmation dialog: Are you sure you want to cancel? */}
    <AlertDialog open={cancelConfirmOpen} onOpenChange={setCancelConfirmOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm cancellation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel order <strong>{cancelTargetOrder}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setCancelConfirmOpen(false)}>No</AlertDialogCancel>
          <AlertDialogAction onClick={proceedToCancelReason}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Reason input dialog shown after user confirms */}
    <Dialog open={cancelReasonOpen} onOpenChange={setCancelReasonOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancellation reason</DialogTitle>
          <DialogDescription>Please provide a brief reason for cancelling this order.</DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <Input
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Enter reason for cancellation"
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setCancelReasonOpen(false)}>Cancel</Button>
          <Button onClick={submitCancelWithReason}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Pagination controls */}
    <div className="mt-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">Showing {pagedData.length} of {processedData.length} orders</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">Page {page} of {totalPages || 1}</span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

  </div>
);

}
