/*
  Warnings:

  - You are about to drop the column `name` on the `team` table. All the data in the column will be lost.
  - Added the required column `title` to the `team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "team" DROP COLUMN "name",
ADD COLUMN     "description" VARCHAR(255),
ADD COLUMN     "title" VARCHAR(255) NOT NULL;
