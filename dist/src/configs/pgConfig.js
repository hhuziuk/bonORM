"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgConfig = void 0;
const pg_1 = require("pg");
exports.pgConfig = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'root',
    port: 5432,
});
