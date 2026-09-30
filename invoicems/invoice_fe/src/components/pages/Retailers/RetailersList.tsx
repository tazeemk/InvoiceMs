"use client";

import { Plus, Search, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useCallback } from "react";

// Import types and data
import { Retailer, SortDirection, CurrentPage } from "@/impData/types";

// Only allow sorting by fields that exist on Retailer
type SortField = keyof Retailer;
import { dummyRetailers } from "@/impData/data";

// Import components
import { RetailerTable } from "./components/retailer-table";
import { DeleteDialog } from "./components/delete-dialog";
import { RetailerForm } from "./components/retailer-form";
import { RetailerViewPage } from "./components/retailer-view";
// import { DeleteDialog } from "./delete-dialog";

export default function RetailersList() {
  const [retailers, setRetailers] = useState<Retailer[]>(dummyRetailers);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Page navigation states
  const [currentPage, setCurrentPage] = useState<CurrentPage>("list");
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [retailerToDelete, setRetailerToDelete] = useState<Retailer | null>(null);

  const pageSize = 5;

  // Empty retailer for add page
  const emptyRetailer: Retailer = {
    id: `RET-${Date.now()}`,
    userId: "",
    shopName: "",
    ownerName: "",
    phone: "",
    shopAddressId: "",
    billingAddressId: "",
    deliveryAddressId: "",
    gstNumber: "",
    creditLimit: 0,
    status: "ACTIVE",
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let filtered = retailers;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        item.id.toLowerCase().includes(term) ||
        item.shopName.toLowerCase().includes(term) ||
        item.ownerName.toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term)
      );
    }
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField as keyof Retailer];
        const bVal = b[sortField as keyof Retailer];
        if (typeof aVal === "string") {
          const result = (aVal as string).localeCompare(bVal as string);
          return sortDirection === "asc" ? result : -result;
        } else {
          const result = (aVal as number) - (bVal as number);
          return sortDirection === "asc" ? result : -result;
        }
      });
    }
    return filtered;
  }, [retailers, searchTerm, sortField, sortDirection]);

  const pagedData = useMemo(() => 
    processedData.slice((page - 1) * pageSize, page * pageSize),
    [processedData, page, pageSize]
  );

  const totalPages = Math.ceil(processedData.length / pageSize);

  // Callback handlers
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, []);


  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev: any) => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }, [sortField]);

  const handleView = useCallback((retailer: Retailer) => {
    setSelectedRetailer(retailer);
    setCurrentPage("view");
  }, []);

  const handleEdit = useCallback((retailer: Retailer) => {
    setSelectedRetailer(retailer);
    setCurrentPage("edit");
  }, []);

  const handleDelete = useCallback((retailer: Retailer) => {
    setRetailerToDelete(retailer);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (retailerToDelete) {
      setRetailers(prev => prev.filter(ret => ret.id !== retailerToDelete.id));
      if (pagedData.length === 1 && page > 1) {
        setPage(prev => prev - 1);
      }
    }
    setDeleteDialogOpen(false);
    setRetailerToDelete(null);
  }, [retailerToDelete, pagedData.length, page]);

  const cancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setRetailerToDelete(null);
  }, []);

  const handleSaveEdit = useCallback((updatedRetailer: Retailer) => {
    setRetailers(prev => 
      prev.map(ret => ret.id === updatedRetailer.id ? updatedRetailer : ret)
    );
  }, []);

  const handleSaveAdd = useCallback((newRetailer: Retailer) => {
    setRetailers(prev => [newRetailer, ...prev]);
  }, []);

  const handleBackToList = useCallback(() => {
    setCurrentPage("list");
    setSelectedRetailer(null);
  }, []);

  const handleExport = useCallback(() => {
    const csvContent = [
      ["ID", "Shop Name", "Owner Name", "Phone", "Credit Limit", "Status", "GST Number", "Created At", "Updated At"],
      ...processedData.map(ret => [
        ret.id,
        ret.shopName,
        ret.ownerName,
        ret.phone,
        ret.creditLimit.toString(),
        ret.status,
        ret.gstNumber,
        ret.createdAt,
        ret.updatedAt
      ])
    ].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "retailers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [processedData]);


  // Render different pages based on current page state
  if (currentPage === "view" && selectedRetailer) {
    return (
      <RetailerViewPage 
        retailer={selectedRetailer} 
        onBack={handleBackToList}
        onEdit={() => handleEdit(selectedRetailer)}
      />
    );
  }

  if (currentPage === "edit" && selectedRetailer) {
    return (
      <RetailerForm 
        retailer={selectedRetailer} 
        onBack={handleBackToList}
        onSave={handleSaveEdit}
      />
    );
  }

  if (currentPage === "add") {
    return (
      <RetailerForm
        retailer={emptyRetailer}
        onBack={handleBackToList}
        onSave={(ret: any) => {
          handleSaveAdd(ret);
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
          Retailers
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Input
              placeholder="Search retailers..."
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
            Add Retailer
          </Button>
        </div>
      </div>

      {/* Table */}
      <RetailerTable
        retailers={pagedData}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
        retailer={retailerToDelete}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}