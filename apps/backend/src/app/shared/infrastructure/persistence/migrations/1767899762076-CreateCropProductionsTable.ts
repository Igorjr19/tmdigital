import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCropProductionsTable1767899762076 implements MigrationInterface {
  name = 'CreateCropProductionsTable1767899762076';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "crop_productions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "rural_property_id" uuid NOT NULL, "culture_id" uuid NOT NULL, "planted_area" double precision NOT NULL, CONSTRAINT "PK_fff55b3b0727f718b2c8cf46c40" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "crop_productions" ADD CONSTRAINT "FK_f1ac79c4f6d84f00daef6df9888" FOREIGN KEY ("rural_property_id") REFERENCES "rural_properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crop_productions" ADD CONSTRAINT "FK_a916534763f287cca3f22fcfd48" FOREIGN KEY ("culture_id") REFERENCES "cultures"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "crop_productions" DROP CONSTRAINT "FK_a916534763f287cca3f22fcfd48"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crop_productions" DROP CONSTRAINT "FK_f1ac79c4f6d84f00daef6df9888"`,
    );
    await queryRunner.query(`DROP TABLE "crop_productions"`);
  }
}
