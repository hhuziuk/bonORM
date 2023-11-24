
import {QueryResult} from "pg";
export class MigrationV1700836403301 implements MigrationInterface {
    migrationName = 'MigrationV1700836403301';
    public async up(query: QueryResult) {
        // Your migration logic
    }
    public async down(query: QueryResult) {
        // Your rollback logic
    }
}
export { MigrationV1700836403301 as Migration };