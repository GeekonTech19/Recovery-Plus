/*
  Warnings:

  - A unique constraint covering the columns `[postId,userId]` on the table `CommunityReaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CommunityReaction_postId_userId_emoji_key";

-- CreateIndex
CREATE UNIQUE INDEX "CommunityReaction_postId_userId_key" ON "CommunityReaction"("postId", "userId");
