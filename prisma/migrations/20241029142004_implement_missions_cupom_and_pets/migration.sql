-- CreateEnum
CREATE TYPE "Porte" AS ENUM ('mini', 'pequeno', 'medio', 'grande', 'gigante');

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "size" "Porte" NOT NULL,
    "customerId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cupom" (
    "id" TEXT NOT NULL,
    "porcentagem" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ValidateAt" TIMESTAMP(3) NOT NULL DEFAULT '2050-02-09T00:00:00.000Z'::timestamp,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "storeId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "Cupom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Missao" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "concluido" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" TEXT NOT NULL,
    "timer" DOUBLE PRECISION,
    "imageUrl" TEXT,

    CONSTRAINT "Missao_pkey" PRIMARY KEY ("id")
);
