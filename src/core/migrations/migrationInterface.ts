export interface MigrationInterface {
    migrationName: string;
    up(): Promise<void>;
    down(): Promise<void>;
}