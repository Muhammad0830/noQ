-- DropIndex
DROP INDEX "Booking_serviceId_idx";

-- DropIndex
DROP INDEX "Booking_shopId_idx";

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "backgroundImageUrl" TEXT;

-- CreateIndex
CREATE INDEX "Booking_status_createdAt_shopId_idx" ON "Booking"("status", "createdAt", "shopId");

-- CreateIndex
CREATE INDEX "Booking_status_createdAt_serviceId_idx" ON "Booking"("status", "createdAt", "serviceId");
