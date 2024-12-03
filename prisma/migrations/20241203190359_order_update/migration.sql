-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('APPROVED', 'PENDING');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "paymentStatus" TEXT;
