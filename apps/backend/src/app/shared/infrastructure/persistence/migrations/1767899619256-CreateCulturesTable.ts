import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCulturesTable1767899619256 implements MigrationInterface {
  name = 'CreateCulturesTable1767899619256';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cultures" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "current_price" numeric(10,2) NOT NULL, CONSTRAINT "UQ_ac6c6a5cf0fcf751c184e044bcd" UNIQUE ("name"), CONSTRAINT "PK_1d1e898d879d22c4a3c25e4d9e5" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cultures"`);
  }
}
