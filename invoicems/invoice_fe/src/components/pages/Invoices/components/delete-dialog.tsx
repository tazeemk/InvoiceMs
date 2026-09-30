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
import { Invoice } from '@/impData/types';

interface DeleteDialogProps {
  isOpen: boolean;
  invoice: Invoice | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  invoice,
  onConfirm,
  onCancel
}) => {
  if (!invoice) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete invoice
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Are you sure you want to delete <strong>"Invoice #{invoice.invoiceNumber}"</strong>?</p>
            <p className="text-xs text-gray-500">This action cannot be undone.</p>
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
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};