declare class dbError extends Error {
    readonly errors: any[];
    constructor(message?: string, errors?: any[]);
    static ExistingDataError(values: any[]): void;
    static ConnectionError(): void;
    static QueryError(message: any[] | string): void;
    static EmptyQuery(): void;
}
export default dbError;
//# sourceMappingURL=dbError.d.ts.map