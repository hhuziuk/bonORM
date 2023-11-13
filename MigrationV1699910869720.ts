import {QueryResult} from "pg";
import {MigrationInterface} from "./src/core/migrations/migrationInterface";
export class MigrationV1699910869720 implements MigrationInterface {
    migrationName = 'MigrationV1699910869720';
    public async up(query: QueryResult) {
        // Your migration logic
    }

    public async down(query: QueryResult) {
        // Your rollback logic
    }
}
  