"use client";

import { Plus, Search, File, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction
} from "@/components/ui/alert-dialog";

import { filterUsers, newAndUpdateUser, updateStatusActiveInactive, deleteUser } from "@/service/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Import types
import { User, SortDirection, CurrentPage } from "@/impData/types";

// Only allow sorting by fields that exist on User
type SortField = keyof User;

// Import components
import { UserTable } from "./components/user-table";
import { DeleteDialog } from "./components/delete-dialog";
import { ApproveDialog } from "./components/approve-dialog";
import { UserForm } from "./components/user-form";
import { UserViewPage } from "./components/user-view";

type InfoDialogState = {
  isOpen: boolean;
  title: string;
  description: string;
} | null;

// Map URL path segments to User role values
const roleMap: Record<string, string> = {
  all: "", // 'all' shows all roles except ADMIN
  customers: "CUSTOMER",
  collections: "COLLECTION",
  accounts: "ACCOUNTS",
};

// This is a placeholder for the actual logged-in user.
// In a real application, you would get this from your authentication context (e.g., using a `useAuth` hook).
const loggedInUser = {
  username: "AdminUser", // Example: Replace with something like `auth.user.username`
};

export default function UserList() {

  // ----------------------------
  //  API LOADED USERS
  // ----------------------------
  const { data: users = [], isLoading, error, refetch } = useQuery<User[]>({
    // staleTime: 1000 * 60 * 5, // 5 minutes
    queryKey: ["users"],
    queryFn: filterUsers,
  });

  // ----------------------------


  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Page navigation states
  const [currentPage, setCurrentPage] = useState<CurrentPage>("list");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Approve/Reject dialog state
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [userToApprove, setUserToApprove] = useState<User | null>(null);
  const [userToReject, setUserToReject] = useState<User | null>(null);

  // Generic info dialog for success/error messages
  const [infoDialog, setInfoDialog] = useState<InfoDialogState>(null);
  const userMutation = useMutation({
    mutationFn: newAndUpdateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      handleBackToList();
    },
    // Optional: Add onError for error handling
    // onError: (error) => { console.error("Failed to save user:", error); }
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: User['status'] }) =>
      updateStatusActiveInactive(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    // onError: (error) => { console.error("Failed to update status:", error); }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    // onError: (error) => { console.error("Failed to delete user:", error); }
  });

  const pageSize = 5;

  const pathSegments = pathname.split('/');
  const roleKey = pathSegments.length > 2 ? pathSegments[2] : "all";
  const mappedRole = roleMap[roleKey] || "CUSTOMER"; // Default to CUSTOMER if no role in URL

  // Empty user for add page
  const emptyUser: User = {
    id: `USR-${Date.now()}`,
    username: "",
    email: "",
    password: "",
    role: mappedRole, // Default role based on current page
    status: "ACTIVE",
    createdBy: "", // Should be replaced with the current logged-in user
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  };

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let filtered = (users || []).filter((user) => user.role !== "ADMIN");

    if (mappedRole && roleKey !== 'all') {
      filtered = filtered.filter((user) => user.role === mappedRole);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        item.id.toLowerCase().includes(term) ||
        item.username.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        item.role.toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term)
      );
    }

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        const result = String(aVal ?? "").localeCompare(String(bVal ?? ""));
        return sortDirection === "asc" ? result : -result;
      });
    }

    return filtered;
  }, [users, searchTerm, sortField, sortDirection, mappedRole]);

  const pagedData = useMemo(
    () => processedData.slice((page - 1) * pageSize, page * pageSize),
    [processedData, page, pageSize]
  );

  const totalPages = Math.ceil(processedData.length / pageSize);

  // Callback handlers
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, []);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection((prev: any) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField]
  );

  const handleView = useCallback((user: User) => {
    setSelectedUser(user);
    setCurrentPage("view");
  }, []);

  const handleEdit = useCallback((user: User) => {
    setSelectedUser(user);
    setCurrentPage("edit");
  }, []);

  const handleDelete = useCallback((user: User) => {
    console.log("Delete user:", user);
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
      if (pagedData.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }
    }
  }, [userToDelete, pagedData.length, page, deleteMutation]);

  const cancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  }, []);

  const handleSaveEdit = useCallback((updatedUser: User) => {
    userMutation.mutate(updatedUser);
  }, [userMutation]);

  const handleSaveAdd = useCallback((newUser: User) => {
    userMutation.mutate({
      ...newUser,
      createdBy: loggedInUser.username,
    });
  }, [userMutation]);

  const handleBackToList = useCallback(() => {
    setCurrentPage("list");
    setSelectedUser(null);
  }, []);

  const handleStatusToggle = useCallback((user: User) => {
    const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    statusMutation.mutate({ id: user.id, status: newStatus });
  }, [statusMutation]);


  const handleExport = useCallback(() => {
    const csvContent = [
      [
        "ID",
        "User ID",
        "Username",
        "Email",
        "Role",
        "Status",
        "Created By",
        "Created At",
        "Updated At",
      ],
      ...processedData.map((usr) => [
        usr.id,
        usr.username,
        usr.email,
        usr.role,
        usr.status,
        usr.createdBy || "",
        usr.createdAt,
        usr.updatedAt,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [processedData]);

  // Render different pages based on current page state
  if (currentPage === "view" && selectedUser) {
    return (
      <UserViewPage
        user={selectedUser}
        onBack={handleBackToList}
        onEdit={() => handleEdit(selectedUser)}
      />
    );
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

  if (currentPage === "add") {
    return (
      <UserForm
        user={emptyUser}
        onBack={handleBackToList}
        onSave={handleSaveAdd}
        isAddPage={true}
      />
    );
  }

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error fetching users: {error.message}</div>;
  }

  // Default list view
  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-900">
          Users
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-2 py-2 w-64 border-green-200 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            <File className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setCurrentPage("add")}
          >
            <UserPlus className="h-4 w-4 mr-2" />
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
        onStatusToggle={handleStatusToggle}
        sortDirection={sortDirection}
        onApprove={(user) => {
          setUserToApprove(user);
          setApproveDialogOpen(true);
        }}
        onReject={(user) => {
          setUserToReject(user);
          setRejectDialogOpen(true);
        }}
      />

      {/* Approve Confirmation Dialog */}
      {userToApprove && (
        <ApproveDialog
          isOpen={approveDialogOpen}
          user={userToApprove}
          onConfirm={() => {
            if (userToApprove) {
              statusMutation.mutate({ id: userToApprove.id, status: "ACTIVE" });
              setInfoDialog({
                isOpen: true,
                title: "User Approved",
                description: "User has been successfully approved.",
              });
            }
            setApproveDialogOpen(false);
            setUserToApprove(null);
          }}
          onCancel={() => {
            setApproveDialogOpen(false);
            setUserToApprove(null);
          }}
        />
      )}

      {/* Reject Confirmation Dialog */}
      {userToReject && (
        <ApproveDialog
          isOpen={rejectDialogOpen}
          user={userToReject}
          onConfirm={() => {
            if (userToReject) {
              statusMutation.mutate({ id: userToReject.id, status: "INACTIVE" });
            }
            setRejectDialogOpen(false);
            setUserToReject(null);
          }}
          onCancel={() => {
            setRejectDialogOpen(false);
            setUserToReject(null);
          }}
          isReject
        />
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing{" "}
          {Math.min((page - 1) * pageSize + 1, processedData.length)} to{" "}
          {Math.min(page * pageSize, processedData.length)} of{" "}
          {processedData.length} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="border-green-200 hover:bg-green-50"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 px-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="border-green-200 hover:bg-green-50"
          >
            Next
          </Button>
        </div>
      </div>

      {userToDelete && (
        <DeleteDialog
          isOpen={deleteDialogOpen}
          user={userToDelete}
          onConfirm={() => {
            confirmDelete();
            setDeleteDialogOpen(false);
            setUserToDelete(null);
          }}
          onCancel={cancelDelete}
        />
      )}

      {/* Generic Info/Success/Error Dialog */}
      <AlertDialog open={infoDialog?.isOpen} onOpenChange={() => setInfoDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-green-600">
              <span className="h-5 w-5 text-green-600">&#10003;</span>
              {infoDialog?.title}
            </AlertDialogTitle>
            <AlertDialogDescription>{infoDialog?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setInfoDialog(null)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
