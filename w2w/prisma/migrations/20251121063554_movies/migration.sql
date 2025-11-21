/*
  Warnings:

  - A unique constraint covering the columns `[wmId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `wmId` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "imdbId" TEXT,
ADD COLUMN     "tmdbId" INTEGER,
ADD COLUMN     "wmId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Movie_wmId_key" ON "Movie"("wmId");
