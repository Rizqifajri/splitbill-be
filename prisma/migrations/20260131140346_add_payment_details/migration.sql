/*
  Warnings:

  - You are about to drop the column `paymentNote` on the `Bill` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "paymentNote",
ADD COLUMN     "paymentDetails" TEXT;
