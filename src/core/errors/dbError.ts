class dbError extends Error {
    constructor(message?: string, readonly errors: any[] = []){
        super(message);
        Object.setPrototypeOf(this, dbError.prototype);
    }
}
export default dbError;