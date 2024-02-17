class dbError extends Error {
    constructor(message?: string, readonly errors: any[] = []){
        super(message);
        Object.setPrototypeOf(this, dbError.prototype);
    }

    static ExistingDataError(values: any[]){
        throw new dbError(`${values} already exists in database`);
    }
    static ConnectionError(){
        throw new dbError(`Can not connect to database`);
    }
    static QueryError(message: string[]){
        throw new dbError(`Error doing query: ${message}`);
    }
    static DbTypeError(){
        throw new dbError(`Unsupported database type`);
    }
    static EmptyQuery(){
        throw new dbError(`No data for insertion`);
    }
    static InvalidFormat(message: string[] | string){ // for validators
        throw new dbError(`Invalid Format: ${message}`);
    }
}
export default dbError;