-- AlterTable
ALTER TABLE "Cupom" ALTER COLUMN "ValidateAt" SET DEFAULT '2050-02-09T00:00:00.000Z'::timestamp;

-- AlterTable
ALTER TABLE "MissionSchema" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "timer" INTEGER;
