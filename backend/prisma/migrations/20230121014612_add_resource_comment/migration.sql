-- CreateTable
CREATE TABLE "ResourceComment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "resourceId" INTEGER NOT NULL,
    "parentCommentId" INTEGER NOT NULL,

    CONSTRAINT "ResourceComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResourceComment" ADD CONSTRAINT "ResourceComment_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceComment" ADD CONSTRAINT "ResourceComment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "ResourceComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
