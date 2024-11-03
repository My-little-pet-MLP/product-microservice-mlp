/*
  Warnings:

  - Added the required column `description` to the `Cupom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cupom" ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "ValidateAt" SET DEFAULT '2050-02-09T00:00:00.000Z'::timestamp,
ALTER COLUMN "customerId" DROP NOT NULL;
