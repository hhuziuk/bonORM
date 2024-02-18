import { v4 } from 'uuid';

class buildTableQuery {
    static buildColumnDefinition({ propertyKey, options }: any): string {
        const { type, allowNull, defaultValue, autoIncrement, primaryKey, width, onUpdate, name, length, unique } = options;
        let columnDefinition: string = `${propertyKey} ${type}`;

        // allowNull
        if (defaultValue) {
            columnDefinition += ` DEFAULT '${defaultValue}'`;
        }

        if (type === 'UUID') {
            columnDefinition += (process.env.DB_TYPE === 'postgres') ? " DEFAULT uuid_generate_v4()" : ""; // PostgreSQL
            columnDefinition += (process.env.DB_TYPE === 'mysql') ? ` DEFAULT '${v4()}'` : ""; // MySQL
        }

        // autoIncrement (for MySQL)
        if (autoIncrement && type === 'INTEGER' && process.env.DB_TYPE === 'mysql') {
            columnDefinition += " AUTO_INCREMENT";
        } else if (autoIncrement && type === 'INTEGER' && process.env.DB_TYPE === 'postgres') {
            columnDefinition += " GENERATED ALWAYS AS IDENTITY";
        } else {
            columnDefinition += "";
        }

        if (autoIncrement && type === 'INTEGER') {
            columnDefinition += " GENERATED ALWAYS AS IDENTITY";
        } else {
            columnDefinition += "";
        }
        return columnDefinition;
    }

    static buildCreateTableQuery(tableName: string, columnsStrings: string[]): string {
        const columnsQuery = columnsStrings.join(", ");
        return `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsQuery});`;
    }
}

export default buildTableQuery;