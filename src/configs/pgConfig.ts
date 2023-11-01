import { Pool, Client } from 'pg';

export const pgConfig = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'root',
    port: 5432,
});