import { QueryResult } from "pg";
import { pgConfig } from "../../../../../configs/pgConfig";
import { toolCommandsInterface } from "../tool-commands/tool-commands-interface";
import dbError from "../errors/dbError";
import * as console from "console";

export class Model implements toolCommandsInterface {
    private readonly tableName: string;

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
        where?: Record<string, any>;
        order?: Record<string, 'ASC' | 'DESC'>;
        skip?: number;
        take?: number;
    }): Promise<QueryResult> {
        let query: string = `SELECT ${
                options.select && options.select.length > 0
                        ? options.select.join(', ')
                        : '*'
        } FROM ${this.tableName}`;
        query += options.relations && options.relations.length > 0
            ? ` LEFT JOIN ${options.relations.join(" LEFT JOIN ")}`
            : '';
        query += options.where && Object.keys(options.where).length > 0
            ? ` WHERE ${Object.keys(options.where)
                .map(
                    key =>
                        typeof options.where[key] === 'string'
                            ? `${key} = '${options.where[key]}'`
                            : `${key} = ${options.where[key]}`
                )
                .join(" AND ")}`
            : "";
        query += options.order && Object.keys(options.order).length > 0
            ? ` ORDER BY ${Object.keys(options.order)
                .map(key => `${key} ${options.order[key]}`)
                .join(", ")}`
            : "";
        query += options.skip && options.take
            ? ` OFFSET ${options.skip} LIMIT ${options.take}`
            : options.skip
                ? ` OFFSET ${options.skip}`
                : options.take
                    ? ` LIMIT ${options.take}`
                    : "";

        return this.runQuery(query);
    }

    async findOne(options: {
        where?: Record<string, any>;
    }): Promise<QueryResult> {
        let query = `SELECT * FROM ${this.tableName}`;
        query += options.where && Object.keys(options.where).length > 0
            ? ` WHERE ${Object.keys(options.where)
                .map(
                    key =>
                        typeof options.where[key] === 'string'
                            ? `${key} = '${options.where[key]}'`
                            : `${key} = ${options.where[key]}`
                )
                .join(" AND ")}`
            : "";
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
        where?: Record<string, any>;
    }): Promise<QueryResult> {
        let query: string = `DELETE FROM ${this.tableName}`;
        query += options.where && Object.keys(options.where).length > 0
            ? ` WHERE ${Object.keys(options.where)
                .map(
                    key =>
                        typeof options.where[key] === 'string'
                            ? `${key} = '${options.where[key]}'`
                            : `${key} = ${options.where[key]}`
                )
                .join(" AND ")}`
            : "";
        return this.runQuery(query);
    }

    createModel(schema: any): Promise<QueryResult> {
        const { attributes, options } = schema;
        const columns = Object.keys(attributes).map(attribute => {
            const { type, unique, allowNull, defaultValue, autoIncrement, primaryKey } = attributes[attribute];
            if (!type) {
                dbError.QueryError(`Type for attribute ${attribute} is undefined.`);
            }
            let columnDefinition: string = `${attribute} ${type}`;
            if (unique) columnDefinition += " UNIQUE";
            if (!allowNull) columnDefinition += " NOT NULL";
            if (defaultValue) {
                (typeof defaultValue === 'string') ? columnDefinition += ` DEFAULT '${defaultValue}'` : columnDefinition += ` DEFAULT ${defaultValue}`;
            }
            if (primaryKey) columnDefinition += " PRIMARY KEY";
            if (autoIncrement && type === 'INTEGER') {
                columnDefinition += " GENERATED ALWAYS AS IDENTITY";
            }
            return columnDefinition;
        });
        let query: string = `CREATE TABLE IF NOT EXISTS ${this.tableName} (${columns.join(", ")});`;
        return this.runQuery(query);
    }
}