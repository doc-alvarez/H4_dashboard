-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "siria_sub_token" TEXT,
    "lac_sub_token" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_password_key" ON "Users"("password");

-- CreateIndex
CREATE UNIQUE INDEX "Users_siria_sub_token_key" ON "Users"("siria_sub_token");

-- CreateIndex
CREATE UNIQUE INDEX "Users_lac_sub_token_key" ON "Users"("lac_sub_token");
