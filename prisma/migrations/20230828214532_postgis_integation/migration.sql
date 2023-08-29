-- create postgis extension
CREATE EXTENSION postgis;

-- AlterTable
ALTER TABLE "property" ADD COLUMN     "coords" geometry(Point, 4326);

-- CreateIndex
CREATE INDEX "location_idx" ON "property" USING GIST ("coords");
