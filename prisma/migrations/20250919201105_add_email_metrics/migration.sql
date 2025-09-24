/*
  Warnings:

  - You are about to alter the column `stock` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to drop the `EmailMetrics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."EmailMetrics" DROP CONSTRAINT "EmailMetrics_orderId_fkey";

-- AlterTable
ALTER TABLE "public"."products" ALTER COLUMN "stock" SET DATA TYPE SMALLINT;

-- DropTable
DROP TABLE "public"."EmailMetrics";

-- CreateTable
CREATE TABLE "public"."email_metrics" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "attempt" INTEGER NOT NULL,
    "error" TEXT,

    CONSTRAINT "email_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_metrics_orderId_idx" ON "public"."email_metrics"("orderId");

-- CreateIndex
CREATE INDEX "products_productName_idx" ON "public"."products"("productName");

-- AddForeignKey
ALTER TABLE "public"."email_metrics" ADD CONSTRAINT "email_metrics_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
