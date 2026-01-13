import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCulturesAddPlantingMonths1768312082627 implements MigrationInterface {
  name = 'AlterCulturesAddPlantingMonths1768312082627';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cultures" ADD "planting_months" integer array NOT NULL DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cultures" DROP COLUMN "planting_months"`,
    );
  }
}
