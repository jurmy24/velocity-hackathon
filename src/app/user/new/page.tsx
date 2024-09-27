"use client";

import { useState } from "react";
import { newUser } from "@/app/actions/create-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create User"}
    </Button>
  );
}

export default function CreateUserPage() {
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    const result = await newUser(formData);
    if (result.error) {
      setMessage(result.error);
    } else if (result.success) {
      setMessage(result.success);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
          <CardDescription>
            Enter the name of the new user below.
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter user's name"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <SubmitButton />
            {message && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
