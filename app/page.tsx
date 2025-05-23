"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";

type User = {
  name: string;
  email: string;
  password: string;
};

export default function Page() {
  const [form, setForm] = useState<User>({
    name: "",
    email: "",
    password: "",
  });
  const [updateForm, setUpdateForm] = useState<User>({
    name: "",
    email: "",
    password: "",
  });
  const [displayUsers, setDisplayUsers] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error("Fetch error:", error.message);
    } else {
      setDisplayUsers(data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // VALUE CHANGE
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const updateChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEntry = form;

    const { data, error } = await supabase.from("users").insert([newEntry]);

    const formatted = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (error) {
      console.error("Insert error:", error.message);
    } else {
      toast("Account has been created", {
        description: formatted,
      });
      setForm({ name: "", email: "", password: "" });
      fetchUsers();
    }
  };

  // UPDATE
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingId) return;

    const { data, error } = await supabase
      .from("users")
      .update(updateForm)
      .eq("user_id", editingId);

    const formatted = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (error) {
      console.error("failed to update", error.message);
    } else {
      toast("Update successfully", {
        description: formatted,
      });
      setEditingId(null);
      setForm({ name: "", email: "", password: "" });
      fetchUsers();
    }
  };

  // DELETE
  const handleDelete = async (userId: string) => {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("user_id", userId);

    const formatted = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (error) {
      console.error("Delete error", error.message);
    } else {
      toast("User deleted successfully", {
        description: formatted,
      }),
      fetchUsers();
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col space-y-2 w-1/2">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2 ">
          <h1 className="text-xl font-bold mb-4">Create User</h1>
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <Button type="submit">Submit</Button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayUsers.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.password}</TableCell>
                <TableCell className="flex space-x-2">
                  {/* Edit */}
                  <AlertDialog>
                    <AlertDialogTrigger
                      onClick={() => {
                        setEditingId(user.user_id);
                        setUpdateForm({
                          name: user.name,
                          email: user.email,
                          password: user.password,
                        });
                      }}
                      className="text-blue-500"
                    >
                      Edit
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Edit Account</AlertDialogTitle>
                        <AlertDialogDescription>
                          Make changes to your profile here. Click save when
                          you're done.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              value={updateForm.name}
                              onChange={updateChangeForm}
                              placeholder="Pedro Duarte"
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={updateForm.email}
                              onChange={updateChangeForm}
                              placeholder="peduarte@outlook.com"
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                              Password
                            </Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              value={updateForm.password}
                              onChange={updateChangeForm}
                              placeholder="peduarte123"
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogAction type="submit">
                            Save Changes
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </form>
                    </AlertDialogContent>
                  </AlertDialog>
                  {/* Delete */}
                  <AlertDialog>
                    <AlertDialogTrigger className="text-red-500">
                      Delete
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(user.user_id)}
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
