declare class dbError extends Error {
    readonly errors: any[];
    constructor(message?: string, errors?: any[]);
    static ExistingDataError(values: any[]): void;
    static ConnectionError(): void;
    static QueryError(message: string[]): void;
    static DbTypeError(): void;
    static EmptyQuery(): void;
    static InvalidFormat(): void;
}
export default dbError;
//# sourceMappingURL=dbError.d.ts.map