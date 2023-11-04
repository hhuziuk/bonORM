import {QueryResult} from "pg";

export interface toolCommandsInterface {
    find(): Promise<QueryResult<any>>;
    findOne(object: Object): Promise<any>;
    create(object: Object): Promise<any>;
    save(object: Object): Promise<QueryResult<any>>;
    deleteOne(object: Object): Promise<QueryResult<any>>;
    deleteAll(object: Object): Promise<QueryResult<any>>;
}