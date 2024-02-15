"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimaryGeneratedColumn = void 0;
const uuid_1 = require("uuid");
const columnsMetadataKey = "columns";
function PrimaryGeneratedColumn(columnType) {
    return (target, propertyKey) => {
        const columns = Reflect.getMetadata(columnsMetadataKey, target) || [];
        const options = { primaryKey: true };
        if (!columnType || typeof columnType === 'number') {
            options.type = 'INTEGER';
            options.autoIncrement = true;
        }
        else if (columnType.toLowerCase() === 'uuid') {
            if (process.env.DB_TYPE === 'postgres') {
                options.type = 'UUID';
                options.default = () => 'uuid_generate_v4()';
            }
            else if (process.env.DB_TYPE === 'mysql') {
                options.type = 'CHAR(36)'; // or UUID, actually idk
                options.default = () => `'${(0, uuid_1.v4)()}'`;
            }
            else {
                throw new Error('Unsupported database type');
            }
        }
        else {
            throw new Error('Invalid column type');
        }
        Reflect.defineMetadata(columnsMetadataKey, [
            ...columns,
            { propertyKey, options }
        ], target);
    };
}
exports.PrimaryGeneratedColumn = PrimaryGeneratedColumn;
