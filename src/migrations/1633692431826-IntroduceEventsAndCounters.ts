import {MigrationInterface, QueryRunner} from "typeorm";

export class IntroduceEventsAndCounters1633692431826 implements MigrationInterface {
    name = 'IntroduceEventsAndCounters1633692431826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tracker_event" ("id" SERIAL NOT NULL, "timestamp" integer NOT NULL, "name" character varying NOT NULL, "trackerId" integer, CONSTRAINT "PK_43031b6e8f9bc7ffca450706b09" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tracker_event_counter" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "value" real, "trackerEventId" integer, CONSTRAINT "PK_d32e83b3b2c384fc22b7fd4fb62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tracker_event" ADD CONSTRAINT "FK_d2803abdc28a422db6218c69347" FOREIGN KEY ("trackerId") REFERENCES "tracker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracker_event_counter" ADD CONSTRAINT "FK_66c5c763dee5a41039e596a392d" FOREIGN KEY ("trackerEventId") REFERENCES "tracker_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tracker_event_counter" DROP CONSTRAINT "FK_66c5c763dee5a41039e596a392d"`);
        await queryRunner.query(`ALTER TABLE "tracker_event" DROP CONSTRAINT "FK_d2803abdc28a422db6218c69347"`);
        await queryRunner.query(`DROP TABLE "tracker_event_counter"`);
        await queryRunner.query(`DROP TABLE "tracker_event"`);
    }

}
