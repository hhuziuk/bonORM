"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class dbError extends Error {
    constructor(message, errors = []) {
        super(message);
        this.errors = errors;
        Object.setPrototypeOf(this, dbError.prototype);
    }
    static ExistingDataError(values) {
        throw new dbError(`${values} already exists in database`);
    }
    static ConnectionError() {
        throw new dbError(`Can not connect to database`);
    }
    static EmptyError() {
        throw new dbError(`Data cannot be empty.`);
    }
    static QueryError(message) {
        throw new dbError(`Error doing query: ${message}`);
    }
    static DbTypeError() {
        throw new dbError(`Unsupported database type`);
    }
    static EmptyQuery() {
        throw new dbError(`No data for insertion`);
    }
    static InvalidFormat() {
        throw new dbError(`Invalid Format`);
    }
}
exports.default = dbError;
