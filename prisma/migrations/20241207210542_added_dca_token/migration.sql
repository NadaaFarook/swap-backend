/*
  Warnings:

  - Added the required column `buyDcaToken` to the `Position` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellDcaToken` to the `Position` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "buyDcaToken" INTEGER NOT NULL,
ADD COLUMN     "sellDcaToken" INTEGER NOT NULL;
