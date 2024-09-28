"use server";

import prisma from "@/lib/prisma";
import { Node, Prisma } from "@prisma/client";

export const createNode = async (
  data: Prisma.NodeCreateInput,
): Promise<Node> => {
  return prisma.node.create({ data });
};

export const getAllNodes = async (): Promise<Node[]> => {
  return prisma.node.findMany();
};

export const getNodeById = async (id: number): Promise<Node | null> => {
  return prisma.node.findUnique({
    where: { id },
  });
};

export const updateNode = async (
  id: number,
  data: Prisma.NodeUpdateInput,
): Promise<Node> => {
  return prisma.node.update({
    where: { id },
    data,
  });
};

export const deleteNode = async (id: number): Promise<Node> => {
  return prisma.node.delete({
    where: { id },
  });
};

export const getNodesByBoardId = async (boardId: number): Promise<Node[]> => {
  return prisma.node.findMany({
    where: { boardId },
  });
};

export const getNodesByAuthorId = async (authorId: number): Promise<Node[]> => {
  return prisma.node.findMany({
    where: { authorId },
  });
};

export const getNodeWithConnections = async (
  id: number,
): Promise<Node | null> => {
  return prisma.node.findUnique({
    where: { id },
    include: {
      connectedTo: true,
      connectedFrom: true,
      connections: true,
    },
  });
};

export const connectNodes = async (
  nodeId1: number,
  nodeId2: number,
): Promise<Node> => {
  return prisma.node.update({
    where: { id: nodeId1 },
    data: {
      connectedTo: {
        connect: { id: nodeId2 },
      },
    },
    include: {
      connectedTo: true,
    },
  });
};

export const disconnectNodes = async (
  nodeId1: number,
  nodeId2: number,
): Promise<Node> => {
  return prisma.node.update({
    where: { id: nodeId1 },
    data: {
      connectedTo: {
        disconnect: { id: nodeId2 },
      },
    },
    include: {
      connectedTo: true,
    },
  });
};

export const searchNodes = async (query: string): Promise<Node[]> => {
  return prisma.node.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ],
    },
  });
};
