/*
  Warnings:

  - You are about to drop the column `longtitude` on the `property` table. All the data in the column will be lost.
  - Added the required column `longitude` to the `property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "property" DROP COLUMN "longtitude",
ADD COLUMN     "longitude" VARCHAR(255) NOT NULL;
