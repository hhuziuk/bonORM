import { QueryResult } from "pg";
import { pgConfig } from "../../../../../../configs/pgConfig";
import { toolCommandsInterface } from "../tool-commands/tool-commands-interface";
import dbError from "../errors/dbError";
import {validate} from "class-validator";
import {pgDataType} from "../data-types/PgDataTypes";
import {mySqlDataType} from "../data-types/MySqlDataTypes";

const columnsMetadataKey = "columns";

export class Model implements toolCommandsInterface {
    private readonly tableName: string;

    public constructor(tableName: string) {
        this.tableName = tableName;
    }

    static getModel<T extends Model>(tableName: string){
        if (!tableName)
            throw new Error(`Table name is not set for this model.`);
        return new this(tableName);
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
            throw err; // Rethrow the error after handling
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
        let query = `SELECT ${options.select?.join(', ') || '*'} FROM ${this.tableName}`;

        if (options.relations && options.relations.length > 0) {
            query += ` LEFT JOIN ${options.relations.join(" LEFT JOIN ")}`;
        }

        if (options.where && Object.keys(options.where).length > 0) {
            query += ` WHERE ${Object.entries(options.where)
                .map(([key, value]) => typeof value === 'string' ? `${key} = '${value}'` : `${key} = ${value}`)
                .join(" AND ")}`;
        }

        if (options.order && Object.keys(options.order).length > 0) {
            query += ` ORDER BY ${Object.entries(options.order)
                .map(([key, value]) => `${key} ${value}`)
                .join(", ")}`;
        }

        if (options.skip !== undefined && options.take !== undefined) {
            query += ` OFFSET ${options.skip} LIMIT ${options.take}`;
        } else if (options.skip !== undefined) {
            query += ` OFFSET ${options.skip}`;
        } else if (options.take !== undefined) {
            query += ` LIMIT ${options.take}`;
        }

        return this.runQuery(query);
    }

    async findOne(options: {
        where?: Record<string, any>;
    }): Promise<QueryResult> {
        let query = `SELECT * FROM ${this.tableName}`;

        if (options.where && Object.keys(options.where).length > 0) {
            query += ` WHERE ${Object.entries(options.where)
                .map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : value}`)
                .join(" AND ")}`;
        }

        return this.runQuery(query);
    }
    async create(data: Record<string, any>): Promise<QueryResult> {
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
        let query = `DELETE FROM ${this.tableName}`;

        if (options.where && Object.keys(options.where).length > 0) {
            query += ` WHERE ${Object.entries(options.where)
                .map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : value}`)
                .join(" AND ")}`;
        }

        return this.runQuery(query);
    }
}