-- CreateTable
CREATE TABLE "error_logs" (
    "uuid" UUID NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "error" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "headers" JSON NOT NULL,
    "method" VARCHAR(200) NOT NULL,
    "stackTrace" TEXT,
    "userId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("uuid")
);
