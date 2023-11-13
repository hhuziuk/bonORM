import { Migration } from "./migration-test";
import fs from 'fs';

export const generateMigration = (argv: any) => {
    const path = argv.path || '.';
    const createFileName = `${path}/MigrationV${new Date().getTime()}.ts`;
    const migrationFile = `
    import {MigrationInterface} from "./migrationInterface";
    import {QueryResult} from "pg";
    export class ${createFileName.replace('.ts', '')} implements MigrationInterface {
      migrationName = '${createFileName.replace('.ts', '')}';
      public async up(query: QueryResult) {
        // Your migration logic
      }

      public async down(query: QueryResult) {
        // Your rollback logic
      }
    }
  `;
    fs.writeFileSync(createFileName, migrationFile);
    console.log(`Migration ${createFileName} generated successfully.`);
};

export const runMigration = async (name: string) => {
    const migrationModule = require(`./${name}`);
    const migration = new Migration[name]();
    await migration.up();
};

export const rollbackMigration = async (name: string) => {
    const migrationModule = require(`./${name}`);
    const migration = new Migration[name]();
    await migration.down();
};
