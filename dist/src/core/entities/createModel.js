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
exports.Model = void 0;
const pgConfig_1 = require("../../configs/pgConfig");
const dbError_1 = __importDefault(require("../errors/dbError"));
class Model {
    constructor(tableName) {
        this.tableName = tableName;
    }
    runQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield pgConfig_1.pgConfig.connect();
                const res = yield client.query(query);
                client.release();
                console.log("connected to database");
                return res;
            }
            catch (err) {
                dbError_1.default.QueryError(err);
            }
        });
    }
    find(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `SELECT ${options.select && options.select.length > 0
                ? options.select.join(', ')
                : '*'} FROM ${this.tableName}`;
            query += options.relations && options.relations.length > 0
                ? ` LEFT JOIN ${options.relations.join(" LEFT JOIN ")}`
                : '';
            query += options.where && Object.keys(options.where).length > 0
                ? ` WHERE ${Object.keys(options.where)
                    .map(key => typeof options.where[key] === 'string'
                    ? `${key} = '${options.where[key]}'`
                    : `${key} = ${options.where[key]}`)
                    .join(" AND ")}`
                : "";
            query += options.order && Object.keys(options.order).length > 0
                ? ` ORDER BY ${Object.keys(options.order)
                    .map(key => `${key} ${options.order[key]}`)
                    .join(", ")}`
                : "";
            query += options.skip && options.take
                ? ` OFFSET ${options.skip} LIMIT ${options.take}`
                : options.skip
                    ? ` OFFSET ${options.skip}`
                    : options.take
                        ? ` LIMIT ${options.take}`
                        : "";
            return this.runQuery(query);
        });
    }
    findOne(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `SELECT * FROM ${this.tableName}`;
            query += options.where && Object.keys(options.where).length > 0
                ? ` WHERE ${Object.keys(options.where)
                    .map(key => typeof options.where[key] === 'string'
                    ? `${key} = '${options.where[key]}'`
                    : `${key} = ${options.where[key]}`)
                    .join(" AND ")}`
                : "";
            return this.runQuery(query);
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data || Object.keys(data).length < 0) {
                dbError_1.default.EmptyQuery();
            }
            const checkQuery = `SELECT * FROM ${this.tableName} WHERE name = '${data.name}'`;
            const checkQueryResult = yield this.runQuery(checkQuery);
            if (checkQueryResult.rows.length > 0) {
                dbError_1.default.ExistingDataError(data.name);
            }
            const columns = Object.keys(data).join(', ');
            const values = Object.values(data)
                .map(value => {
                if (typeof value === 'string') {
                    return `'${value}'`;
                }
                return value;
            })
                .join(', ');
            const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${values});`;
            return this.runQuery(query);
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `UPDATE ${this.tableName} SET $;`;
            return this.runQuery(query);
        });
    }
    delete(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `DELETE FROM ${this.tableName}`;
            query += options.where && Object.keys(options.where).length > 0
                ? ` WHERE ${Object.keys(options.where)
                    .map(key => typeof options.where[key] === 'string'
                    ? `${key} = '${options.where[key]}'`
                    : `${key} = ${options.where[key]}`)
                    .join(" AND ")}`
                : "";
            return this.runQuery(query);
        });
    }
    createModel(schema) {
        const { attributes, options } = schema;
        const columns = Object.keys(attributes).map(attribute => {
            const { type, unique, allowNull, defaultValue, autoIncrement, primaryKey } = attributes[attribute];
            let columnDefinition = `${attribute} ${type.key}`;
            if (unique)
                columnDefinition += " UNIQUE";
            if (!allowNull)
                columnDefinition += " NOT NULL";
            if (defaultValue) {
                if (typeof defaultValue === 'string') {
                    columnDefinition += ` DEFAULT '${defaultValue}'`;
                }
                else {
                    columnDefinition += ` DEFAULT ${defaultValue}`;
                }
            }
            if (primaryKey)
                columnDefinition += " PRIMARY KEY";
            if (autoIncrement && type.key === 'INTEGER') {
                columnDefinition += " GENERATED ALWAYS AS IDENTITY";
            }
            return columnDefinition;
        });
        let query = `CREATE TABLE IF NOT EXISTS ${this.tableName} (${columns.join(", ")});`;
        return this.runQuery(query);
    }
}
exports.Model = Model;