import { QueryResult } from "pg";
import { toolCommandsInterface } from "../tool-commands/tool-commands-interface";
export declare class Model implements toolCommandsInterface {
    private readonly tableName;
    constructor(tableName: string);
    static getModel<T extends Model>(tableName: string): Model;
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
}
//# sourceMappingURL=Model.d.ts.map