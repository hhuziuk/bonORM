import "reflect-metadata";
import { QueryResult } from "pg";
import dbError from "../errors/dbError";
import { pgConfig } from "../../../../../../configs/pgConfig";
import {validate, ValidatorOptions} from "class-validator";

const columnsMetadataKey = "columns";

export function Column(options: any = {}): PropertyDecorator {
    return (target: any, propertyKey: string) => {
        const columns = Reflect.getMetadata(columnsMetadataKey, target) || [];
        Reflect.defineMetadata(columnsMetadataKey, [...columns, { propertyKey, options }], target);
    };
}
export function PrimaryGeneratedColumn(): PropertyDecorator {
    return (target: any, propertyKey: string) => {
        const columns = Reflect.getMetadata(columnsMetadataKey, target) || [];
        Reflect.defineMetadata(columnsMetadataKey, [
            ...columns,
            { propertyKey, options: { type: 'INTEGER', autoIncrement: true, primaryKey: true } }
        ], target);
    };
}

export function Entity(tableName: string): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata('tableName', tableName, target);
        const columns = Reflect.getMetadata(columnsMetadataKey, target.prototype) || [];
        const columnsStrings = columns.map(({ propertyKey, options }: any) => {
            const { type, allowNull, defaultValue, autoIncrement, primaryKey } = options;
            let columnDefinition: string = `${propertyKey} ${type}`;
            columnDefinition += (!allowNull) ? " NOT NULL" : "";
            columnDefinition += (defaultValue) ? ` DEFAULT '${defaultValue}'` : "";
            columnDefinition += (primaryKey) ? " PRIMARY KEY" : "";
            columnDefinition += (autoIncrement && type === 'INTEGER') ? " GENERATED ALWAYS AS IDENTITY" : "";
            return columnDefinition;
        });

        const createModel = async function (this: any): Promise<QueryResult | void> {
            if (!columnsStrings || columnsStrings.length === 0) {
                return Promise.resolve();
            }
            const columnsQuery = columnsStrings.join(", ");
            const tableName = Reflect.getMetadata('tableName', target);
            const query: string = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsQuery});`;
            await this.runQuery(query); // Create the table

            // Validate the table data using class-validator
            const targetConstructor = Reflect.getMetadata('design:paramtypes', target);
            const instance = new (target.bind.apply(target, [null].concat(targetConstructor)))();
            const schema = await validate(instance);

            if (schema.length > 0) {
                // Handle validation errors
                console.error("Validation errors:", schema);
                throw new Error("Validation error occurred while creating the table.");
            }
        };

        target.prototype.createModel = createModel;
        target.prototype.runQuery = async function (this: any, query: string): Promise<QueryResult> {
            try {
                const client = await pgConfig.connect();
                const res: QueryResult = await client.query(query);
                client.release();
                console.log("connected to the database");
                return res;
            } catch (err) {
                dbError.QueryError(err);
            }
        };

        createModel.call(target.prototype);
    };
}
