import {connection} from "../connection/connection";
import {QueryResult} from "pg";
import dbError from "../errors/dbError";
export const createOneToOneRelation = async function (
    tableName: string,
    key: string,
    referenceTable: string,
    referenceKey: string
): Promise<QueryResult> {
    let query: string;
    if (process.env.DB_TYPE === 'mysql') {
        query = `
        ALTER TABLE ${tableName} ADD ${key} BIGINT UNIQUE ${process.env.DB_TYPE === 'mysql' ? 'REFERENCES ' + referenceTable + ' (' + referenceKey + ') ON DELETE SET NULL ON UPDATE CASCADE' : ''}`;
    } else if (process.env.DB_TYPE === 'postgres') {
        query = `ALTER TABLE ${tableName} ADD ${key} BIGINT UNIQUE REFERENCES ${referenceTable} ("${referenceKey}") ON DELETE SET NULL ON UPDATE CASCADE;`;
    } else {
        dbError.DbTypeError()
    }
    return await connection(query);
};