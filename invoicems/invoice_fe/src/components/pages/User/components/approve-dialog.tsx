import React from 'react';
import { CheckCircle2 } from 'lucide-react';
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
import { User } from '@/impData/types';

interface ApproveDialogProps {
  isOpen: boolean;
  user: User | null;
  onConfirm: () => void;
  onCancel: () => void;
  isReject?: boolean;
  error?: string;
}

export const ApproveDialog: React.FC<ApproveDialogProps> = ({
  isOpen,
  user,
  onConfirm,
  onCancel,
  isReject = false,
  error
}) => {
  if (!user) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={`flex items-center gap-2 ${isReject ? 'text-rose-600' : 'text-[#007b55]'}`}>
            {isReject ? (
              <span className="h-5 w-5 text-rose-600">&#10006;</span>
            ) : (
              <CheckCircle2 className="h-5 w-5" />
            )}
            {isReject ? 'Deactivate User' : 'Approve User'}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Are you sure you want to {isReject ? 'deactivate' : 'approve'} <strong>User "{user.username}"</strong>?</p>
            <p className="text-xs text-gray-500">
              This action will mark the user as <span className={isReject ? 'text-rose-600 font-semibold' : 'text-[#007bff] font-semibold'}>{isReject ? 'INACTIVE' : 'ACTIVE'}</span>.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <div className="text-red-600 text-sm font-semibold mt-2 text-center">
            {error}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button className={isReject ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-[#007bff] hover:bg-blue-700 text-white'} onClick={onConfirm}>
              {isReject ? 'Confirm Deactivate' : 'Confirm Approve'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
