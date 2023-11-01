import {QueryResult} from "pg";
import {pgConfig} from "../../configs/pgConfig";

export const createModel = async function(schemaName: string, schema: any) {
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
        let columnDefinition: string = `${attribute} ${type.key}`;
        (unique) ? columnDefinition += ' UNIQUE' : '';
        (!allowNull) ? columnDefinition += ' NOT NULL' : '';
        (defaultValue) ? columnDefinition += ` DEFAULT ${defaultValue}` : '';
        (primaryKey) ? columnDefinition += ' PRIMARY KEY' : '';
        (autoIncrement) ? columnDefinition += ' SERIAL' : '';
        return columnDefinition;
    });
    let query: string = `CREATE TABLE IF NOT EXISTS ${schemaName} (${columns.join(', ')});`;
    if (options) {
        if (options.timestamps) {
            query += `\nALTER TABLE ${schemaName} ADD COLUMN created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;`;
            query += `\nALTER TABLE ${schemaName} ADD COLUMN updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;`;
        }
    }
    try {
        const client = await pgConfig.connect();
        const res: QueryResult = await client.query(query);
        client.release();
        return res;
    } catch (err) {
        throw new Error(`Error doing query: ${err}`);
    }
};


