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
    findOne(options: {
        where?: Record<string, any>;
    }): Promise<QueryResult>;
    create(object: Object): Promise<any>;
    save(object: Object): Promise<QueryResult>;
    delete(options: {
        where?: Record<string, any>;
    }): Promise<QueryResult>;
}