import "reflect-metadata";
import { QueryResult } from "pg";
import dbError from "../errors/dbError";
import { pgConfig } from "../../../../../../configs/pgConfig";
import {validate, ValidatorOptions} from "class-validator";
import {plainToClass} from "class-transformer";
import {ColumnData} from "../entities/Model";

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
        const createModel = async function (this: any, data: ColumnData): Promise<QueryResult | void> {
            if (!columns || columns.length === 0) {
                return Promise.resolve();
            }

            const tableName = Reflect.getMetadata('tableName', target); // Отримуємо назву таблиці з метаданих
            const columnsQuery = columns.map(({ propertyKey, options }: any) => {
                const { type, allowNull, defaultValue, autoIncrement, primaryKey } = options;
                let columnDefinition: string = `${propertyKey} ${type}`;
                columnDefinition += (!allowNull) ? " NOT NULL" : "";
                columnDefinition += (defaultValue) ? ` DEFAULT '${defaultValue}'` : "";
                columnDefinition += (primaryKey) ? " PRIMARY KEY" : "";
                columnDefinition += (autoIncrement && type === 'INTEGER') ? " GENERATED ALWAYS AS IDENTITY" : "";
                return columnDefinition;
            }).join(", ");
            const query: string = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsQuery});`;
            await this.runQuery(query); // Створюємо таблицю

            for (const column of columns) {
                const { propertyKey, options } = column;
                const fieldValue = data[propertyKey];
                if (!fieldValue) {
                    console.error(`Skipping validation for field '${propertyKey}' because its value is undefined.`);
                    continue;
                }
                if (propertyKey === 'id') {
                    console.error(`Skipping validation for field 'id'.`);
                    continue; // Skipping validation for the 'id' field
                }
                const { type } = options;
                const objectToValidate = { [propertyKey]: fieldValue };
                const validationErrors = await validate(objectToValidate);
                if (validationErrors.length > 0) {
                    console.error(`Validation errors for field '${propertyKey}':`, validationErrors);
                    throw new Error(`Validation error occurred while creating the record for field '${propertyKey}'.`);
                }
            }
        };
    };
}






