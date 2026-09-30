import React from 'react';
import { Eye, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

import { Product, SortField, SortDirection } from '@/impData/types';
import { CategoryResponse } from '@/service/product';

interface ProductTableProps {
  products: Product[];
  categories: CategoryResponse[];
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

const StatusBadge: React.FC<{ status: Product["status"] }> = ({ status }) => (
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
  product: Product;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}> = ({ product, onView, onEdit, onDelete }) => (
  <div className="flex items-center space-x-1">
    {onView && (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onView(product)}
        className="h-8 w-8 p-0 hover:bg-green-100"
        aria-label={`View ${product.productName}`}
      >
        <Eye className="h-4 w-4 text-green-600" />
      </Button>
    )}
    {onEdit && (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(product)}
        className="h-8 w-8 p-0 hover:bg-blue-100"
        aria-label={`Edit ${product.productName}`}
      >
        <Edit className="h-4 w-4 text-blue-600" />
      </Button>
    )}
    {onDelete && (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(product)}
        className="h-8 w-8 p-0 hover:bg-red-100"
        aria-label={`Delete ${product.productName}`}
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    )}
  </div>
);

const SortableHeader: React.FC<{
  label: string;
  field: SortField;
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}> = ({ label, field, sortField, sortDirection, onSort }) => (
  <TableHead>
    <button
      onClick={() => onSort(field)}
      className="flex items-center space-x-1 transition-colors"
    >
      <span>{label}</span>
      {sortField === field && (
        sortDirection === "asc" 
          ? <ChevronUp className="h-4 w-4" />
          : <ChevronDown className="h-4 w-4" />
      )}
    </button>
  </TableHead>
);

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  categories,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <div className="border border-green-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Stock Unit</TableHead>
            <TableHead>Tax Rate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created By</TableHead>
            {(onView || onEdit || onDelete) && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length > 0 ? (
            products.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell>{prod.id}</TableCell>
                <TableCell>{prod.productName}</TableCell>
                <TableCell>{prod.productCode}</TableCell>
                <TableCell>{categories.find(c => c.categoryId === prod.categoryId)?.categoryName || prod.categoryId}</TableCell>
                <TableCell>{prod.description}</TableCell>
                <TableCell>₹{prod.unitPrice.toFixed(2)}</TableCell>
                <TableCell>{prod.stockUnit}</TableCell>
                <TableCell>{prod.taxRate}%</TableCell>
                <TableCell>
                  <StatusBadge status={prod.status} />
                </TableCell>
                <TableCell>{prod.createdBy}</TableCell>
                {(onView || onEdit || onDelete) && (
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(prod)}
                          className="h-8 w-8 p-0 hover:bg-green-100"
                          aria-label={`View ${prod.productName}`}
                        >
                          <Eye className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(prod)}
                          className="h-8 w-8 p-0 hover:bg-blue-100"
                          aria-label={`Edit ${prod.productName}`}
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(prod)}
                          className="h-8 w-8 p-0 hover:bg-red-100"
                          aria-label={`Delete ${prod.productName}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={11} className="text-center text-gray-500 py-8">
                No products found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};