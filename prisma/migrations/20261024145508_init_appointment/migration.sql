-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('Booked', 'Done', 'No-show', 'Cancelled');

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "phone" TEXT,
    "appointmentStart" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'Booked',
    "confirmedAt" TIMESTAMP(3),
    "reminderSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Appointment_phone_idx" ON "Appointment"("phone");

-- CreateIndex
CREATE INDEX "Appointment_appointmentStart_idx" ON "Appointment"("appointmentStart");

-- CreateIndex (partial unique index — hand-written, Prisma cannot express this)
-- This enforces no double-booking: only one non-cancelled appointment can exist per slot.
-- Cancelled appointments are excluded so the same slot can be rebooked after a cancellation.
CREATE UNIQUE INDEX "Appointment_appointmentStart_active_unique"
  ON "Appointment" ("appointmentStart")
  WHERE "status" != 'Cancelled';

