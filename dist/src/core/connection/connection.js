"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const dbError_1 = __importDefault(require("../errors/dbError"));
const pgConfig_1 = require("../../../../../../configs/pgConfig");
const mySqlConfig_1 = __importDefault(require("../../../../../../configs/mySqlConfig"));
function connection(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (process.env.DB_TYPE === 'postgres') {
                const client = yield pgConfig_1.pgConfig.connect();
                const res = yield client.query(query);
                client.release();
                console.log("Connected to the PostgreSQL database");
                return res;
            }
            else if (process.env.DB_TYPE === 'mysql') {
                const connection = yield (0, mySqlConfig_1.default)();
                const [rows, fields] = yield connection.execute(query);
                console.log("Connected to the MySQL database");
                yield connection.end();
                return { rows, fields };
            }
            else {
                dbError_1.default.DbTypeError();
            }
        }
        catch (err) {
            dbError_1.default.QueryError(err);
            throw err;
        }
    });
}
exports.connection = connection;
