import { QueryResult } from "pg";
import { toolCommandsInterface } from "../tool-commands/tool-commands-interface";
export declare class Model implements toolCommandsInterface {
    private readonly tableName;
    private _columns;
    private _primaryColumn;
    constructor(tableName: string);
    private runQuery;
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
    create(data?: Record<string, any>): Promise<QueryResult>;
    save(): Promise<QueryResult>;
    delete(options: {
        where?: Record<string, string | object>;
    }): Promise<QueryResult>;
    createModel(): Promise<QueryResult>;
}
//# sourceMappingURL=createModel.d.ts.map