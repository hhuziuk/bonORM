import {QueryResult} from "pg";
import {pgConfig} from "../../configs/pgConfig";
import {toolCommandsInterface} from "../tool-commands/tool-commands-interface";

export class Model implements toolCommandsInterface{
    private async runQuery(query: string): Promise<QueryResult> {
        try {
            const client = await pgConfig.connect();
            const res: QueryResult = await client.query(query);
            client.release();
            return res;
        } catch (err) {
            throw new Error(`Error doing query: ${err}`);
        }
    }
    async find(){
        let query: string = `SELECT * FROM your_table_name;`;
        return this.runQuery(query);
    }
    async findOne(object: Object){
        let query: string = `SELECT * FROM your_table_name WHERE your_condition;`;
        return this.runQuery(query);
    }
    async create(object: Object){
        let query: string = `INSERT INTO your_table_name (column1, column2, ...) VALUES (value1, value2, ...);`;
        return this.runQuery(query);
    }
    async save(object: Object) {
        let query: string = `UPDATE your_table_name SET column1 = value1, column2 = value2, ... WHERE your_condition;`;
        return this.runQuery(query);
    }
    async deleteOne(object: Object){
        let query: string = `DELETE FROM your_table_name WHERE your_condition;`;
        return this.runQuery(query);
    }
    async deleteAll(object: Object){
        let query: string = `DELETE FROM your_table_name;`;
        return this.runQuery(query);
    }
    async createModel(schemaName: string, schema: any) {
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
        return this.runQuery(query);
    }


}



