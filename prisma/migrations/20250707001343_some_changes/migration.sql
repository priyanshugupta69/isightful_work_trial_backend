/*
  Warnings:

  - A unique constraint covering the columns `[id,organization_id]` on the table `team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "team_id_organization_id_key" ON "team"("id", "organization_id");

-- RenameForeignKey
ALTER TABLE "employee" RENAME CONSTRAINT "teams_organization_id_fkey" TO "employee_team_id_fkey";
