-- CreateTable
CREATE TABLE "User" (
    "uuid" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" VARCHAR(20),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Annotation" (
    "uuid" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "remindAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "relatedUserId" UUID,

    CONSTRAINT "Annotation_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Category" (
    "uuid" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Notification" (
    "uuid" UUID NOT NULL,
    "emailNotify" BOOLEAN NOT NULL DEFAULT true,
    "phoneNotify" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_relatedUserId_fkey" FOREIGN KEY ("relatedUserId") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
