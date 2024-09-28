"use server";

import prisma from "@/lib/prisma";
import { Board } from "@prisma/client";

// Create
export const createBoard = async (
  title: string,
  authorId: number,
): Promise<Board> => {
  return prisma.board.create({
    data: { title, authorId },
  });
};

// Read (Get all boards)
export const getAllBoards = async (): Promise<Board[]> => {
  return prisma.board.findMany();
};

// Read (Get board by ID)
export const getBoardById = async (id: number): Promise<Board | null> => {
  return prisma.board.findUnique({
    where: { id },
  });
};

// Update
export const updateBoard = async (
  id: number,
  title: string,
): Promise<Board> => {
  return prisma.board.update({
    where: { id },
    data: { title },
  });
};

// Delete
export const deleteBoard = async (id: number): Promise<Board> => {
  return prisma.board.delete({
    where: { id },
  });
};

// Additional operations

// Get board with nodes
export const getBoardWithNodes = async (id: number): Promise<Board | null> => {
  return prisma.board.findUnique({
    where: { id },
    include: {
      nodes: {
        select: {
          id: true,
          content: true,
          xPos: true,
          yPos: true,
        },
      },
    },
  });
};

// Get board with author
export const getBoardWithAuthor = async (id: number): Promise<Board | null> => {
  return prisma.board.findUnique({
    where: { id },
    include: { author: true },
  });
};

// Get boards by author ID
export const getBoardsByAuthorId = async (
  authorId: number,
): Promise<Board[]> => {
  return prisma.board.findMany({
    where: { authorId },
  });
};

// Search boards by title
export const searchBoardsByTitle = async (
  titleQuery: string,
): Promise<Board[]> => {
  return prisma.board.findMany({
    where: {
      title: {
        contains: titleQuery,
        mode: "insensitive", // Case-insensitive search
      },
    },
  });
};
