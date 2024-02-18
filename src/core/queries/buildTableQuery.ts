import { v4 } from 'uuid';

class buildTableQuery {
    static buildColumnDefinition({ propertyKey, options }: any): string {
        const { type, allowNull, defaultValue, autoIncrement, primaryKey, width, onUpdate, name, length, unique } = options;
        let columnDefinition: string = `${propertyKey} ${type}`;

        // allowNull
        if (!allowNull) {
            columnDefinition += " NOT NULL";
        }
        // name for column
        if (name) {
            columnDefinition += ` ${name}`;
        }

        // unique
        if (unique) {
            columnDefinition += " UNIQUE";
        }

        // length
        if (length && (type === 'VARCHAR' || type === 'CHAR')) {
            columnDefinition += `(${length})`;
        }

        // width (for MySQL)
        if (width && process.env.DB_TYPE === 'mysql') {
            columnDefinition += ` WIDTH ${width}`;
        }

        // onUpdate (for MySQL)
        if (onUpdate && process.env.DB_TYPE === 'mysql') {
            columnDefinition += ` ON UPDATE ${onUpdate}`;
        }

        // primaryKey
        if (primaryKey) {
            columnDefinition += " PRIMARY KEY";
        }

        // defaultValue
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

        return columnDefinition;
    }

    static buildCreateTableQuery(tableName: string, columnsStrings: string[]): string {
        const columnsQuery = columnsStrings.join(", ");
        return `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsQuery});`;
    }
}

export default buildTableQuery;