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
const pgConfig_1 = require("../../configs/pgConfig");
const dbError_1 = __importDefault(require("../errors/dbError"));
const createManyToManyRelation = function (tableName, intermediateTableName, referenceTableName) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `CREATE TABLE IF NOT EXISTS "${intermediateTableName}" (
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "${tableName}Id" BIGINT REFERENCES "${tableName}" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "${referenceTableName}Id" BIGINT REFERENCES "${referenceTableName}" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY ("${tableName}Id","${referenceTableName}Id")
  )`;
        try {
            const client = yield pgConfig_1.pgConfig.connect();
            const res = yield client.query(query);
            client.release();
            return res;
        }
        catch (err) {
            dbError_1.default.QueryError(err);
        }
    });
};
exports.createManyToManyRelation = createManyToManyRelation;
