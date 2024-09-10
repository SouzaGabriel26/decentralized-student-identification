/*
  Warnings:

  - You are about to drop the column `crypted_private_key` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_crypted_private_key_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "crypted_private_key";

-- CreateTable
CREATE TABLE "(user_pending_data)" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "course" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "(user_pending_data)_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "(user_pending_data)_user_id_key" ON "(user_pending_data)"("user_id");

-- AddForeignKey
ALTER TABLE "(user_pending_data)" ADD CONSTRAINT "(user_pending_data)_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
