-- CreateEnum
CREATE TYPE "public"."ShipmentStatus" AS ENUM ('PENDING', 'IN_TRANSIT', 'ARRIVED', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."bill_of_ladings" (
    "id" TEXT NOT NULL,
    "billOfLadingNumber" TEXT NOT NULL,
    "bookingNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "shipperName" TEXT NOT NULL,
    "shipperAddress" TEXT NOT NULL,
    "consigneeName" TEXT NOT NULL,
    "consigneeAddress" TEXT NOT NULL,
    "notifyPartyName" TEXT,
    "notifyPartyAddress" TEXT,
    "forwardingAgentName" TEXT,
    "forwardingAgentAddress" TEXT,
    "forwardingAgentPhone" TEXT,
    "vesselName" TEXT NOT NULL,
    "vesselVoyageNumber" TEXT,
    "vesselFlag" TEXT,
    "portOfLoading" TEXT NOT NULL,
    "portOfDischarge" TEXT NOT NULL,
    "placeOfReceipt" TEXT,
    "placeOfDelivery" TEXT,
    "containerNumber" TEXT,
    "sealNumber" TEXT,
    "packages" INTEGER NOT NULL,
    "cargoDescription" TEXT NOT NULL,
    "grossWeightKg" DOUBLE PRECISION,
    "volumeCbm" DOUBLE PRECISION,
    "freightBasis" TEXT,
    "freightRate" DOUBLE PRECISION,
    "freightPrepaid" DOUBLE PRECISION,
    "freightCollect" DOUBLE PRECISION,
    "freightTotal" DOUBLE PRECISION,
    "declaredValueUSD" DOUBLE PRECISION,
    "numberOfOriginals" INTEGER,
    "shipmentDate" TIMESTAMP(3),

    CONSTRAINT "bill_of_ladings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."shipments" (
    "id" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "status" "public"."ShipmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "estimatedArrival" TIMESTAMP(3),
    "actualArrival" TIMESTAMP(3),
    "cargoType" TEXT NOT NULL,
    "cargoWeight" DOUBLE PRECISION NOT NULL,
    "cargoVolume" DOUBLE PRECISION,
    "numberOfPackages" INTEGER NOT NULL,
    "shipperName" TEXT NOT NULL,
    "shipperAddress" TEXT NOT NULL,
    "consigneeName" TEXT NOT NULL,
    "consigneeAddress" TEXT NOT NULL,
    "vesselName" TEXT,
    "vesselVoyageNumber" TEXT,
    "declaredValue" DOUBLE PRECISION,
    "freightCost" DOUBLE PRECISION,
    "insuranceCost" DOUBLE PRECISION,
    "isDelivered" BOOLEAN NOT NULL DEFAULT false,
    "deliveryDate" TIMESTAMP(3),
    "deliveryNotes" TEXT,
    "billOfLadingId" TEXT,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bill_of_ladings_billOfLadingNumber_key" ON "public"."bill_of_ladings"("billOfLadingNumber");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_trackingNumber_key" ON "public"."shipments"("trackingNumber");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_billOfLadingId_key" ON "public"."shipments"("billOfLadingId");

-- AddForeignKey
ALTER TABLE "public"."shipments" ADD CONSTRAINT "shipments_billOfLadingId_fkey" FOREIGN KEY ("billOfLadingId") REFERENCES "public"."bill_of_ladings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
