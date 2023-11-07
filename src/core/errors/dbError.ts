class dbError extends Error {
    constructor(message?: string, readonly errors: any[] = []){
        super(message);
        Object.setPrototypeOf(this, dbError.prototype);
    }

    static ExistingData(values: any[]){
        return new dbError(`${values} already exists in database`);
    }
}
export default dbError;