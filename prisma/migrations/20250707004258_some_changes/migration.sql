/*
  Warnings:

  - You are about to alter the column `team_id` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `team` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - Added the required column `organization_id` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_team_id_fkey";

-- DropIndex
DROP INDEX "team_id_organization_id_key";

-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "organization_id" BIGINT NOT NULL,
ALTER COLUMN "team_id" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "team" DROP CONSTRAINT "team_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "team_pkey" PRIMARY KEY ("id", "organization_id");
DROP SEQUENCE "team_id_seq";

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_team_id_organization_id_fkey" FOREIGN KEY ("team_id", "organization_id") REFERENCES "team"("id", "organization_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
