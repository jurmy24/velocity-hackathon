"use server";

import { createBoard } from "../api/board";
import { revalidatePath } from "next/cache";

export async function newBoard(name: string, authorId: number) {
  if (!name || typeof name !== "string") {
    return { error: "Name is required" };
  }

  const board = await createBoard(name, authorId);

  console.log(`Board ${name} created successfully!`, board);

  revalidatePath("/");

  return { success: `Board ${name} created successfully!` };
}

export async function fetchBoards(name: string, authorId: number) {
  if (!name || typeof name !== "string") {
    return { error: "Name is required" };
  }

  const board = await createBoard(name, authorId);

  console.log(`Board ${name} created successfully!`, board);

  revalidatePath("/");

  return { success: `Board ${name} created successfully!` };
}
