"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "../UserList";

interface Props {
  isOpen: boolean;
  item: User | null;
  itemType?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteDialog({
  isOpen,
  item,
  itemType = "User",
  onConfirm,
  onCancel
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {itemType}
          </DialogTitle>
        </DialogHeader>

        <p className="text-gray-700">
          Are you sure you want to delete{" "}
          <strong>{item?.username}</strong>?  
          This action cannot be undone.
        </p>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
