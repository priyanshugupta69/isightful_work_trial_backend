/*
  Warnings:

  - You are about to drop the column `description` on the `team` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `team` table. All the data in the column will be lost.
  - Added the required column `name` to the `team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "team" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "name" VARCHAR(255) NOT NULL;
