import { QueryResult } from "pg";
import { ColumnData } from "../entities/Model";
export interface toolCommandsInterface {
    find(options: {
        select?: string[];
        relations?: string[];
        where?: Record<string, any>;
        order?: Record<string, 'ASC' | 'DESC'>;
        skip?: number;
        take?: number;
    }): Promise<QueryResult>;
    findOne(options: {
        where?: Record<string, any>;
    }): Promise<QueryResult>;
    create(data: ColumnData, entityConstructor: any): Promise<QueryResult>;
    save(options: {
        where?: Record<string, any>;
        data?: Record<string, any>;
    }): Promise<QueryResult>;
    delete(options: {
        where?: Record<string, any>;
    }): Promise<QueryResult>;
}
//# sourceMappingURL=tool-commands-interface.d.ts.map