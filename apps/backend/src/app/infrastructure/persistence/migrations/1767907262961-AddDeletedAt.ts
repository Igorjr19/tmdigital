import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedAt1767907262961 implements MigrationInterface {
  name = 'AddDeletedAt1767907262961';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "leads" ADD "deleted_at" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "rural_properties" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "cultures" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "crop_productions" ADD "deleted_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "crop_productions" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(`ALTER TABLE "cultures" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "rural_properties" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "deleted_at"`);
  }
}
