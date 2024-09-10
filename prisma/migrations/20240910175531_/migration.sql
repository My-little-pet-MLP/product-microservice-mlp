/*
  Warnings:

  - You are about to alter the column `fullPriceOrderInCents` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `priceInCents` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "fullPriceOrderInCents" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "priceInCents" SET DATA TYPE INTEGER;
