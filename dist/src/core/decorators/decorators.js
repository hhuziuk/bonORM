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
const class_validator_1 = require("class-validator");
const columnsMetadataKey = "columns";
function Column(options = {}) {
    return (target, propertyKey) => {
        const columns = Reflect.getMetadata(columnsMetadataKey, target) || [];
        Reflect.defineMetadata(columnsMetadataKey, [...columns, { propertyKey, options }], target);
    };
}
exports.Column = Column;
function PrimaryGeneratedColumn() {
    return (target, propertyKey) => {
        const columns = Reflect.getMetadata(columnsMetadataKey, target) || [];
        Reflect.defineMetadata(columnsMetadataKey, [
            ...columns,
            { propertyKey, options: { type: 'INTEGER', autoIncrement: true, primaryKey: true } }
        ], target);
    };
}
exports.PrimaryGeneratedColumn = PrimaryGeneratedColumn;
function Entity(tableName) {
    return (target) => {
        Reflect.defineMetadata('tableName', tableName, target);
        const columns = Reflect.getMetadata(columnsMetadataKey, target.prototype) || [];
        const createModel = function (data) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!columns || columns.length === 0) {
                    return Promise.resolve();
                }
                const tableName = Reflect.getMetadata('tableName', target); // Отримуємо назву таблиці з метаданих
                const columnsQuery = columns.map(({ propertyKey, options }) => {
                    const { type, allowNull, defaultValue, autoIncrement, primaryKey } = options;
                    let columnDefinition = `${propertyKey} ${type}`;
                    columnDefinition += (!allowNull) ? " NOT NULL" : "";
                    columnDefinition += (defaultValue) ? ` DEFAULT '${defaultValue}'` : "";
                    columnDefinition += (primaryKey) ? " PRIMARY KEY" : "";
                    columnDefinition += (autoIncrement && type === 'INTEGER') ? " GENERATED ALWAYS AS IDENTITY" : "";
                    return columnDefinition;
                }).join(", ");
                const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsQuery});`;
                yield this.runQuery(query); // Створюємо таблицю
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
                    const validationErrors = yield (0, class_validator_1.validate)(objectToValidate);
                    if (validationErrors.length > 0) {
                        console.error(`Validation errors for field '${propertyKey}':`, validationErrors);
                        throw new Error(`Validation error occurred while creating the record for field '${propertyKey}'.`);
                    }
                }
            });
        };
    };
}
exports.Entity = Entity;
