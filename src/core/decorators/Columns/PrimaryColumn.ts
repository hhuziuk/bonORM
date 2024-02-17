import dbError from "../../errors/dbError";

const columnsMetadataKey = "columns";

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
                dbError.DbTypeError();
            }
        } else {
            options.type = (columnType.toLowerCase() === 'number') ? 'INTEGER' : columnType;
        }

        Reflect.defineMetadata(columnsMetadataKey, [
            ...columns,
            { propertyKey, options }
        ], target);
    };
}