"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class buildTableQuery {
    static buildColumnDefinition({ propertyKey, options }) {
        const { type, allowNull, defaultValue, autoIncrement, primaryKey } = options;
        let columnDefinition = `${propertyKey} ${type}`;
        columnDefinition += (!allowNull) ? " NOT NULL" : "";
        if (defaultValue) {
            columnDefinition += ` DEFAULT '${defaultValue}'`;
        }
        else {
            if (type === 'TIMESTAMP' || type === 'DATE') {
                columnDefinition += ` DEFAULT ${type === 'TIMESTAMP' ? 'CURRENT_TIMESTAMP' : 'CURRENT_DATE'}`;
            }
        }
        columnDefinition += (primaryKey) ? " PRIMARY KEY" : "";
        if (type === 'UUID') {
            columnDefinition += (process.env.DB_TYPE === 'postgres') ? " DEFAULT uuid_generate_v4()" : ""; // PostgreSQL
            columnDefinition += (process.env.DB_TYPE === 'mysql') ? ` DEFAULT '${(0, uuid_1.v4)()}'` : ""; // MySQL
        }
        columnDefinition += (autoIncrement && type === 'INTEGER') ? " GENERATED ALWAYS AS IDENTITY" : "";
        return columnDefinition;
    }
    static buildCreateTableQuery(tableName, columnsStrings) {
        const columnsQuery = columnsStrings.join(", ");
        return `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsQuery});`;
    }
}
exports.default = buildTableQuery;
