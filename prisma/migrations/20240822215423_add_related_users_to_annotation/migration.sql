/*
  Warnings:

  - You are about to drop the column `relatedUserId` on the `Annotation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Annotation" DROP CONSTRAINT "Annotation_relatedUserId_fkey";

-- AlterTable
ALTER TABLE "Annotation" DROP COLUMN "relatedUserId";

-- CreateTable
CREATE TABLE "RelatedUserAnnotations" (
    "annotationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "userUuid" UUID,

    CONSTRAINT "RelatedUserAnnotations_pkey" PRIMARY KEY ("annotationId","userId")
);

-- AddForeignKey
ALTER TABLE "RelatedUserAnnotations" ADD CONSTRAINT "RelatedUserAnnotations_annotationId_fkey" FOREIGN KEY ("annotationId") REFERENCES "Annotation"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedUserAnnotations" ADD CONSTRAINT "RelatedUserAnnotations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedUserAnnotations" ADD CONSTRAINT "RelatedUserAnnotations_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
