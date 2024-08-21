-- DropForeignKey
ALTER TABLE "Annotation" DROP CONSTRAINT "Annotation_categoryId_fkey";

-- AlterTable
ALTER TABLE "Annotation" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
