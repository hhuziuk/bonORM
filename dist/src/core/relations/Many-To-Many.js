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
exports.createManyToManyRelation = void 0;
const connection_1 = require("../connection/connection");
const dbError_1 = __importDefault(require("../errors/dbError"));
const createManyToManyRelation = function (tableName, intermediateTableName, referenceTableName) {
    return __awaiter(this, void 0, void 0, function* () {
        let query;
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
        }
        else if (process.env.DB_TYPE === 'postgres') {
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
        }
        else {
            dbError_1.default.DbTypeError();
        }
        return yield (0, connection_1.connection)(query);
    });
};
exports.createManyToManyRelation = createManyToManyRelation;
