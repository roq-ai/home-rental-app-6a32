/*
  Warnings:

  - Added the required column `coords` to the `property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- create postgis extension
CREATE EXTENSION postgis;
ALTER TABLE "property" ADD COLUMN     "coords" geometry(Point, 4326) NOT NULL;

-- CreateIndex
CREATE INDEX "location_idx" ON "property" USING GIST ("coords");
