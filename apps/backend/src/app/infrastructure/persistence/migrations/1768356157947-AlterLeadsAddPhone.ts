import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterLeadsAddPhone1768356157947 implements MigrationInterface {
  name = 'AlterLeadsAddPhone1768356157947';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leads" ADD "phone" character varying(20) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "phone"`);
  }
}
