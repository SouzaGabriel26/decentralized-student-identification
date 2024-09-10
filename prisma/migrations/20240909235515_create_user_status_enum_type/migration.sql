-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "user_status" NOT NULL DEFAULT 'PENDING';
