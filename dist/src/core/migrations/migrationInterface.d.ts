import { QueryResult } from "pg";
export interface MigrationInterface {
    migrationName: string;
    up(query?: QueryResult): Promise<void>;
    down(query?: QueryResult): Promise<void>;
}
//# sourceMappingURL=migrationInterface.d.ts.map