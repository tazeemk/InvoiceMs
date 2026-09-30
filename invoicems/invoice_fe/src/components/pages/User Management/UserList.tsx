"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Plus, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserTable } from "./components/user-table";
import { DeleteDialog } from "./components/delete-dialog";
import { UserViewPage } from "./components/user-view";
import { UserForm } from "./components/user-form";

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  status: string;
  createdBy: string;
};

type SortDirection = "asc" | "desc";
type SortField = keyof User;
type CurrentPage = "list" | "view" | "edit" | "add";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [currentPage, setCurrentPage] = useState<CurrentPage>("list");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const pageSize = 5;

  // Fetch users
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL || "http://192.168.1.63:8060/"}users/getAllUsers`);
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed fetching users", error);
      }
      setLoading(false);
    }
    loadUsers();
  }, []);

  // Processed data (search + sort)
  const processedData = useMemo(() => {
    let filtered = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.id.toLowerCase().includes(term) ||
          u.username.toLowerCase().includes(term) ||
          u.status.toLowerCase().includes(term)
      );
    }

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField]!;
        const bVal = b[sortField]!;
        const result =
          typeof aVal === "string"
            ? aVal.localeCompare(bVal as string)
            : (aVal as number) - (bVal as unknown as number);

        return sortDirection === "asc" ? result : -result;
      });
    }

    return filtered;
  }, [users, searchTerm, sortField, sortDirection]);

  const pagedData = useMemo(
    () =>
      processedData.slice((page - 1) * pageSize, page * pageSize),
    [processedData, page, pageSize]
  );

  const totalPages = Math.ceil(processedData.length / pageSize);

  // Handlers
  const handleSearch = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setCurrentPage("view");
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setCurrentPage("edit");
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    }
    setDeleteDialogOpen(false);
  };

  const handleSaveEdit = (updated: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? updated : u))
    );
    setCurrentPage("list");
  };

  const handleBackToList = () => {
    setCurrentPage("list");
    setSelectedUser(null);
  };

  // Export CSV
  const handleExport = () => {
    const csv = [
      ["ID", "Username", "Email", "Role", "Status", "Created By"],
      ...processedData.map((u) => [
        u.id,
        u.username,
        u.email,
        u.role,
        u.status,
        u.createdBy,
      ]),
    ]
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "users.csv";
    a.click();
  };

  // Pages
  if (currentPage === "view" && selectedUser) {
    return <UserViewPage user={selectedUser} onBack={handleBackToList} />;
  }

  if (currentPage === "edit" && selectedUser) {
    return (
      <UserForm
        user={selectedUser}
        onBack={handleBackToList}
        onSave={handleSaveEdit}
      />
    );
  }

  // Default List View
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-emerald-900">Users</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <Button variant="outline" onClick={handleExport}>
            <File className="h-4 w-4 mr-2" /> Export
          </Button>

          <Button onClick={() => setCurrentPage("add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Table */}
      <UserTable
        users={pagedData}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
      />

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t">
        <p className="text-gray-500 text-sm">
          Showing {Math.min((page - 1) * pageSize + 1, processedData.length)}–
          {Math.min(page * pageSize, processedData.length)} of{" "}
          {processedData.length}
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        item={userToDelete}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        itemType="User"
      />
    </div>
  );
}
