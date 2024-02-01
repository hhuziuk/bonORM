"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Model = exports.PrimaryGeneratedColumn = exports.Entity = exports.Column = void 0;
const pgConfig_1 = require("../../../../../../configs/pgConfig");
const dbError_1 = __importDefault(require("../errors/dbError"));
const console = __importStar(require("console"));
function Column(options = {}) {
    return function (target, key) {
        const columns = target._columns || {};
        columns[key] = options;
        target._columns = columns;
    };
}
exports.Column = Column;
function Entity(tableName) {
    return function (target) {
        target.prototype._tableName = tableName;
        target.prototype.createModel = function () {
            return __awaiter(this, void 0, void 0, function* () {
                const columns = Object.keys(this._columns).map(attribute => {
                    const { type, unique, allowNull, defaultValue, autoIncrement, primaryKey } = this._columns[attribute];
                    if (!type) {
                        dbError_1.default.QueryError(`Type for attribute ${attribute} is undefined.`);
                    }
                    let columnDefinition = `${attribute} ${type}`;
                    columnDefinition += (unique) ? " UNIQUE" : "";
                    columnDefinition += (!allowNull) ? " NOT NULL" : "";
                    if (defaultValue) {
                        (typeof defaultValue === 'string') ? columnDefinition += ` DEFAULT '${defaultValue}'` : columnDefinition += ` DEFAULT ${defaultValue}`;
                    }
                    columnDefinition += (primaryKey) ? " PRIMARY KEY" : "";
                    columnDefinition += (autoIncrement && type === 'INTEGER') ? " GENERATED ALWAYS AS IDENTITY" : "";
                    return columnDefinition;
                });
                let query = `CREATE TABLE IF NOT EXISTS ${this._tableName} (${columns.join(",")});`;
                return this.runQuery(query);
            });
        };
        const instance = new target();
        instance.createModel();
    };
}
exports.Entity = Entity;
function PrimaryGeneratedColumn() {
    return function (target, key) {
        target._primaryColumn = key;
    };
}
exports.PrimaryGeneratedColumn = PrimaryGeneratedColumn;
class Model {
    constructor(tableName) {
        this._columns = {};
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
