import {MigrationInterface, QueryRunner} from "typeorm";

export class IntroduceTrackerEvent1633732193718 implements MigrationInterface {
    name = 'IntroduceTrackerEvent1633732193718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tracker_event" ("id" SERIAL NOT NULL, "timestamp" character varying NOT NULL, "name" character varying NOT NULL, "value" real, "trackerId" integer, CONSTRAINT "PK_43031b6e8f9bc7ffca450706b09" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tracker_event" ADD CONSTRAINT "FK_d2803abdc28a422db6218c69347" FOREIGN KEY ("trackerId") REFERENCES "tracker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tracker_event" DROP CONSTRAINT "FK_d2803abdc28a422db6218c69347"`);
        await queryRunner.query(`DROP TABLE "tracker_event"`);
    }

}
