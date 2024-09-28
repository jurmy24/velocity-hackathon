"use server";

import prisma from "@/lib/prisma";
import { Node, Prisma, NodeConnection } from "@prisma/client";

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

export const createNodeConnection = async (
  sourceId: number,
  targetId: number,
): Promise<NodeConnection> => {
  return prisma.nodeConnection.create({
    data: {
      nodes: {
        connect: [{ id: sourceId }, { id: targetId }],
      },
    },
    include: {
      nodes: true,
    },
  });
};

export const getNodeConnectionsByBoardId = async (
  boardId: number,
): Promise<NodeConnection[]> => {
  return prisma.nodeConnection.findMany({
    where: {
      nodes: {
        some: {
          boardId: boardId,
        },
      },
    },
    include: {
      nodes: true,
    },
  });
};

export const deleteNodeConnection = async (
  connectionId: number,
): Promise<NodeConnection> => {
  return prisma.nodeConnection.delete({
    where: { id: connectionId },
  });
};

export const getNodeWithConnections = async (
  id: number,
): Promise<Node | null> => {
  return prisma.node.findUnique({
    where: { id },
    include: {
      connections: {
        include: {
          nodes: true,
        },
      },
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
