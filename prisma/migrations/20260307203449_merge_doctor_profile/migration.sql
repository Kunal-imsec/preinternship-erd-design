/*
  Warnings:

  - You are about to drop the `DoctorProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DoctorProfile" DROP CONSTRAINT "DoctorProfile_userId_fkey";

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "qualification" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "specialization" SET DEFAULT '',
ALTER COLUMN "experience" SET DEFAULT 0;

-- DropTable
DROP TABLE "DoctorProfile";
