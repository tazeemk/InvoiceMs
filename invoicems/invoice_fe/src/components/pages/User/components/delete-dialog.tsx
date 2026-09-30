import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from "@/impData/types";

interface DeleteDialogProps {
  isOpen: boolean;
  user: User | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  user,
  onConfirm,
  onCancel,
}) => {
  if (!user) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete User
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong>"{user.username}"</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={onConfirm}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
