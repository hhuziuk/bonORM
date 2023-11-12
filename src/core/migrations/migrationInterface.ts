import {QueryResult} from "pg";

export interface MigrationInterface {
    migrationName: string;
    up(): Promise<void>;
    down(): Promise<void>;
}