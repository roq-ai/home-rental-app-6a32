/*
  Warnings:

  - Added the required column `num_of_baths` to the `property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `num_of_beds` to the `property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `num_of_guest` to the `property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "property" ADD COLUMN     "num_of_baths" VARCHAR(255) NOT NULL,
ADD COLUMN     "num_of_beds" VARCHAR(255) NOT NULL,
ADD COLUMN     "num_of_guest" VARCHAR(255) NOT NULL,
ADD COLUMN     "price" VARCHAR(255) NOT NULL;
