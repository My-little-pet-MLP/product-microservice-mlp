-- AlterTable
ALTER TABLE "Cupom" ALTER COLUMN "ValidateAt" SET DEFAULT '2050-02-09T00:00:00.000Z'::timestamp;

-- CreateTable
CREATE TABLE "MissionSchema" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "isMissionByTimer" BOOLEAN NOT NULL DEFAULT false,
    "isMissionByImage" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MissionSchema_pkey" PRIMARY KEY ("id")
);
