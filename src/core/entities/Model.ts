import { QueryResult } from "pg";
import { pgConfig } from "../../../../../../configs/pgConfig";
import { toolCommandsInterface } from "../tool-commands/tool-commands-interface";
import dbError from "../errors/dbError";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

export interface ColumnData {
    [columnName: string]: any;
}

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
            console.log("Connected to the database");
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
            console.error(`Validation errors for creating record:`, errors);
            throw new Error(`Validation error occurred while creating the record.`);
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

    async save(): Promise<QueryResult> {
        // This function needs to be implemented based on your requirements
        throw new Error("Method not implemented.");
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