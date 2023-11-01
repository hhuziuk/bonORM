import {createOneToOneRelation} from "../relations/One-To-One";

export const createModel = function(schemaName: string, schema: any) {
    const { tableName, attributes, options } = schema;
    const columns = Object.keys(attributes).map((attribute) => {
        const {
            type,
            unique,
            allowNull,
            defaultValue,
            autoIncrement,
            primaryKey,
        } = attributes[attribute];
        let columnDefinition = `${attribute} ${type.key}`;
        if (unique) {
            columnDefinition += ' UNIQUE';
        }
        if (!allowNull) {
            columnDefinition += ' NOT NULL';
        }
        if (defaultValue) {
            columnDefinition += ` DEFAULT ${defaultValue}`;
        }
        if (primaryKey) {
            columnDefinition += ' PRIMARY KEY';
        }
        if (autoIncrement) {
            columnDefinition += ' SERIAL';
        }
        return columnDefinition;
    });
    let query = `CREATE TABLE IF NOT EXISTS ${schemaName} (${columns.join(', ')});`;
    if (options) {
        if (options.timestamps) {
            query += `\nALTER TABLE ${schemaName} ADD COLUMN created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;`;
            query += `\nALTER TABLE ${schemaName} ADD COLUMN updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;`;
        }
    }

    return query;
};


