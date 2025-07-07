-- AlterTable
ALTER TABLE "employee" ALTER COLUMN "last_name" DROP DEFAULT;

-- CreateTable
CREATE TABLE "session" (
    "id" BIGSERIAL NOT NULL,
    "start_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMPTZ(6),
    "task_id" BIGINT NOT NULL,
    "employee_id" BIGINT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_session_task_id" ON "session"("task_id");

-- CreateIndex
CREATE INDEX "idx_session_employee_id" ON "session"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_task_id_employee_id_key" ON "session"("task_id", "employee_id");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
