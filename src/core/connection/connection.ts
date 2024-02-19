import { QueryResult } from "pg";
import dbError from "../errors/dbError";

export async function connection(query: string): Promise<QueryResult> {
    try {
        if (process.env.DB_TYPE === 'postgres') {
            const { pgConfig } = await import("../../../../../../configs/pgConfig");
            const client = await pgConfig.connect();
            try {
                const res: QueryResult = await client.query(query);
                console.log("Connected to the PostgreSQL database");
                return res;
            } finally {
                client.release();
            }
        } else if (process.env.DB_TYPE === 'mysql') {
            const { mySqlConfig } = await import("../../../../../../configs/mySqlConfig");
            const connection = await mySqlConfig();
            try {
                const [rows, fields] = await connection.execute(query);
                console.log("Connected to the MySQL database");
                return { rows, fields } as QueryResult<any>;
            } finally {
                await connection.end();
            }
        } else {
            dbError.DbTypeError();
        }
    } catch (err) {
        throw err;
    }
}
