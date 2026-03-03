-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "acceptsCash" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "acceptsCrypto" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "acceptsFinancing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "acceptsTrade" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "acceptsTransfer" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "contactCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "favoriteCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "financingMaxMonths" INTEGER,
ADD COLUMN     "financingMinDeposit" INTEGER,
ADD COLUMN     "financingNotes" TEXT,
ADD COLUMN     "financingRate" DOUBLE PRECISION,
ADD COLUMN     "tradeNotes" TEXT,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Car_userId_idx" ON "Car"("userId");

-- CreateIndex
CREATE INDEX "Car_status_idx" ON "Car"("status");

-- CreateIndex
CREATE INDEX "Car_brandId_idx" ON "Car"("brandId");

-- CreateIndex
CREATE INDEX "Car_modelId_idx" ON "Car"("modelId");

-- CreateIndex
CREATE INDEX "Car_acceptsFinancing_idx" ON "Car"("acceptsFinancing");

-- CreateIndex
CREATE INDEX "Car_acceptsTrade_idx" ON "Car"("acceptsTrade");
