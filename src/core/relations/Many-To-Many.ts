import {QueryResult} from "pg";
import { pgConfig } from "../../../../../configs/pgConfig";
import dbError from "../errors/dbError";

export const createManyToManyRelation = async function (
    tableName: string,
    intermediateTableName: string,
    referenceTableName: string
) {
    const query: string = `CREATE TABLE IF NOT EXISTS "${intermediateTableName}" (
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "${tableName}Id" BIGINT REFERENCES "${tableName}" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "${referenceTableName}Id" BIGINT REFERENCES "${referenceTableName}" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY ("${tableName}Id","${referenceTableName}Id")
  )`;
    try {
        const client = await pgConfig.connect();
        const res: QueryResult = await client.query(query);
        client.release();
        return res;
    } catch (err) {
        dbError.QueryError(err)
    }
};