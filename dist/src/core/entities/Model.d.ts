import { QueryResult } from "pg";
import { toolCommandsInterface } from "../tool-commands/tool-commands-interface";
export interface ColumnData {
    [columnName: string]: any;
}
export declare class Model implements toolCommandsInterface {
    private readonly tableName;
    constructor(tableName: string);
    private runQuery;
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
    private validateData;
    save(): Promise<QueryResult>;
    delete(options: {
        where?: Record<string, any>;
    }): Promise<QueryResult>;
}
//# sourceMappingURL=Model.d.ts.map