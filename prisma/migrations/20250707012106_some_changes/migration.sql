/*
  Warnings:

  - You are about to drop the column `name` on the `task` table. All the data in the column will be lost.
  - Added the required column `title` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "task" DROP COLUMN "name",
ADD COLUMN     "description" VARCHAR(255),
ADD COLUMN     "end_date" TIMESTAMPTZ(6),
ADD COLUMN     "priority" "TaskPriority" NOT NULL DEFAULT 'LOW',
ADD COLUMN     "start_date" TIMESTAMPTZ(6),
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
ADD COLUMN     "title" VARCHAR(255) NOT NULL;
