"use client";

import { Button } from "@/components/ui/button";
import { User } from "../UserList";

interface Props {
  user: User;
  onBack: () => void;
}

export function UserViewPage({ user, onBack }: Props) {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-emerald-900">User Details</h2>

      <div className="border rounded-lg p-6 space-y-3 bg-white shadow">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Status:</strong> {user.status}</p>
        <p><strong>Created By:</strong> {user.createdBy}</p>
      </div>

      <Button variant="outline" onClick={onBack}>
        Back to List
      </Button>
    </div>
  );
}
