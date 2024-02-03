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
exports.Model = exports.Entity = exports.Column = exports.PrimaryGeneratedColumn = void 0;
const pgConfig_1 = require("../../../../../../configs/pgConfig");
const dbError_1 = __importDefault(require("../errors/dbError"));
require("reflect-metadata");
const columnsMetadataKey = Symbol('columns');
function PrimaryGeneratedColumn() {
    return (target, propertyKey) => {
        const columns = Reflect.getMetadata(columnsMetadataKey, target) || [];
        Reflect.defineMetadata(columnsMetadataKey, [
            ...columns,
            { propertyKey, options: { type: 'INTEGER', autoIncrement: true, primaryKey: true } }
        ], target);
    };
}
exports.PrimaryGeneratedColumn = PrimaryGeneratedColumn;
function Column(options = {}) {
    return (target, propertyKey) => {
        const columns = Reflect.getMetadata(columnsMetadataKey, target) || [];
        Reflect.defineMetadata(columnsMetadataKey, [
            ...columns,
            { propertyKey, options }
        ], target);
    };
}
exports.Column = Column;
function Entity(tableName) {
    return (target) => {
        Reflect.defineMetadata('tableName', tableName, target);
        const columns = Reflect.getMetadata(columnsMetadataKey, target.prototype) || [];
        const columnsStrings = columns.map(({ propertyKey, options }) => {
            const { type, allowNull, defaultValue, autoIncrement, primaryKey } = options;
            let columnDefinition = `${propertyKey} ${type}`;
            columnDefinition += (!allowNull) ? " NOT NULL" : "";
            columnDefinition += (defaultValue) ? ` DEFAULT '${defaultValue}'` : "";
            columnDefinition += (primaryKey) ? " PRIMARY KEY" : "";
            columnDefinition += (autoIncrement && type === 'INTEGER') ? " GENERATED ALWAYS AS IDENTITY" : "";
            return columnDefinition;
        });
        const createModel = function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (!columnsStrings || columnsStrings.length === 0) {
                    return Promise.resolve();
                }
                const columnsQuery = columnsStrings.join(", ");
                const tableName = Reflect.getMetadata('tableName', target);
                const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsQuery});`;
                return this.runQuery(query);
            });
        };
        target.prototype.createModel = createModel;
        target.prototype.runQuery = function (query) {
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
        };
        createModel.call(target.prototype); // Виклик createModel на екземплярі класу
    };
}
exports.Entity = Entity;
class Model {
    constructor(tableName) {
        this.tableName = tableName;
    }
    createModel() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.columns.length === 0) {
                return Promise.resolve();
            }
            const query = `CREATE TABLE IF NOT EXISTS ${this.tableName} (${this.columns.join(",")});`;
            return this.runQuery(query);
        });
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
            let query;
            if (options.select && options.select.length > 0) {
                query = `SELECT ${options.select.join(', ')} FROM ${this.tableName}`;
            }
            else {
                query = `SELECT * FROM ${this.tableName}`;
            }
            if (options.relations && options.relations.length > 0) {
                query += ` LEFT JOIN ${options.relations.join(" LEFT JOIN ")}`;
            }
            else {
                query += '';
            }
            if (options.where && Object.keys(options.where).length > 0) {
                query += ` WHERE ${Object.keys(options.where)
                    .map(key => typeof options.where[key] === 'string' ? `${key} = '${options.where[key]}'` : `${key} = ${options.where[key]}`)
                    .join(" AND ")}`;
            }
            if (options.order && Object.keys(options.order).length > 0) {
                query += ` ORDER BY ${Object.keys(options.order)
                    .map(key => `${key} ${options.order[key]}`)
                    .join(", ")}`;
            }
            if ((options.skip && options.take)) {
                query += ` OFFSET ${options.skip} LIMIT ${options.take}`;
            }
            else if (options.skip) {
                query += ` OFFSET ${options.skip}`;
            }
            else if (options.take) {
                query += ` LIMIT ${options.take}`;
            }
            return this.runQuery(query);
        });
    }
    findOne(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `SELECT * FROM ${this.tableName}`;
            if (options.where && Object.keys(options.where).length > 0) {
                ` WHERE ${Object.keys(options.where)
                    .map(function (key) {
                    if (typeof options.where[key] === 'string') {
                        `${key} = '${options.where[key]}'`;
                    }
                    else {
                        `${key} = ${options.where[key]}`;
                    }
                })
                    .join(" AND ")}`;
            }
            else {
                query += "";
            }
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
            if (options.where && Object.keys(options.where).length > 0) {
                query += " WHERE " + Object.keys(options.where)
                    .map(function (key) {
                    if (typeof options.where[key] === 'string') {
                        return key + " = '" + options.where[key] + "'";
                    }
                    else {
                        return key + " = " + options.where[key];
                    }
                })
                    .join(" AND ");
            }
            else {
                query += "";
            }
            return this.runQuery(query);
        });
    }
}
exports.Model = Model;
