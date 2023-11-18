
import {QueryResult} from "pg";
import {MigrationInterface} from "../migrations/migrationInterface";
export class MigrationV1700340410907 implements MigrationInterface {
    migrationName = 'MigrationV1700340410907';
    public async up(query: QueryResult) {
        // Your migration logic
    }
    public async down(query: QueryResult) {
        // Your rollback logic
    }
}
export { MigrationV1700340410907 as Migration };