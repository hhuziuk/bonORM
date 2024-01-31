import { QueryResult } from "pg";
export interface toolCommandsInterface {
    find(options: {
        select?: string[];
        relations?: string[];
        where?: Record<string, string | object>;
        order?: Record<string, 'ASC' | 'DESC'>;
        skip?: number;
        take?: number;
    }): Promise<QueryResult>;
    findOne(options: {
        where?: Record<string, string | object>;
    }): Promise<QueryResult>;
    create(data?: Record<string, string | object>): Promise<QueryResult>;
    save(object: Object): Promise<QueryResult>;
    delete(options: {
        where?: Record<string, string | object>;
    }): Promise<QueryResult>;
}
//# sourceMappingURL=tool-commands-interface.d.ts.map