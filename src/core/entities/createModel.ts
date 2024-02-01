import { QueryResult } from "pg";
import { pgConfig } from "../../../../../../configs/pgConfig";
import { toolCommandsInterface } from "../tool-commands/tool-commands-interface";
import dbError from "../errors/dbError";
import * as console from "console";

interface ColumnOptions {
    type?: string;
    unique?: boolean;
    allowNull?: boolean;
    defaultValue?: string | number;
    autoIncrement?: boolean;
    primaryKey?: boolean;
}

export function Column(options: ColumnOptions = {}): PropertyDecorator {
    return function (target: any, key: string) {
        const columns = target._columns || {};
        columns[key] = options;
        target._columns = columns;
    };
}

export function Entity(tableName: string): ClassDecorator {
    return function (target: any) {
        target.prototype._tableName = tableName;

        target.prototype.createModel = async function (): Promise<QueryResult> {
            const columns = Object.keys(this._columns).map(attribute => {
                const { type, unique, allowNull, defaultValue, autoIncrement, primaryKey } = this._columns[attribute];
                if (!type) {
                    dbError.QueryError(`Type for attribute ${attribute} is undefined.`);
                }
                let columnDefinition: string = `${attribute} ${type}`;
                columnDefinition += (unique) ? " UNIQUE" : "";
                columnDefinition += (!allowNull) ? " NOT NULL" : "";
                if (defaultValue) {
                    (typeof defaultValue === 'string') ? columnDefinition += ` DEFAULT '${defaultValue}'` : columnDefinition += ` DEFAULT ${defaultValue}`;
                }
                columnDefinition += (primaryKey) ? " PRIMARY KEY" : "";
                columnDefinition += (autoIncrement && type === 'INTEGER') ? " GENERATED ALWAYS AS IDENTITY" : "";
                return columnDefinition;
            });

            let query: string = `CREATE TABLE IF NOT EXISTS ${this._tableName} (${columns.join(",")});`;
            return this.runQuery(query);
        };

        const instance = new target();
        instance.createModel();
    };
}

export function PrimaryGeneratedColumn(): PropertyDecorator {
    return function (target: any, key: string) {
        target._primaryColumn = key;
    };
}

export class Model implements toolCommandsInterface {
    private readonly tableName: string;
    private _columns: Record<string, ColumnOptions> = {};
    private _primaryColumn: string;

    public constructor(tableName: string) {
        this.tableName = tableName;
    }

    private async runQuery(query: string): Promise<QueryResult> {
        try {
            const client = await pgConfig.connect();
            const res: QueryResult = await client.query(query);
            client.release();
            console.log("connected to database");
            return res;
        } catch (err) {
            dbError.QueryError(err);
        }
    }

    async find(options: {
        select?: string[];
        relations?: string[];
        where?: Record<string, string | object>;
        order?: Record<string, 'ASC' | 'DESC'>;
        skip?: number;
        take?: number;
    }): Promise<QueryResult> {

        let query: string;

        if(options.select && options.select.length > 0){
            query = `SELECT ${options.select.join(', ')} FROM ${this.tableName}`;
        } else {
            query = `SELECT * FROM ${this.tableName}`;
        }

        if(options.relations && options.relations.length > 0){
            query += ` LEFT JOIN ${options.relations.join(" LEFT JOIN ")}`;
        } else {
            query += '';
        }

        if(options.where && Object.keys(options.where).length > 0){
            query += ` WHERE ${Object.keys(options.where)
                .map(key => typeof options.where[key] === 'string' ? `${key} = '${options.where[key]}'` : `${key} = ${options.where[key]}`)
                .join(" AND ")}`;
        }

        if(options.order && Object.keys(options.order).length > 0) {
            query += ` ORDER BY ${Object.keys(options.order)
                .map(key => `${key} ${options.order[key]}`)
                .join(", ")}`;
        }

        if((options.skip && options.take) ){
            query += ` OFFSET ${options.skip} LIMIT ${options.take}`;
        } else if(options.skip) {
            query += ` OFFSET ${options.skip}`;
        } else if(options.take) {
            query += ` LIMIT ${options.take}`;
        }

        return this.runQuery(query);
    }

    async findOne(options: {
        where?: Record<string, string | object>;
    }): Promise<QueryResult> {

        let query = `SELECT * FROM ${this.tableName}`;
        if(options.where && Object.keys(options.where).length > 0){
            ` WHERE ${Object.keys(options.where)
                .map(function (key) {
                    if(typeof options.where[key] === 'string'){
                        `${key} = '${options.where[key]}'`
                    } else {
                        `${key} = ${options.where[key]}`
                    }
                })
                .join(" AND ")}`
        } else {
            query += "";
        }
        return this.runQuery(query);
    }

    async create(data?: Record<string, any>): Promise<QueryResult> {
        if (!data || Object.keys(data).length < 0) {
            dbError.EmptyQuery();
        }

        const checkQuery = `SELECT * FROM ${this.tableName} WHERE name = '${data.name}'`;
        const checkQueryResult = await this.runQuery(checkQuery);
        if (checkQueryResult.rows.length > 0) {
            dbError.ExistingDataError(data.name);
        }
        const columns = Object.keys(data).join(', ');
        const values = Object.values(data)
            .map(value => {
                if (typeof value === 'string') {
                    return `'${value}'`;
                }
                return value;
            })
            .join(', ');
        const query: string = `INSERT INTO ${this.tableName} (${columns}) VALUES (${values});`;
        return this.runQuery(query);
    }

    async save(): Promise<QueryResult> {
        let query: string = `UPDATE ${this.tableName} SET $;`;
        return this.runQuery(query);
    }

    async delete(options: {
        where?: Record<string, string | object>;
    }): Promise<QueryResult> {
        let query: string = `DELETE FROM ${this.tableName}`;
        if (options.where && Object.keys(options.where).length > 0) {
            query += " WHERE " + Object.keys(options.where)
                .map(function (key) {
                    if (typeof options.where[key] === 'string') {
                        return key + " = '" + options.where[key] + "'";
                    } else {
                        return key + " = " + options.where[key];
                    }
                })
                .join(" AND ");
        } else {
            query += "";
        }
        return this.runQuery(query);
    }
}