/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "phoneNumber" VARCHAR(20);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phoneNumber";
