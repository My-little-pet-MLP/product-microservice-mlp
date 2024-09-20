/*
  Warnings:

  - Added the required column `customerIdStripe` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `imageUrl` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Store` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'awaiting_payment', 'payment_confirmed', 'processing', 'shipped', 'delivered', 'canceled', 'returned');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customerIdStripe" TEXT NOT NULL,
ADD COLUMN     "storeId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "imageUrl" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
