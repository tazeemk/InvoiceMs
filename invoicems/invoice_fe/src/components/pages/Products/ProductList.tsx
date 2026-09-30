"use client";

import { Plus, Search, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useCallback, useEffect } from "react";

// Import types and data
import { Product, SortDirection, CurrentPage } from "@/impData/types";

// Only allow sorting by fields that exist on Product
type SortField = keyof Product;
import { getAllProducts, getProductCategories, ProductResponse, CategoryResponse } from "@/service/product";
import { useToast } from "@/components/ui/use-toast";

// Import components
import { ProductTable } from "./components/product-table";
import { DeleteDialog } from "./components/delete-dialog";
import { ProductForm } from "./components/product-form";
import { productViewPage as ProductViewPage } from "./components/product-view";
// import { DeleteDialog } from "./delete-dialog";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Page navigation states
  const [currentPage, setCurrentPage] = useState<CurrentPage>("list");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const pageSize = 5;

  // Empty product for add page
  const emptyProduct: Product = {
    id: "",
    productName: "",
    productCode: "",
    categoryId: "",
    description: "",
    unitPrice: 0,
    stockUnit: "",
    taxRate: 0,
    status: "ACTIVE",
    createdBy: "",
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };

  const mapProduct = (item: ProductResponse): Product => ({
    id: item.productId,
    productName: item.productName,
    productCode: item.productCode,
    categoryId: item.categoryId,
    description: item.description || "",
    unitPrice: Number(item.unitPrice || 0),
    stockUnit: item.stockUnit || "",
    taxRate: Number(item.taxRate || 0),
    status: item.status || "ACTIVE",
    createdBy: item.createdBy || "",
    createdAt: item.createdDate || "",
    updatedAt: item.lastModifiedDate || item.createdDate || "",
    productCount: item.quantity ?? 0,
  });

  const fetchCatalog = useCallback(async () => {
    try {
      const [productData, categoryData] = await Promise.all([
        getAllProducts(),
        getProductCategories(),
      ]);
      setProducts(productData.map(mapProduct));
      setCategories(categoryData);
    } catch (error) {
      const detail = (error as { response?: { data?: unknown }; message?: string }).response?.data;
      toast({
        title: "Unable to load product catalog",
        description: typeof detail === "string" ? detail : "Please check the backend connection and try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    void fetchCatalog();
  }, [fetchCatalog]);

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let filtered = products;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        item.id.toLowerCase().includes(term) ||
        item.productName.toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term)
      );
        
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField as keyof Product];
        const bVal = b[sortField as keyof Product];
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
  }, [products, searchTerm, sortField, sortDirection]);

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

  const handleView = useCallback((product: Product) => {
    setSelectedProduct(product);
    setCurrentPage("view");
  }, []);

  const handleEdit = useCallback((product: Product) => {
    setSelectedProduct(product);
    setCurrentPage("edit");
  }, []);

  const handleDelete = useCallback((product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (productToDelete) {
      setProducts(prev => prev.filter(prod => prod.id !== productToDelete.id));
      if (pagedData.length === 1 && page > 1) {
        setPage(prev => prev - 1);
      }
    }
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  }, [productToDelete, pagedData.length, page]);

  const cancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  }, []);

  const handleSaveEdit = useCallback((updatedProduct: Product) => {
    setProducts(prev => 
      prev.map(prod => prod.id === updatedProduct.id ? updatedProduct : prod)
    );
  }, []);

  const handleSaveAdd = useCallback((newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    void fetchCatalog();
  }, [fetchCatalog]);

  const handleBackToList = useCallback(() => {
    setCurrentPage("list");
    setSelectedProduct(null);
  }, []);

  const handleExport = useCallback(() => {
    const csvContent = [
      ["ID", "Name", "Code", "Category ID", "Description", "Unit Price", "Stock Unit", "Tax Rate", "Status", "Created By"],
      ...processedData.map(prod => [
        prod.id,
        prod.productName,
        prod.productCode,
        prod.categoryId,
        prod.description,
        prod.unitPrice.toString(),
        prod.stockUnit,
        prod.taxRate.toString(),
        prod.status,
        prod.createdBy
      ])
    ].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [processedData]);

  // Render different pages based on current page state
  if (currentPage === "view" && selectedProduct) {
    return (
      <ProductViewPage 
        product={selectedProduct} 
        categories={categories}
        onBack={handleBackToList}
        onEdit={() => handleEdit(selectedProduct)}
      />
    );
  }

  if (currentPage === "edit" && selectedProduct) {
    return (
      <ProductForm 
        product={selectedProduct} 
        categories={categories}
        onBack={handleBackToList}
        onSave={handleSaveEdit}
      />
    );
  }

  if (currentPage === "add") {
    return (
      <ProductForm
        product={emptyProduct}
        categories={categories}
        onBack={handleBackToList}
        onSave={(prod) => {
          handleSaveAdd(prod);
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
          Products
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Input
              placeholder="Search products..."
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
            Add Product
          </Button>
        </div>
      </div>

      {/* Table */}
      <ProductTable
        products={pagedData}
        categories={categories}
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
        product={productToDelete}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
     
    </div>
  );
}