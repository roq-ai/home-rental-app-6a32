/*
  Warnings:

  - Added the required column `latitude` to the `property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longtitude` to the `property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "property" ADD COLUMN     "latitude" VARCHAR(255) NOT NULL,
ADD COLUMN     "longtitude" VARCHAR(255) NOT NULL;
