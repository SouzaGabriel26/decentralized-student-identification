-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "public_key" TEXT NOT NULL,
    "crypted_private_key" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_public_key_key" ON "users"("public_key");

-- CreateIndex
CREATE UNIQUE INDEX "users_crypted_private_key_key" ON "users"("crypted_private_key");
