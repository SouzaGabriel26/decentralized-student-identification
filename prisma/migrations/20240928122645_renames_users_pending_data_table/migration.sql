/*
  Warnings:

  - You are about to drop the `(user_pending_data)` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "(user_pending_data)" DROP CONSTRAINT "(user_pending_data)_user_id_fkey";

-- DropTable
DROP TABLE "(user_pending_data)";

-- CreateTable
CREATE TABLE "users_pending_data" (
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

    CONSTRAINT "users_pending_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_pending_data_user_id_key" ON "users_pending_data"("user_id");

-- AddForeignKey
ALTER TABLE "users_pending_data" ADD CONSTRAINT "users_pending_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
