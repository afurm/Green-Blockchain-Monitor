/*
  Warnings:

  - You are about to drop the column `feedback` on the `InsightFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `InsightFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `InsightFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `customGoals` on the `LearningGoals` table. All the data in the column will be lost.
  - You are about to drop the column `emissions` on the `LearningGoals` table. All the data in the column will be lost.
  - You are about to drop the column `energyEfficiency` on the `LearningGoals` table. All the data in the column will be lost.
  - You are about to drop the column `transactionSpeed` on the `LearningGoals` table. All the data in the column will be lost.
  - You are about to drop the column `selectedChains` on the `UserPreferences` table. All the data in the column will be lost.
  - You are about to drop the `Blockchain` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EnergyMetric` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PreprocessingLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RawData` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `blockchains` to the `UserPreferences` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `EnergyMetric` DROP FOREIGN KEY `EnergyMetric_blockchainId_fkey`;

-- DropForeignKey
ALTER TABLE `RawData` DROP FOREIGN KEY `RawData_blockchainId_fkey`;

-- AlterTable
ALTER TABLE `InsightFeedback` DROP COLUMN `feedback`,
    DROP COLUMN `type`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `LearningGoals` DROP COLUMN `customGoals`,
    DROP COLUMN `emissions`,
    DROP COLUMN `energyEfficiency`,
    DROP COLUMN `transactionSpeed`,
    ADD COLUMN `emissionsPriority` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `energyEfficiencyPriority` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `transactionSpeedPriority` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `UserPreferences` DROP COLUMN `selectedChains`,
    ADD COLUMN `blockchains` JSON NOT NULL,
    MODIFY `alertThresholds` JSON NULL;

-- DropTable
DROP TABLE `Blockchain`;

-- DropTable
DROP TABLE `EnergyMetric`;

-- DropTable
DROP TABLE `PreprocessingLog`;

-- DropTable
DROP TABLE `RawData`;

-- CreateTable
CREATE TABLE `BlockchainMetric` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `blockchain` VARCHAR(191) NOT NULL,
    `energyUsageKwh` DOUBLE NOT NULL,
    `emissionsKgCo2` DOUBLE NOT NULL,
    `transactionCount` INTEGER NOT NULL,
    `blockNumber` INTEGER NOT NULL,
    `gasUsed` INTEGER NOT NULL,
    `avgGasPrice` DOUBLE NOT NULL,

    INDEX `BlockchainMetric_timestamp_idx`(`timestamp`),
    INDEX `BlockchainMetric_blockchain_idx`(`blockchain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `InsightFeedback_insightId_idx` ON `InsightFeedback`(`insightId`);

-- RenameIndex
ALTER TABLE `InsightFeedback` RENAME INDEX `InsightFeedback_userId_fkey` TO `InsightFeedback_userId_idx`;
