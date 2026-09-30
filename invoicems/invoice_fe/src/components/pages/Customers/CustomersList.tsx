"use client";

import { Plus, Search, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useCallback, useEffect } from "react";

// Import types and data
import { Customer, SortDirection, CurrentPage } from "@/impData/types";
import {
  filterCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/service/customer";

// Only allow sorting by fields that exist on Customer
type SortField = keyof Customer;

// Import components
import { CustomerTable } from "./components/customer-table";
import { DeleteDialog } from "./components/delete-dialog";
import { CustomerForm } from "./components/customer-form";
import { CustomerViewPage } from "./components/customer-view";

export default function CustomersList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Page navigation states
  const [currentPage, setCurrentPage] = useState<CurrentPage>("list");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );

  const pageSize = 5;

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await filterCustomers();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch customers.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Empty customer for add page
  const emptyCustomer: Customer = {
    id: ``,
    userId: "",
    customerCode: "",
    businessName: "",
    gstin: "",
    pan: "",
    contactPerson: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    state: "",
    creditDays: 0,
    currentOutstanding: 0,
    status: "ACTIVE",
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  };

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let filtered = customers;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.id.toLowerCase().includes(term) ||
          item.customerCode.toLowerCase().includes(term) ||
          item.businessName.toLowerCase().includes(term) ||
          item.contactPerson.toLowerCase().includes(term) ||
          item.mobile.toLowerCase().includes(term) ||
          item.email.toLowerCase().includes(term) ||
          item.status.toLowerCase().includes(term)
      );
    }
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField as keyof Customer];
        const bVal = b[sortField as keyof Customer];
        if (typeof aVal === "number" && typeof bVal === "number") {
          const result = aVal - bVal;
          return sortDirection === "asc" ? result : -result;
        } else {
          const result = String(aVal).localeCompare(String(bVal));
          return sortDirection === "asc" ? result : -result;
        }
      });
    }
    return filtered;
  }, [customers, searchTerm, sortField, sortDirection]);

  const pagedData = useMemo(
    () => processedData.slice((page - 1) * pageSize, page * pageSize),
    [processedData, page, pageSize]
  );

  const totalPages = Math.ceil(processedData.length / pageSize);

  // Callback handlers
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, []);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection((prev: any) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField]
  );

  const handleView = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setCurrentPage("view");
  }, []);

  const handleEdit = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setCurrentPage("edit");
  }, []);

  const handleDelete = useCallback((customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (customerToDelete) {
      if (!customerToDelete.id) {
        console.error("Attempted to delete customer with missing ID:", customerToDelete);
        setError("Cannot delete customer: Missing ID");
        setDeleteDialogOpen(false);
        return;
      }

      try {
        await deleteCustomer(customerToDelete.id);
        setCustomers((prev) =>
          prev.filter((c) => c.id !== customerToDelete.id)
        );
        if (pagedData.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        }
      } catch (error) {
        setError("Failed to delete customer.");
        console.error(error);
      }
    }
    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
  }, [customerToDelete, pagedData.length, page]);

  const cancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
  }, []);

  const handleSaveEdit = useCallback(async (updatedCustomer: Customer) => {
    try {
      const savedCustomer = await updateCustomer(
        updatedCustomer.id,
        updatedCustomer
      );
      setCustomers((prev) =>
        prev.map((c) => (c.id === savedCustomer.id ? savedCustomer : c))
      );
    } catch (error) {
      setError("Failed to update customer.");
      console.error(error);
    }
  }, []);

  const handleSaveAdd = useCallback(async (newCustomer: Customer) => {
    try {
      const savedCustomer = await createCustomer(newCustomer);
      // If the returned customer doesn't have an ID (e.g. API didn't return it), refetch the list
      if (!savedCustomer.id) {
        await fetchCustomers();
      } else {
        setCustomers((prev) => [savedCustomer, ...prev]);
      }
    } catch (error) {
      setError("Failed to create customer.");
      console.error(error);
    }
  }, [fetchCustomers]);

  const handleBackToList = useCallback(() => {
    setCurrentPage("list");
    setSelectedCustomer(null);
  }, []);

  const handleExport = useCallback(() => {
    const csvContent = [
      [
        "ID",
        "Customer Code",
        "Business Name",
        "GSTIN",
        "PAN",
        "Contact Person",
        "Mobile",
        "Email",
        "Address",
        "City",
        "State",
        "Credit Days",
        "Current Outstanding",
        "Status",
        "Created At",
        "Updated At",
      ],
      ...processedData.map((c) => [
        c.id,
        c.customerCode,
        c.businessName,
        c.gstin,
        c.pan,
        c.contactPerson,
        c.mobile,
        c.email,
        c.address,
        c.city,
        c.state,
        c.creditDays,
        c.currentOutstanding,
        c.status,
        c.createdAt,
        c.updatedAt,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [processedData]);

  // Render different pages based on current page state
  if (currentPage === "view" && selectedCustomer) {
    return (
      <CustomerViewPage
        customer={selectedCustomer}
        onBack={handleBackToList}
        onEdit={() => handleEdit(selectedCustomer)}
      />
    );
  }

  if (currentPage === "edit" && selectedCustomer) {
    return (
      <CustomerForm
        customer={selectedCustomer}
        onBack={handleBackToList}
        onSave={handleSaveEdit}
      />
    );
  }

  if (currentPage === "add") {
    return (
      <CustomerForm
        customer={emptyCustomer}
        onBack={handleBackToList}
        onSave={(c: any) => {
          handleSaveAdd(c);
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
          Customers
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
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
            Add Customer
          </Button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      {!loading && !error && (
        <CustomerTable
          customers={pagedData}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
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
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
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
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
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
        customer={customerToDelete}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}