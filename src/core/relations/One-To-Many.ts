import { pgConfig } from "../../../../../../configs/pgConfig";
import {QueryResult} from "pg";
import dbError from "../errors/dbError";

export const createOneToManyRelation = async function(
    tableName: string,
    key: string,
    referenceTable: string,
    referenceKey: string
) {
    const query: string = `${key} BIGINT REFERENCES ${referenceTable}("${referenceKey}") ON DELETE SET NULL ON UPDATE CASCADE`;
    const alterQuery: string = `ALTER TABLE ${tableName} ADD ${query};`;
    try {
        const client = await pgConfig.connect();
        const res: QueryResult = await client.query(alterQuery);
        client.release();
        return res;
    } catch (err) {
        dbError.QueryError(err);
    }
};