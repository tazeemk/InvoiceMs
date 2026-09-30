"use client";

import { ArrowUpDown, Eye, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

import { User } from "../UserList";

interface Props {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onSort: (field: keyof User) => void;
  sortField: keyof User | null;
  sortDirection: "asc" | "desc";
}

export function UserTable({
  users,
  onView,
  onEdit,
  onDelete,
  onSort,
  sortField,
  sortDirection
}: Props) {
  const headers: { label: string; field: keyof User }[] = [
    { label: "ID", field: "id" },
    { label: "Username", field: "username" },
    { label: "Email", field: "email" },
    { label: "Role", field: "role" },
    { label: "Status", field: "status" },
    { label: "Created By", field: "createdBy" },
  ];

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-emerald-600 text-white">
          <tr>
            {headers.map((h) => (
              <th
                key={h.field}
                className="py-3 px-4 cursor-pointer select-none"
                onClick={() => onSort(h.field)}
              >
                <div className="flex items-center gap-1">
                  {h.label}
                  {sortField === h.field && (
                    <ArrowUpDown
                      className={`h-4 w-4 ${
                        sortDirection === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </th>
            ))}
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 && (
            <tr>
              <td
                className="text-center py-6 text-gray-500"
                colSpan={headers.length + 1}
              >
                No users found.
              </td>
            </tr>
          )}

          {users.map((u) => (
            <tr
              key={u.id}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="py-3 px-4">{u.id}</td>
              <td className="py-3 px-4">{u.username}</td>
              <td className="py-3 px-4">{u.email}</td>
              <td className="py-3 px-4">{u.role}</td>
              <td className="py-3 px-4">{u.status}</td>
              <td className="py-3 px-4">{u.createdBy}</td>

              <td className="py-3 px-4 text-right space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(u)}
                >
                  <Eye className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(u)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(u)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
