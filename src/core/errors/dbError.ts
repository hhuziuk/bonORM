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
    static QueryError(message: any[] | string){
        throw new dbError(`Error doing query: ${message}`);
    }
    static EmptyQuery(){
        throw new dbError(`No data for insertion`);
    }
}
export default dbError;