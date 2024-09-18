-- CreateEnum
CREATE TYPE "user_roles" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "user_roles" NOT NULL DEFAULT 'USER';
