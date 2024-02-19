import {QueryResult} from "pg";
import dbError from "../errors/dbError";
import { pgConfig } from "../../../../../../configs/pgConfig";
import mySqlConfig from "../../../../../../configs/mySqlConfig";

export async function connection(query: string): Promise<QueryResult> {
    try {
        if (process.env.DB_TYPE === 'postgres') {
            const client = await pgConfig.connect();
            const res: QueryResult = await client.query(query);
            client.release();
            console.log("Connected to the PostgreSQL database");
            return res;
        } else if (process.env.DB_TYPE === 'mysql') {
            const connection = await mySqlConfig();
            const [rows, fields] = await connection.execute(query);
            console.log("Connected to the MySQL database");
            await connection.end();
            return { rows, fields } as QueryResult<any>;
        } else {
            dbError.DbTypeError();
        }
    } catch (err) {
        dbError.QueryError(err);
        throw err;
    }
}