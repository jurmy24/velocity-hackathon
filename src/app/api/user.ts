import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export const createUser = async (name: string): Promise<User> => {
  return prisma.user.create({
    data: { name },
  });
};

export const getAllUsers = async (): Promise<User[]> => {
  return prisma.user.findMany();
};

export const getUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const updateUser = async (id: number, name: string): Promise<User> => {
  return prisma.user.update({
    where: { id },
    data: { name },
  });
};

export const deleteUser = async (id: number): Promise<User> => {
  return prisma.user.delete({
    where: { id },
  });
};

export const getUserWithBoards = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
    include: { boards: true },
  });
};

export const getUserWithNodes = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
    include: { nodes: true },
  });
};

export const searchUsersByName = async (nameQuery: string): Promise<User[]> => {
  return prisma.user.findMany({
    where: {
      name: {
        contains: nameQuery,
        mode: "insensitive", // Case-insensitive search
      },
    },
  });
};
