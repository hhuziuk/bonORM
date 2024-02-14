"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = exports.PrimaryGeneratedColumn = exports.Column = void 0;
require("reflect-metadata");
const uuid_1 = require("uuid");
const columnsMetadataKey = "columns";
function Column(options = {}, ...validators) {
    return (target, propertyKey) => {
        const columns = Reflect.getMetadata(columnsMetadataKey, target) || [];
        Reflect.defineMetadata(columnsMetadataKey, [...columns, { propertyKey, options, validators }], target);
        if (validators && validators.length > 0) {
            Reflect.defineMetadata("validators", validators, target, propertyKey);
        }
    };
}
exports.Column = Column;
function PrimaryGeneratedColumn(columnType) {
    return (target, propertyKey) => {
        const columns = Reflect.getMetadata(columnsMetadataKey, target) || [];
        const options = { primaryKey: true };
        if (!columnType || columnType.toLowerCase() === 'uuid') {
            if (process.env.DB_TYPE === 'postgres') {
                options.type = 'UUID';
                options.default = () => 'uuid_generate_v4()';
            }
            else if (process.env.DB_TYPE === 'mysql') {
                options.type = 'CHAR(36)';
                options.default = () => `'${(0, uuid_1.v4)()}'`;
            }
            else {
                throw new Error('Unsupported database type');
            }
        }
        else {
            options.type = 'INTEGER';
            options.autoIncrement = true;
        }
        Reflect.defineMetadata(columnsMetadataKey, [
            ...columns,
            { propertyKey, options }
        ], target);
    };
}
exports.PrimaryGeneratedColumn = PrimaryGeneratedColumn;
function Entity(tableName) {
    return (target) => {
        Reflect.defineMetadata('tableName', tableName, target);
        const columns = Reflect.getMetadata(columnsMetadataKey, target.prototype) || [];
        const columnsStrings = columns.map(({ propertyKey, options }) => {
            const { type, allowNull, defaultValue, autoIncrement, primaryKey } = options;
            let columnDefinition = `${propertyKey} ${type}`;
            columnDefinition += (!allowNull) ? " NOT NULL" : "";
            columnDefinition += (defaultValue) ? ` DEFAULT '${defaultValue}'` : "";
            columnDefinition += (primaryKey) ? " PRIMARY KEY" : "";
            // Additional handling for UUID type
            if (type === 'UUID') {
                columnDefinition += (process.env.DB_TYPE === 'postgres') ? " DEFAULT uuid_generate_v4()" : ""; // PostgreSQL
                columnDefinition += (process.env.DB_TYPE === 'mysql') ? ` DEFAULT '${(0, uuid_1.v4)()}'` : ""; // MySQL
            }
            columnDefinition += (autoIncrement && type === 'INTEGER') ? " GENERATED ALWAYS AS IDENTITY" : "";
            return columnDefinition;
        });
        const createModel = function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (!columnsStrings || columnsStrings.length === 0) {
                    return Promise.resolve();
                }
                const columnsQuery = columnsStrings.join(", ");
                const tableName = Reflect.getMetadata('tableName', target);
                const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsQuery});`;
                yield this.runQuery(query);
            });
        };
        target.prototype.createModel = createModel;
        createModel.call(target.prototype);
    };
}
exports.Entity = Entity;
