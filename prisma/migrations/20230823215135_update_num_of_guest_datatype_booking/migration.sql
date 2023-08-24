/*
  Warnings:

  - The `num_of_guest` column on the `booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "booking" DROP COLUMN "num_of_guest",
ADD COLUMN     "num_of_guest" INTEGER;
