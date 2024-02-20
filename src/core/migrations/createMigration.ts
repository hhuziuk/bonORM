import fs from 'fs';
import * as path from "path";
import {MigrationInterface} from "./migrationInterface";
import {connection} from "../connection/connection";

export const generateMigration = (argv: any) => {
    const path = argv.path || '.';
    const fileName = `MigrationV${new Date().getTime()}`;
    const createFileName = `${path}/${fileName}.ts`;
    const migrationFile = `
import {MigrationInterface} from "bonorm"
export class ${fileName} implements MigrationInterface {
    migrationName = '${fileName}';
    public async up() {
        // Your migration logic
    }
    public async down() {
        // Your rollback logic
    }
}
export { ${fileName} as Migration };`;
    fs.writeFileSync(createFileName, migrationFile);
    console.log(`Migration ${createFileName} generated successfully.`);
};

export const runQuery = async (query: string) => {
    return await connection(query);
};

export const runMigration = async (argv: any) => {
    const MigrationModule = require(path.resolve(argv.path));
    const migration = new MigrationModule.Migration() as MigrationInterface;
    await migration.up();
};

export const rollbackMigration = async (argv: any) => {
    const MigrationModule = require(path.resolve(argv.path));
    const migration = new MigrationModule.Migration() as MigrationInterface;
    await migration.down();
};