import { QueryResult } from "pg";
import { toolCommandsInterface } from "../tool-commands/tool-commands-interface";
import dbError from "../errors/dbError";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import {connection} from "../connection/connection";

export interface ColumnData {
    [columnName: string]: any;
}

export class Model implements toolCommandsInterface {
    private readonly tableName: string;

    public constructor(tableName: string) {
        this.tableName = tableName;
    }
    private async runQuery(query: string): Promise<QueryResult> {
        return await connection(query);
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

    async create(data: ColumnData, entityConstructor: any): Promise<QueryResult> {
        if (!data || Object.keys(data).length === 0) {
            dbError.EmptyQuery();
        }

        const { id, ...restData } = data;
        const columns = Object.keys(restData).join(', ');
        const values = Object.values(restData)
            .map(value => typeof value === 'string' ? `'${value}'` : value)
            .join(', ');

        const query: string = `INSERT INTO ${this.tableName} (${columns}) VALUES (${values});`;

        const errors = await this.validateData(data, entityConstructor);
        if (errors.length > 0) {
            dbError.QueryError(errors);
        }

        return this.runQuery(query);
    }

    private async validateData(data: ColumnData, entityConstructor: any): Promise<string[]> {
        const errors: string[] = [];

        if (typeof data === 'object' && data !== null) {
            const entity = plainToClass(entityConstructor, data);
            const validationErrors = await validate(entity as object);

            for (const error of validationErrors) {
                for (const constraint of Object.values(error.constraints)) {
                    errors.push(`Validation error for property ${error.property}: ${constraint}`);
                }
            }
        } else {
            errors.push('Data must be an object');
        }

        return errors;
    }
    //
    async save(options: {
        where?: Record<string, any>,
        data?: Record<string, any>,
    }): Promise<QueryResult> {
        let query = `UPDATE ${this.tableName}`;

        const dataEntries = Object.entries(options.data || {});
        const whereEntries = Object.entries(options.where || {});

        if (dataEntries.length > 0) {
            const setData = dataEntries.map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : value}`).join(", ");
            query += ` SET ${setData}`;
        }

        if (whereEntries.length > 0) {
            const whereConditions = whereEntries.map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : value}`).join(" AND ");
            query += ` WHERE ${whereConditions}`;
        }

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