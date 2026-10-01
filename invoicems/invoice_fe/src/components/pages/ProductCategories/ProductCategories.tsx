"use client";

import { Plus, Search, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useCallback, useEffect } from "react";

// Import types and data
import { Category, SortField, SortDirection, CurrentPage } from "@/impData/types";
import { getProductCategories } from "@/service/product";

// Import components
import { CategoryTable } from "./components/category-table";
import { CategoryViewPage } from "./components/category-view";
import { CategoryForm } from "./components/category-form";
import { DeleteDialog } from "./components/delete-dialog";

export default function ProductCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Page navigation states
  const [currentPage, setCurrentPage] = useState<CurrentPage>("list");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const pageSize = 5;

  // Fetch categories from backend API and map response to local `Category` type
  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        const data = await getProductCategories();
        const mapped: Category[] = data.map((category) => ({
          id: category.categoryId,
          name: category.categoryName,
          description: category.description ?? "",
          status: category.status === "ACTIVE" ? "Active" : "Inactive",
          productCount: 0,
          createdBy: category.createdBy ?? "",
          createdAt: category.createdDate ?? undefined,
          updatedAt: category.lastModifiedDate ?? undefined,
        }));

        if (mounted) setCategories(mapped);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };

    fetchCategories();
    return () => { mounted = false; };
  }, []);

  // Empty category for add page
  const emptyCategory: Category = {
    id: `CAT-${Date.now()}`,
    name: "",
    status: "Active",
    productCount: 0,
    description: "USR1",
    createdBy:"U",
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let filtered = categories;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        item.id.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term)
      );
    }

    // Sort data
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
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
  }, [categories, searchTerm, sortField, sortDirection]);

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
      setSortDirection((prev:any) => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }, [sortField]);

  const handleView = useCallback((category: Category) => {
    setSelectedCategory(category);
    setCurrentPage("view");
  }, []);

  const handleEdit = useCallback((category: Category) => {
    setSelectedCategory(category);
    setCurrentPage("edit");
  }, []);

  const handleDelete = useCallback((category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (categoryToDelete) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete.id));
      // Reset to page 1 if current page becomes empty
      if (pagedData.length === 1 && page > 1) {
        setPage(prev => prev - 1);
      }
    }
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  }, [categoryToDelete, pagedData.length, page]);

  const cancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  }, []);

  const handleSaveEdit = useCallback((updatedCategory: Category) => {
    setCategories(prev => 
      prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat)
    );
  }, []);

  const handleSaveAdd = useCallback((newCategory: Category) => {
    setCategories(prev => [newCategory, ...prev]);
  }, []);

  const handleBackToList = useCallback(() => {
    setCurrentPage("list");
    setSelectedCategory(null);
  }, []);

  const handleExport = useCallback(() => {
    const csvContent = [
      ["ID", "Name", "Status", "Product Count"],
      ...processedData.map(cat => [cat.id, cat.name, cat.status, cat.productCount.toString()])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "categories.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [processedData]);

  // Render different pages based on current page state
  if (currentPage === "view" && selectedCategory) {
    return (
      <CategoryViewPage 
        category={selectedCategory} 
        onBack={handleBackToList}
        onEdit={() => handleEdit(selectedCategory)}
      />
    );
  }

  if (currentPage === "edit" && selectedCategory) {
    return (
      <CategoryForm 
        category={selectedCategory} 
        onBack={handleBackToList}
        onSave={handleSaveEdit}
      />
    );
  }

  if (currentPage === "add") {
    return (
      <CategoryForm
        category={emptyCategory}
        onBack={handleBackToList}
        onSave={(cat:any) => {
          handleSaveAdd(cat);
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
          Product Categories
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Input
              placeholder="Search categories..."
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
            Add 
          </Button>
        </div>
      </div>

      {/* Table */}
      <CategoryTable
        categories={pagedData}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
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
        category={categoryToDelete}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}