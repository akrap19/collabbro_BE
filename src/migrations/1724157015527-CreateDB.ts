import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDB1724157015527 implements MigrationInterface {
    name = 'CreateDB1724157015527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_848ddf671a6e57bd176a6043fb\` ON \`goal\``);
        await queryRunner.query(`ALTER TABLE \`goal\` DROP COLUMN \`goal_content\``);
        await queryRunner.query(`ALTER TABLE \`goal\` ADD \`goal_content\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`goal\` ADD UNIQUE INDEX \`IDX_848ddf671a6e57bd176a6043fb\` (\`goal_content\`)`);
        await queryRunner.query(`ALTER TABLE \`payment\` CHANGE \`amount\` \`amount\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`project\` CHANGE \`total_amount\` \`total_amount\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_goal\` ADD CONSTRAINT \`FK_84923b14c9cd0c4a1e82cae006f\` FOREIGN KEY (\`goal_id\`) REFERENCES \`goal\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`media\` ADD CONSTRAINT \`FK_3b04975a9ded3f70ba7ae971019\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`collaboration\` ADD CONSTRAINT \`FK_50dddbd3771115fdd210ac4f054\` FOREIGN KEY (\`owner_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`collaboration\` ADD CONSTRAINT \`FK_fd2a8f49a4923caef1947d06c5f\` FOREIGN KEY (\`collaborator_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`collaboration\` ADD CONSTRAINT \`FK_bced4da3ec7e8c2847541edb0fe\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_72acc8fe5f180af16ae74528b99\` FOREIGN KEY (\`collaboration_id\`) REFERENCES \`collaboration\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_5065290877a726db6049e3378d8\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_instrument\` ADD CONSTRAINT \`FK_aa53227fc011b71bd045cef2b4d\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_instrument\` ADD CONSTRAINT \`FK_9a6ccce00353c3d5f99af5a6a0b\` FOREIGN KEY (\`instrument_id\`) REFERENCES \`instrument\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_skill\` ADD CONSTRAINT \`FK_5cd863c74efd07556cdad17513c\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_skill\` ADD CONSTRAINT \`FK_68a9c8c148b1414d22d4e1712e0\` FOREIGN KEY (\`skill_id\`) REFERENCES \`skill\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_1cf56b10b23971cfd07e4fc6126\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`favorite_user\` ADD CONSTRAINT \`FK_123a4a0fdd22f7f11a346d35775\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`favorite_project\` ADD CONSTRAINT \`FK_440a405c638205acde4b8d0d91e\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`favorite_project\` ADD CONSTRAINT \`FK_863fcddbf4c9556aa9d165bcdad\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity\` ADD CONSTRAINT \`FK_10bf0c2dd4736190070e8475119\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_859ffc7f95098efb4d84d50c632\` FOREIGN KEY (\`chat_id\`) REFERENCES \`chat\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat_user\` ADD CONSTRAINT \`FK_c1b936340cd2724c49041115003\` FOREIGN KEY (\`chat_id\`) REFERENCES \`chat\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat_user\` ADD CONSTRAINT \`FK_c2d1ec937246fe834e099f4a159\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_skill\` ADD CONSTRAINT \`FK_e4ba866607554d86dc9c2a6c0e3\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_skill\` ADD CONSTRAINT \`FK_215460dc28b2f3cb6507c315eb3\` FOREIGN KEY (\`skill_id\`) REFERENCES \`skill\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_56023c91b76b36125acd4dcd9c5\` FOREIGN KEY (\`sender_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_90543bacf107cdd564e9b62cd20\` FOREIGN KEY (\`receiver_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_session\` ADD CONSTRAINT \`FK_13275383dcdf095ee29f2b3455a\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_session\` DROP FOREIGN KEY \`FK_13275383dcdf095ee29f2b3455a\``);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_90543bacf107cdd564e9b62cd20\``);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_56023c91b76b36125acd4dcd9c5\``);
        await queryRunner.query(`ALTER TABLE \`user_skill\` DROP FOREIGN KEY \`FK_215460dc28b2f3cb6507c315eb3\``);
        await queryRunner.query(`ALTER TABLE \`user_skill\` DROP FOREIGN KEY \`FK_e4ba866607554d86dc9c2a6c0e3\``);
        await queryRunner.query(`ALTER TABLE \`chat_user\` DROP FOREIGN KEY \`FK_c2d1ec937246fe834e099f4a159\``);
        await queryRunner.query(`ALTER TABLE \`chat_user\` DROP FOREIGN KEY \`FK_c1b936340cd2724c49041115003\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_859ffc7f95098efb4d84d50c632\``);
        await queryRunner.query(`ALTER TABLE \`activity\` DROP FOREIGN KEY \`FK_10bf0c2dd4736190070e8475119\``);
        await queryRunner.query(`ALTER TABLE \`favorite_project\` DROP FOREIGN KEY \`FK_863fcddbf4c9556aa9d165bcdad\``);
        await queryRunner.query(`ALTER TABLE \`favorite_project\` DROP FOREIGN KEY \`FK_440a405c638205acde4b8d0d91e\``);
        await queryRunner.query(`ALTER TABLE \`favorite_user\` DROP FOREIGN KEY \`FK_123a4a0fdd22f7f11a346d35775\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_1cf56b10b23971cfd07e4fc6126\``);
        await queryRunner.query(`ALTER TABLE \`project_skill\` DROP FOREIGN KEY \`FK_68a9c8c148b1414d22d4e1712e0\``);
        await queryRunner.query(`ALTER TABLE \`project_skill\` DROP FOREIGN KEY \`FK_5cd863c74efd07556cdad17513c\``);
        await queryRunner.query(`ALTER TABLE \`project_instrument\` DROP FOREIGN KEY \`FK_9a6ccce00353c3d5f99af5a6a0b\``);
        await queryRunner.query(`ALTER TABLE \`project_instrument\` DROP FOREIGN KEY \`FK_aa53227fc011b71bd045cef2b4d\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_5065290877a726db6049e3378d8\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_72acc8fe5f180af16ae74528b99\``);
        await queryRunner.query(`ALTER TABLE \`collaboration\` DROP FOREIGN KEY \`FK_bced4da3ec7e8c2847541edb0fe\``);
        await queryRunner.query(`ALTER TABLE \`collaboration\` DROP FOREIGN KEY \`FK_fd2a8f49a4923caef1947d06c5f\``);
        await queryRunner.query(`ALTER TABLE \`collaboration\` DROP FOREIGN KEY \`FK_50dddbd3771115fdd210ac4f054\``);
        await queryRunner.query(`ALTER TABLE \`media\` DROP FOREIGN KEY \`FK_3b04975a9ded3f70ba7ae971019\``);
        await queryRunner.query(`ALTER TABLE \`user_goal\` DROP FOREIGN KEY \`FK_84923b14c9cd0c4a1e82cae006f\``);
        await queryRunner.query(`ALTER TABLE \`project\` CHANGE \`total_amount\` \`total_amount\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` CHANGE \`amount\` \`amount\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`goal\` DROP INDEX \`IDX_848ddf671a6e57bd176a6043fb\``);
        await queryRunner.query(`ALTER TABLE \`goal\` DROP COLUMN \`goal_content\``);
        await queryRunner.query(`ALTER TABLE \`goal\` ADD \`goal_content\` varchar(20) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_848ddf671a6e57bd176a6043fb\` ON \`goal\` (\`goal_content\`)`);
    }

}
