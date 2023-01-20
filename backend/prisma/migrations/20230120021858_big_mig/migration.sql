-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" SERIAL NOT NULL,
    "source" INTEGER NOT NULL,
    "target" INTEGER NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sublinks" (
    "id" SERIAL NOT NULL,
    "superId" INTEGER NOT NULL,
    "subId" INTEGER NOT NULL,

    CONSTRAINT "sublinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nodes" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,

    CONSTRAINT "nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "nodeId" INTEGER NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Upvoters" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_Downvoters" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "nodes_title_key" ON "nodes"("title");

-- CreateIndex
CREATE UNIQUE INDEX "resources_url_key" ON "resources"("url");

-- CreateIndex
CREATE UNIQUE INDEX "_Upvoters_AB_unique" ON "_Upvoters"("A", "B");

-- CreateIndex
CREATE INDEX "_Upvoters_B_index" ON "_Upvoters"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Downvoters_AB_unique" ON "_Downvoters"("A", "B");

-- CreateIndex
CREATE INDEX "_Downvoters_B_index" ON "_Downvoters"("B");

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_source_fkey" FOREIGN KEY ("source") REFERENCES "nodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_target_fkey" FOREIGN KEY ("target") REFERENCES "nodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sublinks" ADD CONSTRAINT "sublinks_superId_fkey" FOREIGN KEY ("superId") REFERENCES "nodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sublinks" ADD CONSTRAINT "sublinks_subId_fkey" FOREIGN KEY ("subId") REFERENCES "nodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "nodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Upvoters" ADD CONSTRAINT "_Upvoters_A_fkey" FOREIGN KEY ("A") REFERENCES "nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Upvoters" ADD CONSTRAINT "_Upvoters_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Downvoters" ADD CONSTRAINT "_Downvoters_A_fkey" FOREIGN KEY ("A") REFERENCES "nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Downvoters" ADD CONSTRAINT "_Downvoters_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
