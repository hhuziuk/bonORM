import { pgConfig } from "../../../../../configs/generatePgConfig";
import {QueryResult} from "pg";
import dbError from "../errors/dbError";

export const createOneToOneRelation = async function(
    tableName: string,
    key: string,
    referenceTable: string,
    referenceKey: string
) {
    const query = `${key} BIGINT UNIQUE REFERENCES ${referenceTable} ("${referenceKey}") ON DELETE SET NULL ON UPDATE CASCADE`;
    const alterQuery = `ALTER TABLE ${tableName} ADD ${query};`;
    try {
        const client = await pgConfig.connect();
        const res: QueryResult = await client.query(alterQuery);
        client.release();
        return res;
    } catch (err) {
        dbError.QueryError(err);
    }
};
