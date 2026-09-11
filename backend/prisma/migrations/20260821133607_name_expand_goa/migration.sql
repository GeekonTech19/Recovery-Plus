-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'General',
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "target" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "trackingType" TEXT;

-- CreateIndex
CREATE INDEX "Goal_trackingType_idx" ON "Goal"("trackingType");
