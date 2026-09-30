import React from 'react';
import { Eye, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Category, SortField, SortDirection } from '@/impData/types';

interface CategoryTableProps {
  categories: Category[];
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onView: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const StatusBadge: React.FC<{ status: Category["status"] }> = ({ status }) => (
  <span
    className={`px-2 py-1 rounded text-xs font-medium ${
      status === "Active"
        ? "bg-green-100 text-green-800"
        : "bg-gray-200 text-gray-800"
    }`}
  >
    {status}
  </span>
);

const ActionButtons: React.FC<{ 
  category: Category;
  onView: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}> = ({ category, onView, onEdit, onDelete }) => (
  <div className="flex items-center space-x-1">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onView(category)}
      className="h-8 w-8 p-0 hover:bg-green-100"
      aria-label={`View ${category.name}`}
    >
      <Eye className="h-4 w-4 text-green-600" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onEdit(category)}
      className="h-8 w-8 p-0 hover:bg-blue-100"
      aria-label={`Edit ${category.name}`}
    >
      <Edit className="h-4 w-4 text-blue-600" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onDelete(category)}
      className="h-8 w-8 p-0 hover:bg-red-100"
      aria-label={`Delete ${category.name}`}
    >
      <Trash2 className="h-4 w-4 text-red-600" />
    </Button>
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

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  sortField,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <div className="border border-green-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader
              label="Category ID"
              field="id"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              label="Category Name"
              field="name"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              label="Product Count"
              field="productCount"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              label="Status"
              field="status"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            />
              <SortableHeader
              label="createdBy"
              field="createdBy"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.productCount}</TableCell>
                <TableCell>
                  <StatusBadge status={category.status} />
                </TableCell>
                <TableCell>{category.createdBy}</TableCell>
                <TableCell>
                  <ActionButtons
                    category={category}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                No categories found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};