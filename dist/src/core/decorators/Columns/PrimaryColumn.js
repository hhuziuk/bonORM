"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimaryColumn = void 0;
const dbError_1 = __importDefault(require("../../errors/dbError"));
const columnsMetadataKey = "columns";
function PrimaryColumn(columnType) {
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
            }
            else if (process.env.DB_TYPE === 'mysql') {
                options.type = 'CHAR(36)';
            }
            else {
                dbError_1.default.DbTypeError();
            }
        }
        else {
            options.type = (columnType.toLowerCase() === 'number') ? 'INTEGER' : columnType;
        }
        Reflect.defineMetadata(columnsMetadataKey, [
            ...columns,
            { propertyKey, options }
        ], target);
    };
}
exports.PrimaryColumn = PrimaryColumn;
