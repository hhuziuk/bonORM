import { QueryResult } from "pg";
import { pgConfig } from "../../configs/pgConfig";
import { toolCommandsInterface } from "../tool-commands/tool-commands-interface";
import * as querystring from "querystring";

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
            return res;
        } catch (err) {
            throw new Error(`Error doing query: ${err}`);
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
        let query: string = `SELECT ${options.select && options.select.length > 0 
            ? options.select.join(', ') 
                : '*'} FROM ${this.tableName}`;
        query += options.relations && options.relations.length > 0
            ? `LEFT JOIN ${options.relations.join(" LEFT JOIN ")}`
            : '';
        query += options.where && Object.keys(options.where).length > 0
            ? ` WHERE ${Object.keys(options.where).map(key => typeof options.where[key] === 'string' 
                ? `${key} = '${options.where[key]}'` 
                : `${key} = ${options.where[key]}`).join(" AND ")}`
            : "";
        query += options.order && Object.keys(options.order).length > 0
            ? ` ORDER BY ${Object.keys(options.order).map(key => `${key} ${options.order[key]}`).join(", ")}`
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
            ? ` WHERE ${Object.keys(options.where).map(key => typeof options.where[key] === 'string'
                ? `${key} = '${options.where[key]}'`
                : `${key} = ${options.where[key]}`).join(" AND ")}`
            : "";
        return this.runQuery(query);
    }

    async create(data?: Record<string, any>): Promise<QueryResult> {
        if(!data || Object.keys(data).length < 0){
            throw new Error("No data for insertion");
        }
        const columns = Object.keys(data).join(', ');
        const values = Object.values(data).map((value) => {
            if (typeof value === 'string') {
                return `'${value}'`;
            }
            return value;
        }).join(', ');
        const query: string = `INSERT INTO ${this.tableName} ($(columns)) VALUES (${values});`;
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
            ? ` WHERE ${Object.keys(options.where).map(key => typeof options.where[key] === 'string'
                ? `${key} = '${options.where[key]}'`
                : `${key} = ${options.where[key]}`).join(" AND ")}`
            : "";
        return this.runQuery(query);
    }

    async createModel(schema: any): Promise<QueryResult> {
        const { attributes, options } = schema;
        const columns = Object.keys(attributes).map((attribute) => {
            const { type, unique, allowNull, defaultValue, autoIncrement, primaryKey } = attributes[attribute];
            let columnDefinition: string = `${attribute} ${type.key}`;
            unique ? (columnDefinition += " UNIQUE") : "";
            !allowNull ? (columnDefinition += " NOT NULL") : "";
            defaultValue ? (columnDefinition += ` DEFAULT ${defaultValue}`) : "";
            primaryKey ? (columnDefinition += " PRIMARY KEY") : "";
            autoIncrement ? (columnDefinition += " SERIAL") : "";
            return columnDefinition;
        });
        let query: string = `CREATE TABLE IF NOT EXISTS ${this.tableName} (${columns.join(", ")});`;
        return this.runQuery(query);
    }
}