import { v4 } from 'uuid';

const columnsMetadataKey = "columns";
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
                options.default = () => `'${v4()}'`;
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