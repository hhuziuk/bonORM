import { QueryResult } from "pg";
import dbError from "../errors/dbError";

export async function connection(query: string): Promise<QueryResult> {
    try {
        if (process.env.DB_TYPE === 'postgres') {
            const pgConfigPath = "../../../../../../configs/pgConfig";
            if (await fileExists(pgConfigPath)) {
                const { pgConfig } = await import(pgConfigPath);
                const client = await pgConfig.connect();
                try {
                    const res: QueryResult = await client.query(query);
                    console.log("Connected to the PostgreSQL database");
                    return res;
                } finally {
                    client.release();
                }
            } else {
                throw new Error("PostgreSQL configuration file not found");
            }
        } else if (process.env.DB_TYPE === 'mysql') {
            const mySqlConfigPath = "../../../../../../configs/mySqlConfig";
            if (await fileExists(mySqlConfigPath)) {
                const { mySqlConfig } = await import(mySqlConfigPath);
                const connection = await mySqlConfig();
                try {
                    const [rows, fields] = await connection.execute(query);
                    console.log("Connected to the MySQL database");
                    return { rows, fields } as QueryResult<any>;
                } finally {
                    await connection.end();
                }
            } else {
                throw new Error("MySQL configuration file not found");
            }
        } else {
            dbError.DbTypeError();
        }
    } catch (err) {
        throw err;
    }
}

async function fileExists(path: string): Promise<boolean> {
    try {
        await import(path);
        return true;
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            return false;
        }
        throw err;
    }
}