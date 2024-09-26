/*
  Warnings:

  - A unique constraint covering the columns `[eth_address]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eth_address` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "eth_address" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_eth_address_key" ON "users"("eth_address");
