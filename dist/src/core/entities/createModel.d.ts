import { QueryResult } from "pg";
import { toolCommandsInterface } from "../tool-commands/tool-commands-interface";
import "reflect-metadata";
export declare function PrimaryGeneratedColumn(): PropertyDecorator;
export declare function Column(options?: any): PropertyDecorator;
export declare function Entity(tableName: string): ClassDecorator;
export declare class Model implements toolCommandsInterface {
    private readonly tableName;
    private readonly columns;
    constructor(tableName: string);
    private createModel;
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
//# sourceMappingURL=createModel.d.ts.map