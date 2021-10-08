import {MigrationInterface, QueryRunner} from "typeorm";

export class IntroduceTrackerModel1633690620074 implements MigrationInterface {
    name = 'IntroduceTrackerModel1633690620074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tracker" ("id" SERIAL NOT NULL, CONSTRAINT "PK_83bc756baca3e744e999194bd51" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tracker"`);
    }

}
