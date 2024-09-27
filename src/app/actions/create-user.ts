"use server";

import { createUser } from "@/app/api/user";
import { revalidatePath } from "next/cache";

export async function newUser(formData: FormData) {
  const name = formData.get("name");

  if (!name || typeof name !== "string") {
    return { error: "Name is required" };
  }

  const user = await createUser(name);

  console.log(`User ${name} created successfully!`, user);

  revalidatePath("/");

  return { success: `User ${name} created successfully!` };
}
