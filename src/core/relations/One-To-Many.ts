import {pgConfig} from "../../configs/pgConfig";
import {QueryResult} from "pg";

export const createOneToManyRelation = async function(
    tableName: string,
    key: string,
    referenceTable: string,
    referenceKey: string
) {
    const query: string = `${key} INTEGER REFERENCES ${referenceTable}("${referenceKey}") ON DELETE SET NULL ON UPDATE CASCADE`;
    const alterQuery: string = `ALTER TABLE ${tableName} ADD ${query};`;
    try {
        const client = await pgConfig.connect();
        const res: QueryResult = await client.query(alterQuery);
        client.release();
        return res;
    } catch (err) {
        throw new Error(`Error doing query: ${err}`);
    }
};