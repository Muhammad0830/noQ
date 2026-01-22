-- CreateTable
CREATE TABLE "ShopBlock" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShopBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShopBlock_shopId_idx" ON "ShopBlock"("shopId");
