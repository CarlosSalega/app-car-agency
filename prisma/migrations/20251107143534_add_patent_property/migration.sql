/*
  Warnings:

  - A unique constraint covering the columns `[patent]` on the table `Car` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "patent" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Car_patent_key" ON "Car"("patent");
