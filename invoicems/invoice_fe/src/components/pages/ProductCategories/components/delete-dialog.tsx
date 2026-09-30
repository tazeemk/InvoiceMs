import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Category } from '@/impData/types';

interface DeleteDialogProps {
  isOpen: boolean;
  category: Category | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  category,
  onConfirm,
  onCancel
}) => {
  if (!category) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Category
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Are you sure you want to delete <strong>"{category.name}"</strong>?</p>
            <p className="text-sm text-gray-600">
              This action cannot be undone. This will permanently delete the category 
              and affect {category.productCount} products.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button className='bg-red-900 hover:bg-red-700' onClick={onConfirm}>
              Delete Category
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};