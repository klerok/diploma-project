/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nickname]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nickname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MaterialType" AS ENUM ('ARTICLE', 'BOOK', 'COURSE');

-- CreateEnum
CREATE TYPE "QuestStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currentStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastActivityDate" TIMESTAMP(3),
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "totalXp" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "type" "MaterialType" NOT NULL,
    "pages" INTEGER NOT NULL,
    "sourceUrl" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XpLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XpLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quest" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetCount" INTEGER NOT NULL,
    "rewardXp" INTEGER NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserQuest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "questId" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" "QuestStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "UserQuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "achievementId" INTEGER NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Material_userId_idx" ON "Material"("userId");

-- CreateIndex
CREATE INDEX "XpLog_userId_createdAt_idx" ON "XpLog"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserQuest_userId_questId_key" ON "UserQuest"("userId", "questId");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_code_key" ON "Achievement"("code");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "UserAchievement"("userId", "achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XpLog" ADD CONSTRAINT "XpLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
