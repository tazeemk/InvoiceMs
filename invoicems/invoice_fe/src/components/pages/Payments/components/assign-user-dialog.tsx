"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Loader2, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Invoice } from "@/impData/types";
import { filterUsers, assignInvoiceToUser } from "@/service/payment";

// Matches actual API response: { id, username, email, role, status }
interface UserType {
  id: string;
  username: string;
  email?: string;
  role?: string;
  status?: string;
}

interface Props {
  isOpen: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onAssigned: (updatedInvoice: Invoice) => void;
}

// Initials avatar — handles "amit_kumar" and "Rajesh Kumar" styles
const UserAvatar: React.FC<{ username: string }> = ({ username }) => {
  const initials = username
    ? username
        .split(/[\s_]+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";
  return (
    <div className="h-10 w-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0">
      <span className="text-sm font-semibold text-emerald-700">{initials}</span>
    </div>
  );
};

// Role badge with colour per role type
const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const colours: Record<string, string> = {
    ADMIN:    "bg-purple-100 text-purple-700",
    ACCOUNTS: "bg-blue-100 text-blue-700",
    USER:     "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`text-xs rounded px-1.5 py-0.5 font-medium ${
        colours[role] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {role}
    </span>
  );
};

export const AssignUserDialog: React.FC<Props> = ({
  isOpen,
  invoice,
  onClose,
  onAssigned,
}) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [assigningUserId, setAssigningUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load users each time dialog opens
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setError(null);
      loadUsers();
    }
  }, [isOpen]);

  // Live search filter — uses "username" (correct API field)
  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredUsers(
      users.filter(
        (u) =>
          u.username?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.role?.toLowerCase().includes(q)
      )
    );
  }, [search, users]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    setError(null);
    try {
      const data = await filterUsers();
      // Map from real API shape: { id, username, email, role, status }
      const normalized: UserType[] = (data || [])
        .filter((u: any) => u.status === "ACTIVE")
        .map((u: any) => ({
          id:       u.id,
          username: u.username,   // ← API field is "username"
          email:    u.email,
          role:     u.role,
          status:   u.status,
        }));
      setUsers(normalized);
      setFilteredUsers(normalized);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAssign = async (user: UserType) => {
    if (!invoice) return;
    setAssigningUserId(user.id);
    setError(null);
    try {
      const updated = await assignInvoiceToUser(invoice.id, user.id);
      onAssigned(updated);
      onClose();
    } catch (err) {
      setError(`Failed to assign ${user.username}. Please try again.`);
      console.error(err);
    } finally {
      setAssigningUserId(null);
    }
  };

  if (!invoice) return null;

  const currentAssignedId = invoice.assignUserId;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl">

        {/* ── Header ── */}
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold text-gray-800">
              Assign User for Collection
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Invoice #{invoice.invoiceNumber}
            {invoice.assignUser && (
              <span className="ml-2 text-emerald-600 font-medium">
                · Currently: {invoice.assignUser}
              </span>
            )}
          </p>
        </DialogHeader>

        {/* ── Search ── */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 text-sm"
            />
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mx-4 mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        {/* ── User list ── */}
        <div className="overflow-y-auto" style={{ maxHeight: "420px" }}>
          {loadingUsers ? (
            <div className="flex flex-col items-center justify-center py-14 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mb-2 text-emerald-500" />
              <span className="text-sm">Loading users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-gray-400">
              <span className="text-sm">No users found</span>
            </div>
          ) : (
            filteredUsers.map((user) => {
              const isCurrentlyAssigned = currentAssignedId === user.id;
              const isAssigning = assigningUserId === user.id;

              return (
                <div
                  key={user.id}
                  className={`flex items-center justify-between px-5 py-3.5 border-b border-gray-100 last:border-b-0 transition-colors ${
                    isCurrentlyAssigned ? "bg-emerald-50" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Avatar + info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar username={user.username} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {user.username}
                      </p>
                      {user.email && (
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      )}
                      {user.role && (
                        <div className="mt-0.5">
                          <RoleBadge role={user.role} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Assign / Assigned indicator */}
                  {isCurrentlyAssigned ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold ml-3 flex-shrink-0">
                      <UserCheck className="h-4 w-4" />
                      Assigned
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleAssign(user)}
                      disabled={!!assigningUserId}
                      className="ml-3 flex-shrink-0 bg-[#1e3a5f] hover:bg-[#16304f] text-white text-xs px-5 h-8 rounded-md"
                    >
                      {isAssigning ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        "Assign"
                      )}
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};