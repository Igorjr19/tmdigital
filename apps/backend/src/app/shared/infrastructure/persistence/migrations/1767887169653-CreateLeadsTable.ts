import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLeadsTable1767887169653 implements MigrationInterface {
  name = 'CreateLeadsTable1767887169653';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."leads_status_enum" AS ENUM(
       'NEW',
       'CONTACTED',
       'QUALIFIED',
       'CONVERTED',
       'LOST'
      )`,
    );

    await queryRunner.query(`CREATE TABLE "leads" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "name" character varying(255) NOT NULL,
            "document" character varying(14) NOT NULL,
            "current_supplier" character varying(255),
            "status" "leads_status_enum" NOT NULL DEFAULT 'NEW',
            "estimated_potential" numeric(18, 2) NOT NULL DEFAULT '0',
            "notes" text,
            CONSTRAINT "UQ_45c50d9750e3419b29564449321" UNIQUE ("document"),
            CONSTRAINT "PK_cd102ed7a9a4ca7d4d8bfeba406" PRIMARY KEY ("id")
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "leads"`);
    await queryRunner.query(`DROP TYPE "public"."leads_status_enum"`);
  }
}
