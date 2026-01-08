import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRuralPropertiesTable1767899721739 implements MigrationInterface {
  name = 'CreateRuralPropertiesTable1767899721739';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rural_properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "lead_id" uuid NOT NULL, "name" character varying(255) NOT NULL, "total_area_hectares" double precision NOT NULL, "productive_area_hectares" double precision NOT NULL, "location" geography(Point,4326) NOT NULL, "city" character varying(100) NOT NULL, "state" character varying(2) NOT NULL, CONSTRAINT "PK_056944d83040eaf2c1c4921eeec" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rural_properties" ADD CONSTRAINT "FK_1ccaa2ac83a36f2bd0973a96f6b" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rural_properties" DROP CONSTRAINT "FK_1ccaa2ac83a36f2bd0973a96f6b"`,
    );
    await queryRunner.query(`DROP TABLE "rural_properties"`);
  }
}
