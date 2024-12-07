-- CreateTable
CREATE TABLE "AIAgent" (
    "id" SERIAL NOT NULL,
    "agentAddress" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    "ownerAddress" TEXT NOT NULL,
    "seedPhrase" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,

    CONSTRAINT "AIAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "buyTokenAddress" TEXT NOT NULL,
    "networkId" TEXT NOT NULL,
    "sellTokenAddress" TEXT NOT NULL,
    "buyOnPercentage" INTEGER NOT NULL,
    "sellOnPercentage" INTEGER NOT NULL,
    "lastBuyTokenPrice" INTEGER NOT NULL DEFAULT 0,
    "aiAgentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_aiAgentId_fkey" FOREIGN KEY ("aiAgentId") REFERENCES "AIAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
