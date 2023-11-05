import {QueryResult} from "pg";

export interface toolCommandsInterface {
    find(options: {
        select?: string[];
        relations?: string[];
        where?: Record<string, any>;
        order?: Record<string, 'ASC' | 'DESC'>;
        skip?: number;
        take?: number;
    }): Promise<QueryResult>
    findOne(object: Object): Promise<any>;
    create(object: Object): Promise<any>;
    save(object: Object): Promise<QueryResult<any>>;
    deleteOne(object: Object): Promise<QueryResult<any>>;
    deleteAll(object: Object): Promise<QueryResult<any>>;
}