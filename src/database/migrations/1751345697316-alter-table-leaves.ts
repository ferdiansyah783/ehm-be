import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableLeaves1751345697316 implements MigrationInterface {
    name = 'AlterTableLeaves1751345697316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`leaves\` DROP COLUMN \`startDate\``);
        await queryRunner.query(`ALTER TABLE \`leaves\` ADD \`startDate\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`leaves\` DROP COLUMN \`endDate\``);
        await queryRunner.query(`ALTER TABLE \`leaves\` ADD \`endDate\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`leaves\` DROP COLUMN \`endDate\``);
        await queryRunner.query(`ALTER TABLE \`leaves\` ADD \`endDate\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`leaves\` DROP COLUMN \`startDate\``);
        await queryRunner.query(`ALTER TABLE \`leaves\` ADD \`startDate\` datetime NULL`);
    }

}
