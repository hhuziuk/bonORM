class dbError extends Error {
    constructor(message?: string, readonly errors: any[] = []){
        super(message);
        Object.setPrototypeOf(this, dbError.prototype);
    }

    static ExistingDataError(values: any[]){
        return new dbError(`${values} already exists in database`);
    }
    static ConnectionError(){
        return new dbError(`Can not connect to database`);
    }
}
export default dbError;