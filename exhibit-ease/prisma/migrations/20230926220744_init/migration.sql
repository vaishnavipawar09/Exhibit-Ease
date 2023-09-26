-- AlterTable
ALTER TABLE "User" ADD COLUMN     "museumId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "Museum"("id") ON DELETE SET NULL ON UPDATE CASCADE;
