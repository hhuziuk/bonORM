import { QueryResult } from "pg";
import { toolCommandsInterface } from "../tool-commands/tool-commands-interface";
import { dataType } from "../data-types/PgDataTypes";
export interface ColumnOptions {
    type?: dataType;
    unique?: boolean;
    allowNull?: boolean;
    defaultValue?: string | number;
    autoIncrement?: boolean;
}
export interface PrimaryGeneratedColumnOptions extends ColumnOptions {
    autoIncrement?: boolean;
}
export declare function PrimaryGeneratedColumn(options?: PrimaryGeneratedColumnOptions): PropertyDecorator;
export declare function Column(options?: ColumnOptions): PropertyDecorator;
export declare function Entity(tableName: string): ClassDecorator;
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
}
//# sourceMappingURL=createModel.d.ts.map