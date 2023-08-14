/*
  Warnings:

  - Added the required column `num_of_guest` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `num_of_night` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "num_of_guest" VARCHAR(255) NOT NULL,
ADD COLUMN     "num_of_night" VARCHAR(255) NOT NULL,
ADD COLUMN     "total_price" VARCHAR(255) NOT NULL;
