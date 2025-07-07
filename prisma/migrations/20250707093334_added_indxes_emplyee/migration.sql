/*
  Warnings:

  - A unique constraint covering the columns `[email,organization_id]` on the table `employee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "idx_employee_email_unique";

-- CreateIndex
CREATE INDEX "idx_employee_email" ON "employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_organization_id_key" ON "employee"("email", "organization_id");
