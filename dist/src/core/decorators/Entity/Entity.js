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
exports.Entity = void 0;
require("reflect-metadata");
const uuid_1 = require("uuid");
const columnsMetadataKey = "columns";
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
