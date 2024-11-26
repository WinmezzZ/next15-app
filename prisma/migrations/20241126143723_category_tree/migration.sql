/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `depth` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "depth" INTEGER NOT NULL,
ADD COLUMN     "numchild" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "path" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_path_key" ON "Category"("path");
