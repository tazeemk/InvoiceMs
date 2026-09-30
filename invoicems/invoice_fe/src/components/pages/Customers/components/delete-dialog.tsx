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
import { Customer } from '@/impData/types';

interface DeleteDialogProps {
  isOpen: boolean;
  customer: Customer | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  customer,
  onConfirm,
  onCancel
}) => {
  if (!customer) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Customer
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Are you sure you want to delete <strong>"{customer.businessName}"</strong>?</p>
            <p className="text-sm text-gray-600">
              Customer Code: {customer.customerCode}
            </p>
            <p className="text-sm text-gray-600">
              This action cannot be undone. This will permanently delete the customer record and all associated data.
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
              Delete Customer
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};