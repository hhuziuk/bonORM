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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const pgConfig_1 = require("../../../../../../configs/pgConfig");
const dbError_1 = __importDefault(require("../errors/dbError"));
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
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
                console.log("Connected to the database");
                return res;
            }
            catch (err) {
                dbError_1.default.QueryError(err);
                throw err; // Rethrow the error after handling
            }
        });
    }
    find(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let query = `SELECT ${((_a = options.select) === null || _a === void 0 ? void 0 : _a.join(', ')) || '*'} FROM ${this.tableName}`;
            if (options.relations && options.relations.length > 0) {
                query += ` LEFT JOIN ${options.relations.join(" LEFT JOIN ")}`;
            }
            if (options.where && Object.keys(options.where).length > 0) {
                query += ` WHERE ${Object.entries(options.where)
                    .map(([key, value]) => typeof value === 'string' ? `${key} = '${value}'` : `${key} = ${value}`)
                    .join(" AND ")}`;
            }
            if (options.order && Object.keys(options.order).length > 0) {
                query += ` ORDER BY ${Object.entries(options.order)
                    .map(([key, value]) => `${key} ${value}`)
                    .join(", ")}`;
            }
            if (options.skip !== undefined && options.take !== undefined) {
                query += ` OFFSET ${options.skip} LIMIT ${options.take}`;
            }
            else if (options.skip !== undefined) {
                query += ` OFFSET ${options.skip}`;
            }
            else if (options.take !== undefined) {
                query += ` LIMIT ${options.take}`;
            }
            return this.runQuery(query);
        });
    }
    findOne(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `SELECT * FROM ${this.tableName}`;
            if (options.where && Object.keys(options.where).length > 0) {
                query += ` WHERE ${Object.entries(options.where)
                    .map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : value}`)
                    .join(" AND ")}`;
            }
            return this.runQuery(query);
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data || Object.keys(data).length === 0) {
                dbError_1.default.EmptyQuery();
            }
            // Перевірка на існування запису за назвою
            const checkQuery = `SELECT * FROM ${this.tableName} WHERE name = '${data.name}'`;
            const checkQueryResult = yield this.runQuery(checkQuery);
            if (checkQueryResult.rows.length > 0) {
                dbError_1.default.ExistingDataError(data.name);
            }
            // Створення запису
            const { id } = data, restData = __rest(data, ["id"]); // Деструктуризація, щоб відокремити значення "id" від інших даних
            const columns = Object.keys(restData).join(', ');
            const values = Object.values(restData)
                .map(value => typeof value === 'string' ? `'${value}'` : value)
                .join(', ');
            // Валідація даних перед створенням запису
            const entityInstance = (0, class_transformer_1.plainToClass)(Model, data);
            const errors = yield (0, class_validator_1.validate)(entityInstance);
            if (errors.length > 0) {
                console.error(`Validation errors for creating record:`, errors);
                throw new Error(`Validation error occurred while creating the record.`);
            }
            const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${values});`;
            return this.runQuery(query);
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // This function needs to be implemented based on your requirements
            throw new Error("Method not implemented.");
        });
    }
    delete(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `DELETE FROM ${this.tableName}`;
            if (options.where && Object.keys(options.where).length > 0) {
                query += ` WHERE ${Object.entries(options.where)
                    .map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : value}`)
                    .join(" AND ")}`;
            }
            return this.runQuery(query);
        });
    }
}
exports.Model = Model;
