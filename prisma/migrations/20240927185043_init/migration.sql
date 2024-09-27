-- CreateTable
CREATE TABLE "Board" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Node" (
    "id" SERIAL NOT NULL,
    "boardId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "xPos" INTEGER NOT NULL,
    "yPos" INTEGER NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NodeConnection" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "NodeConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_NodeConnections" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_NodeToNodeConnection" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_NodeConnections_AB_unique" ON "_NodeConnections"("A", "B");

-- CreateIndex
CREATE INDEX "_NodeConnections_B_index" ON "_NodeConnections"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_NodeToNodeConnection_AB_unique" ON "_NodeToNodeConnection"("A", "B");

-- CreateIndex
CREATE INDEX "_NodeToNodeConnection_B_index" ON "_NodeToNodeConnection"("B");

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NodeConnections" ADD CONSTRAINT "_NodeConnections_A_fkey" FOREIGN KEY ("A") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NodeConnections" ADD CONSTRAINT "_NodeConnections_B_fkey" FOREIGN KEY ("B") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NodeToNodeConnection" ADD CONSTRAINT "_NodeToNodeConnection_A_fkey" FOREIGN KEY ("A") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NodeToNodeConnection" ADD CONSTRAINT "_NodeToNodeConnection_B_fkey" FOREIGN KEY ("B") REFERENCES "NodeConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
