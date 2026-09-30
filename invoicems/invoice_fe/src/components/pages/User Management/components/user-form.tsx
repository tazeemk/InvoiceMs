"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { User } from "../UserList";

interface Props {
  user: User;
  onSave: (user: User) => void;
  onBack: () => void;
}

export function UserForm({ user, onSave, onBack }: Props) {
  const [form, setForm] = useState<User>(user);

  const handleChange = (field: keyof User, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitForm = () => {
    onSave(form);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-emerald-800">
        {user.id ? "Edit User" : "Add User"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          value={form.username}
          onChange={(e) => handleChange("username", e.target.value)}
          placeholder="Username"
        />

        <Input
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Email"
        />

        <Input
          value={form.role}
          onChange={(e) => handleChange("role", e.target.value)}
          placeholder="Role"
        />

        <Input
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
          placeholder="Status"
        />

        <Input
          value={form.createdBy}
          onChange={(e) => handleChange("createdBy", e.target.value)}
          placeholder="Created By"
        />
      </div>

      <div className="flex gap-3">
        <Button
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={submitForm}
        >
          Save
        </Button>

        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
