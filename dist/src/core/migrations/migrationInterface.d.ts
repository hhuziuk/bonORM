export interface MigrationInterface {
    migrationName: string;
    up(): Promise<void>;
    down(): Promise<void>;
}
//# sourceMappingURL=migrationInterface.d.ts.map