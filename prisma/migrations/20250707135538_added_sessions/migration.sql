-- CreateTable
CREATE TABLE "session_image" (
    "id" BIGSERIAL NOT NULL,
    "session_id" BIGINT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "session_image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "session_image" ADD CONSTRAINT "session_image_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
