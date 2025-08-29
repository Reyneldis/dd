-- CreateTable
CREATE TABLE "public"."EmailMetrics" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "attempt" INTEGER NOT NULL,
    "error" TEXT,

    CONSTRAINT "EmailMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmailMetrics_orderId_idx" ON "public"."EmailMetrics"("orderId");

-- AddForeignKey
ALTER TABLE "public"."EmailMetrics" ADD CONSTRAINT "EmailMetrics_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
