import "reflect-metadata";
import { v4 as uuidv4 } from 'uuid';
import {pgDataType} from "../data-types/PgDataTypes";
import {mySqlDataType} from "../data-types/MySqlDataTypes";

const columnsMetadataKey = "columns";

export function Column(options: any = {}, ...validators: any[]): PropertyDecorator {
    return (target: any, propertyKey: string) => {
        const columns = Reflect.getMetadata(columnsMetadataKey, target) || [];
        Reflect.defineMetadata(columnsMetadataKey, [...columns, { propertyKey, options, validators }], target);

        if (validators && validators.length > 0) {
            Reflect.defineMetadata("validators", validators, target, propertyKey);
        }
    };
}

export function PrimaryGeneratedColumn(columnType?: string | number): PropertyDecorator {
    return (target: any, propertyKey: string) => {
        const columns = Reflect.getMetadata(columnsMetadataKey, target) || [];
        const options: any = { primaryKey: true };

        if (!columnType || typeof columnType === 'number') {
            options.type = 'INTEGER';
            options.autoIncrement = true;
        } else if (columnType.toLowerCase() === 'uuid') {
            if (process.env.DB_TYPE === 'postgres') {
                options.type = 'UUID';
                options.default = () => 'uuid_generate_v4()';
            } else if (process.env.DB_TYPE === 'mysql') {
                options.type = 'CHAR(36)'; // or UUID, actually idk
                options.default = () => `'${uuidv4()}'`;
            } else {
                throw new Error('Unsupported database type');
            }
        } else {
            throw new Error('Invalid column type');
        }

        Reflect.defineMetadata(columnsMetadataKey, [
            ...columns,
            { propertyKey, options }
        ], target);
    };
}

export function PrimaryColumn(columnType?: string): PropertyDecorator {
    return (target: any, propertyKey: string) => {
        const columns = Reflect.getMetadata(columnsMetadataKey, target) || [];
        const options: any = { primaryKey: true };

        if (!columnType || typeof columnType === 'number') {
            options.type = 'INTEGER';
            options.autoIncrement = true;
        } else if (columnType.toLowerCase() === 'uuid') {
            if (process.env.DB_TYPE === 'postgres') {
                options.type = 'UUID';
            } else if (process.env.DB_TYPE === 'mysql') {
                options.type = 'CHAR(36)';
            } else {
                throw new Error('Unsupported database type');
            }
        } else {
            options.type = (columnType.toLowerCase() === 'number') ? 'INTEGER' : columnType; // Check if columnType is number, set type to INTEGER
        }

        Reflect.defineMetadata(columnsMetadataKey, [
            ...columns,
            { propertyKey, options }
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
            if (type === 'UUID') {
                columnDefinition += (process.env.DB_TYPE === 'postgres') ? " DEFAULT uuid_generate_v4()" : ""; // PostgreSQL
                columnDefinition += (process.env.DB_TYPE === 'mysql') ? ` DEFAULT '${uuidv4()}'` : ""; // MySQL
            }
            columnDefinition += (autoIncrement && type === 'INTEGER') ? " GENERATED ALWAYS AS IDENTITY" : "";
            return columnDefinition;
        });

        const createModel = async function (this: any): Promise<void> {
            if (!columnsStrings || columnsStrings.length === 0) {
                return Promise.resolve();
            }
            const columnsQuery = columnsStrings.join(", ");
            const tableName = Reflect.getMetadata('tableName', target);
            const query: string = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsQuery});`;
            await this.runQuery(query);
        };

        target.prototype.createModel = createModel;
        createModel.call(target.prototype);
    };
}