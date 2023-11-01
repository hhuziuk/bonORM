import {pgConfig} from "../../configs/pgConfig";
import {QueryResult} from "pg";

export const createManyToManyRelation = async function(
    tableName: string,
    intermediateTableName: string,
    referenceTableName: string
) {
    const query = `CREATE TABLE IF NOT EXISTS "${intermediateTableName}" (
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "${tableName}Id" INTEGER REFERENCES "${tableName}" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "${referenceTableName}Id" INTEGER REFERENCES "${referenceTableName}" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY ("${tableName}Id","${referenceTableName}Id")
)`;
    try {
        const client = await pgConfig.connect();
        const res: QueryResult = await client.query(query);
        client.release();
        return res;
    } catch (err) {
        throw new Error(`Error doing query: ${err}`);
    }
};