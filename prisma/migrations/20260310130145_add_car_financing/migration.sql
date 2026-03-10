/*
  Warnings:

  - You are about to drop the column `financingMaxMonths` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `financingMinDeposit` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `financingRate` on the `Car` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "financingMaxMonths",
DROP COLUMN "financingMinDeposit",
DROP COLUMN "financingRate",
ADD COLUMN     "financingDownPayment" INTEGER;
