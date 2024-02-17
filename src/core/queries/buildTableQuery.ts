import {ColumnGeneralOptions} from "../options/ColumnGeneralOptions";
import { v4 } from 'uuid';

class buildTableQuery {
    static buildColumnDefinition({ propertyKey, options }: any): string {
        const { type, allowNull, defaultValue, autoIncrement, primaryKey } = options;
        let columnDefinition: string = `${propertyKey} ${type}`;
        columnDefinition += (!allowNull) ? " NOT NULL" : "";
        if (defaultValue) {
            columnDefinition += ` DEFAULT '${defaultValue}'`;
        } else {
            if (type === 'TIMESTAMP' || type === 'DATE') {
                columnDefinition += ` DEFAULT ${type === 'TIMESTAMP' ? 'CURRENT_TIMESTAMP' : 'CURRENT_DATE'}`;
            }
        }
        columnDefinition += (primaryKey) ? " PRIMARY KEY" : "";
        if (type === 'UUID') {
            columnDefinition += (process.env.DB_TYPE === 'postgres') ? " DEFAULT uuid_generate_v4()" : ""; // PostgreSQL
            columnDefinition += (process.env.DB_TYPE === 'mysql') ? ` DEFAULT '${v4()}'` : ""; // MySQL
        }
        columnDefinition += (autoIncrement && type === 'INTEGER') ? " GENERATED ALWAYS AS IDENTITY" : "";
        return columnDefinition;
    }
    static buildCreateTableQuery(tableName: string, columnsStrings: string[]): string {
        const columnsQuery = columnsStrings.join(", ");
        return `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsQuery});`;
    }

}

export default buildTableQuery;