import {QueryResult} from "pg";
import {connection} from "../connection/connection";
import dbError from "../errors/dbError";
export const createOneToManyRelation = async function (
    tableName: string,
    key: string,
    referenceTable: string,
    referenceKey: string
): Promise<QueryResult> {
    let query: string;
    if (process.env.DB_TYPE === 'mysql') {
        query = `
        ALTER TABLE ${tableName} ADD ${key} BIGINT ${process.env.DB_TYPE === 'mysql' ? 'REFERENCES ' + referenceTable + ' (' + referenceKey + ') ON DELETE CASCADE ON UPDATE CASCADE' : ''}`;
    } else if (process.env.DB_TYPE === 'postgres') {
        query = `ALTER TABLE ${tableName} ADD ${key} BIGINT REFERENCES ${referenceTable}("${referenceKey}") ON DELETE SET NULL ON UPDATE CASCADE;`;
    } else {
        dbError.DbTypeError()
    }
    return await connection(query);
};