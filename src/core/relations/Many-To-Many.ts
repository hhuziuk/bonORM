import {QueryResult} from "pg";
import {connection} from "../connection/connection";
import dbError from "../errors/dbError";
export const createManyToManyRelation = async function (
    tableName: string,
    intermediateTableName: string,
    referenceTableName: string
): Promise<QueryResult> {
    let query: string;
    if (process.env.DB_TYPE === 'mysql') {
        query = `
            CREATE TABLE IF NOT EXISTS \`${intermediateTableName}\` (
                \`createdAt\` TIMESTAMP NOT NULL,
                \`updatedAt\` TIMESTAMP NOT NULL,
                \`PlayerId\` INT,
                \`TeamId\` INT,
                PRIMARY KEY (\`PlayerId\`, \`TeamId\`),
                FOREIGN KEY (\`PlayerId\`) REFERENCES \`${tableName}\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (\`TeamId\`) REFERENCES \`${referenceTableName}\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
                )
        `;
    } else if (process.env.DB_TYPE === 'postgres') {
        query = `
            CREATE TABLE IF NOT EXISTS "${intermediateTableName}" (
                "createdAt" TIMESTAMP NOT NULL,
                "updatedAt" TIMESTAMP NOT NULL,
                "${tableName}Id" BIGINT,
                "${referenceTableName}Id" BIGINT,
                PRIMARY KEY ("${tableName}Id", "${referenceTableName}Id"),
                FOREIGN KEY ("${tableName}Id") REFERENCES "${tableName}" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY ("${referenceTableName}Id") REFERENCES "${referenceTableName}" ("id") ON DELETE CASCADE ON UPDATE CASCADE
                )`;
    } else {
        dbError.DbTypeError();
    }

    return await connection(query);
};