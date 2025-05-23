"use client";

import { useEffect, useState } from "react";
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
  const [displayUsers, setDisplayUsers] = useState<any[]>([]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
        action: {
          label: "Ok",
          onClick: () => console.log("Ok clicked"),
        },
      });
      setForm({ name: "", email: "", password: "" });
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
                  <Dialog>
                    <DialogTrigger className="text-blue-500">
                      Edit
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Account</DialogTitle>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  {/* Delete */}
                  <AlertDialog>
                    <AlertDialogTrigger className="text-red-500">Delete</AlertDialogTrigger>
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
                        <AlertDialogAction>Confirm</AlertDialogAction>
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
