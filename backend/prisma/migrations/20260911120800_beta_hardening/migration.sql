ALTER TABLE "DailyCheckIn" ADD COLUMN "recoveryDate" TEXT;
UPDATE "DailyCheckIn" c SET "recoveryDate" = to_char(c."date" AT TIME ZONE COALESCE(NULLIF(u."timezone", ''), 'UTC'), 'YYYY-MM-DD') FROM "User" u WHERE u."id" = c."userId";
ALTER TABLE "DailyCheckIn" ALTER COLUMN "recoveryDate" SET NOT NULL;
CREATE UNIQUE INDEX "DailyCheckIn_userId_recoveryDate_key" ON "DailyCheckIn"("userId", "recoveryDate");
CREATE INDEX "DailyCheckIn_recoveryDate_idx" ON "DailyCheckIn"("recoveryDate");
CREATE UNIQUE INDEX "Achievement_userId_badge_key" ON "Achievement"("userId", "badge");
