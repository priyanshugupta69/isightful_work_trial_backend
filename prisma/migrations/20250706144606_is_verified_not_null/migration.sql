/*
  Warnings:

  - Made the column `is_verified` on table `organization` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "organization" ALTER COLUMN "is_verified" SET NOT NULL;
