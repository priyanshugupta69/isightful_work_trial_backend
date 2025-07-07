-- AlterTable
ALTER TABLE "employee" ALTER COLUMN "uuid" DROP DEFAULT;

-- AlterTable
ALTER TABLE "organization" ALTER COLUMN "uuid" DROP DEFAULT;

-- AlterTable
ALTER TABLE "project" ALTER COLUMN "uuid" DROP DEFAULT;

-- AlterTable
ALTER TABLE "task" ALTER COLUMN "uuid" DROP DEFAULT;

-- CreateTable
CREATE TABLE "project_employee" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "project_id" BIGINT NOT NULL,
    "employee_id" BIGINT NOT NULL,

    CONSTRAINT "project_employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_employee" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "task_id" BIGINT NOT NULL,
    "employee_id" BIGINT NOT NULL,

    CONSTRAINT "task_employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_project_employee_project_id" ON "project_employee"("project_id");

-- CreateIndex
CREATE INDEX "idx_project_employee_employee_id" ON "project_employee"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_employee_project_id_employee_id_key" ON "project_employee"("project_id", "employee_id");

-- CreateIndex
CREATE INDEX "idx_task_employee_task_id" ON "task_employee"("task_id");

-- CreateIndex
CREATE INDEX "idx_task_employee_employee_id" ON "task_employee"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_employee_task_id_employee_id_key" ON "task_employee"("task_id", "employee_id");

-- CreateIndex
CREATE INDEX "idx_project_org_id" ON "project"("org_id");

-- CreateIndex
CREATE INDEX "idx_task_project_id" ON "task"("project_id");

-- AddForeignKey
ALTER TABLE "project_employee" ADD CONSTRAINT "project_employee_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_employee" ADD CONSTRAINT "project_employee_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task_employee" ADD CONSTRAINT "task_employee_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task_employee" ADD CONSTRAINT "task_employee_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
