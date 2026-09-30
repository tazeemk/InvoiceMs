"use client";

import { Plus, Search, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useCallback, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";

// Import types and data
import { Invoice, CurrentPage } from "@/impData/types";

// Import components
import { InvoiceTable } from "./components/invoice-table";
import { DeleteDialog } from "./components/delete-dialog";
import { InvoiceForm } from "./components/invoice-form";
import { InvoiceViewPage } from "./components/invoice-view";
import { Spinner } from "@/components/ui/spinner";
import { useInvoices } from "@/hooks/useInvoices";
import { fetchInvoices as apiFetchInvoices, createInvoice, updateInvoice, deleteInvoice } from "@/service/invoice";

export default function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  const pageSize = 5;
  const [sortField, setSortField] = useState<keyof Invoice | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const filteredInvoices = useMemo(() => {
    if (!pathname) return invoices;

    if (pathname.includes('/invoices/paid')) {
      return invoices.filter(inv => inv.status === 'PAID');
    }
    if (pathname.includes('/invoices/pending')) {
      return invoices.filter(inv => inv.status === 'PENDING');
    }
    if (pathname.includes('/invoices/partialpaid')) {
      return invoices.filter(inv => inv.status === 'PARTIAL_PAID');
    }
    if (pathname.includes('/invoices/overdue')) {
      return invoices.filter(inv => inv.status === 'OVERDUE');
    }
    if (pathname.includes('/invoices/inprogress')) {
      return invoices.filter(inv => inv.status === 'IN_PROGRESS');
    }
    if (pathname.includes('/invoices/onhold')) {
      return invoices.filter(inv => inv.status === 'ON_HOLD');
    }
    if (pathname.includes('/invoices/cancelled')) {
      return invoices.filter(inv => inv.status === 'CANCELLED');
    }
    return invoices; // For /invoices/all
  }, [invoices, pathname]);

  const {
    pagedData,
    processedData,
    page,
    setPage,
    totalPages,
    handleSearch,
    handleSort,
  } = useInvoices({ initialInvoices: filteredInvoices, pageSize });
  // Page navigation states
  const [currentPage, setCurrentPage] = useState<CurrentPage>("list");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch real data from the API
        const data = await apiFetchInvoices();
        setInvoices(data);
      } catch (err) {
        setError("Failed to fetch invoices. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Handler for next-status actions
  const handleStatusChange = useCallback(async (invoice: Invoice, nextStatus: Invoice["status"]) => {
    setInvoices(prev => prev.map(inv =>
      inv.id === invoice.id ? { ...inv, status: nextStatus } : inv
    ));
    // TODO: Add API call to persist status change
  }, []);

  // Handler: update invoice in list after user is assigned
  const handleAssigned = useCallback((updatedInvoice: Invoice) => {
    setInvoices(prev =>
      prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv)
    );
  }, []);

  // Empty order for add page
  const emptyInvoice: Invoice = {
    id: `INV-${Date.now()}`,
    invoiceNumber: "",
    orderId: "",
    customerName: "",
    salespersonId: "",
    vendorId: "",
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    billingCycle: "WEEKLY",
    subtotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
    paidAmount: 0,
    outstandingAmount: 0,
    status: "PENDING",
    notes: "",
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    items: [],
  };


  const handleView = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentPage("view");
  }, []);

  const handleEdit = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentPage("edit");
  }, []);

  const handleDelete = useCallback((invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (invoiceToDelete) {
      const originalInvoices = invoices;
      // Optimistic update
      setInvoices(prev => prev.filter(inv => inv.id !== invoiceToDelete.id));
      setDeleteDialogOpen(false);

      try {
        await deleteInvoice(invoiceToDelete.id);
        if (pagedData.length === 1 && page > 1) {
          setPage(prev => prev - 1);
        }
      } catch (err) {
        console.error("Failed to delete invoice:", err);
        setError(`Failed to delete invoice #${invoiceToDelete.invoiceNumber}.`);
        // Revert on failure
        setInvoices(originalInvoices);
      }
    }
    setInvoiceToDelete(null);
  }, [invoiceToDelete, invoices, pagedData.length, page, setPage]);
  
  const cancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setInvoiceToDelete(null);
  }, []);

  const handleBackToList = useCallback(() => {
    setCurrentPage("list");
    setSelectedInvoice(null);
  }, []);

  const handleSaveEdit = useCallback(async (updatedInvoice: Invoice) => {
    const originalInvoices = invoices;
    // Optimistic update
    setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
    handleBackToList();

    try {
      await updateInvoice(updatedInvoice);
    } catch (err) {
      console.error("Failed to update invoice:", err);
      setError(`Failed to save invoice #${updatedInvoice.invoiceNumber}.`);
      // Revert on failure
      setInvoices(originalInvoices);
    }
  }, [invoices, handleBackToList]);

  const handleSaveAdd = useCallback(async (invoiceToAdd: Omit<Invoice, 'id'>) => {
    // The form gives us an invoice without an ID.
    // The API should create it and return the full invoice with an ID.
    const originalInvoices = invoices;
    // We can't do a perfect optimistic update without knowing the final ID,
    // but we can show a loading state or add a temporary item.
    // For simplicity, we'll add it after the API call succeeds.
    try {
      const newInvoice = await createInvoice(invoiceToAdd);
      setInvoices(prev => [newInvoice, ...prev]);
    } catch (err) {
      console.error("Failed to add invoice:", err);
      setError("Failed to add new invoice.");
      // Revert if needed (though we are not doing optimistic update here)
      setInvoices(originalInvoices);
    }
  }, [invoices]);

  const handleExport = useCallback(() => {
    const csvContent = [
      [
        "ID", "Invoice Number", "Order ID", "Customer Name", "Salesperson ID", "Vendor ID", "Invoice Date", "Due Date", "Billing Cycle", "Subtotal", "Tax Amount", "Discount Amount", "Total Amount", "Paid Amount", "Outstanding Amount", "Status", "Notes", "Created At", "Updated At"
      ],
      ...processedData.map(inv => [
        inv.id,
        inv.invoiceNumber,
        inv.orderId,
        inv.customerName,
        inv.salespersonId,
        inv.vendorId,
        inv.invoiceDate,
        inv.dueDate,
        inv.billingCycle,
        inv.subtotal,
        inv.taxAmount,
        inv.discountAmount,
        inv.totalAmount,
        inv.paidAmount,
        inv.outstandingAmount,
        inv.status,
        inv.notes,
        inv.createdAt,
        inv.updatedAt
      ])
    ].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoices.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [processedData]);

  // When payment is recorded, update invoice and, if fully paid, update related order to COMPLETED
  const handlePayment = useCallback((invoice: Invoice) => {
    // Simulate payment logic: mark as paid if outstandingAmount > 0
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoice.id) {
        const newPaid = inv.paidAmount + inv.outstandingAmount;
        return {
          ...inv,
          paidAmount: newPaid,
          outstandingAmount: 0,
          status: 'PAID',
        };
      }
      return inv;
    }));
    // Also update related order status to COMPLETED (simulate, if you have setOrders or similar)
    // If you want to update dummyOrders, you would need to lift state up or use a global store
    alert(`Payment recorded for Invoice #${invoice.invoiceNumber}. If linked order exists, it should be marked as COMPLETED.`);
  }, []);
  
  // Render different pages based on current page state
  if (currentPage === "view" && selectedInvoice) {
    return (
      <InvoiceViewPage 
        invoice={selectedInvoice} 
        onBack={handleBackToList}
        onEdit={() => handleEdit(selectedInvoice)}
      />
    );
  }

  if (currentPage === "edit" && selectedInvoice) {
    return (
      <InvoiceForm 
        invoice={selectedInvoice} 
        onBack={handleBackToList}
        onSave={handleSaveEdit}
      />
    );
  }

  if (currentPage === "add") {
    return (
      <InvoiceForm
        invoice={emptyInvoice}
        onBack={handleBackToList}
        onSave={async (inv: Invoice) => {
          await handleSaveAdd(inv);
          handleBackToList();
        }}
        isAddPage={true}
      />
    );
  }

  // Default list view
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-900">
          Invoices
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Input
              placeholder="Search products..."
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-2 py-2 w-64 border-green-200 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={handleExport}
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            <File className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700" 
            onClick={() => setCurrentPage("add")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Invoice
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <InvoiceTable
          invoices={pagedData}
          onView={handleView}
          onSort={handleSort}
          onAssign={handleAssigned}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing {Math.min((page - 1) * pageSize + 1, processedData.length)} to{" "}
          {Math.min(page * pageSize, processedData.length)} of {processedData.length} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="border-green-200 hover:bg-green-50"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 px-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="border-green-200 hover:bg-green-50"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      
      <DeleteDialog
        isOpen={deleteDialogOpen}
        invoice={invoiceToDelete}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
     
    </div>
)}