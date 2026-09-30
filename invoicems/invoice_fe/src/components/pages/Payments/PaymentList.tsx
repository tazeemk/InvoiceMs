"use client";

import { Search, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useCallback, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";

import { Invoice, CurrentPage } from "@/impData/types";
import { PaymentTable } from "./components/payment-table";
import { InvoiceViewPage } from "./components/invoice-view";
import { Spinner } from "@/components/ui/spinner";
import { useInvoices } from "@/hooks/useInvoices";
import {
  fetchInvoices as apiFetchInvoices,
} from "@/service/payment";

// Payment-specific statuses that map to URL segments
const PAYMENT_STATUS_MAP: Record<string, Invoice["status"]> = {
  "/payments/pending":   "PENDING",    // User Assigned (any unrecognised API status)
  "/payments/collected": "COLLECTED",  // User Assigned + API COLLECTED
  "/payments/submitted": "SUBMITTED",  // User Assigned + API SUBMITTED
  "/payments/verified":  "VERIFIED",   // User Assigned + API VERIFIED
  "/payments/completed": "COMPLETED",  // Fully Paid (balance = 0)
  "/payments/disputed":  "DISPUTED",   // User Assigned + API ON_HOLD
  "/payments/refunded":  "REFUNDED",   // User Assigned + API CANCELLED
};

export default function PaymentList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  const pageSize = 5;
  const [sortField, setSortField] = useState<keyof Invoice | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter invoices by the current payment route
  const filteredInvoices = useMemo(() => {
    if (!pathname) return invoices;
    for (const [segment, status] of Object.entries(PAYMENT_STATUS_MAP)) {
      if (pathname.includes(segment)) {
        return invoices.filter((inv) => inv.status === status);
      }
    }
    return invoices; // /payments/all — show everything
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

  const [currentPage, setCurrentPage] = useState<CurrentPage>("list");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Derive a friendly page title from the URL
  const pageTitle = useMemo(() => {
    if (!pathname) return "Payments";
    const segment = pathname.split("/").pop() ?? "";
    return `Payments — ${segment.charAt(0).toUpperCase() + segment.slice(1)}`;
  }, [pathname]);

  // Fetch on mount
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiFetchInvoices();
        setInvoices(data);
      } catch (err) {
        setError("Failed to fetch payments. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Update a single invoice in the list
  const handleInvoiceUpdate = useCallback((updatedInvoice: Invoice) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(inv => (inv.id === updatedInvoice.id ? updatedInvoice : inv))
    );
  }, []);

  // View
  const handleView = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentPage("view");
  }, []);

  const handleBackToList = useCallback(() => {
    setCurrentPage("list");
    setSelectedInvoice(null);
  }, []);

  // Export CSV
  const handleExport = useCallback(() => {
    const rows = [
      ["Invoice #", "Customer", "Status", "Assigned User", "Invoice Date", "Due Date", "Total", "Paid", "Outstanding"],
      ...processedData.map((inv) => [
        inv.invoiceNumber,
        inv.customerName,
        inv.status,
        inv.assignUser ?? "",
        inv.invoiceDate,
        inv.dueDate,
        inv.totalAmount,
        inv.paidAmount,
        inv.outstandingAmount,
      ]),
    ]
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [processedData]);

  // ── Sub-pages ───────────────────────────────────────────────
  if (currentPage === "view" && selectedInvoice) {
    return (
      <InvoiceViewPage
        invoice={selectedInvoice}
        onBack={handleBackToList}
        onEdit={handleBackToList}
      />
    );
  }

  // ── List view ───────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-900">
          {pageTitle}
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Input
              placeholder="Search payments..."
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
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <PaymentTable
          invoices={pagedData}
          onView={handleView}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
          onStatusChange={(invoiceId, newStatus, updatedInvoice) => handleInvoiceUpdate(updatedInvoice)}
        />
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing {Math.min((page - 1) * pageSize + 1, processedData.length)} to{" "}
          {Math.min(page * pageSize, processedData.length)} of{" "}
          {processedData.length} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
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
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="border-green-200 hover:bg-green-50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}