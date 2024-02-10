import { MigrationInterface } from "./migrationInterface";
import { QueryResult } from "pg";
export declare class Migration implements MigrationInterface {
    migrationName: string;
    up(query: QueryResult): Promise<void>;
    down(query: QueryResult): Promise<void>;
}
//# sourceMappingURL=migration-test.d.ts.map