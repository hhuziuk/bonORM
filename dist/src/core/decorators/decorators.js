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
exports.Entity = exports.PrimaryGeneratedColumn = exports.Column = void 0;
require("reflect-metadata");
const dbError_1 = __importDefault(require("../errors/dbError"));
const pgConfig_1 = require("../../../../../../configs/pgConfig");
const class_validator_1 = require("class-validator");
const columnsMetadataKey = "columns";
function Column(options = {}) {
    return (target, propertyKey) => {
        const columns = Reflect.getMetadata(columnsMetadataKey, target) || [];
        Reflect.defineMetadata(columnsMetadataKey, [...columns, { propertyKey, options }], target);
    };
}
exports.Column = Column;
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
                yield this.runQuery(query); // Create the table
                // Validate the table data using class-validator
                const targetConstructor = Reflect.getMetadata('design:paramtypes', target);
                const instance = new (target.bind.apply(target, [null].concat(targetConstructor)))();
                const schema = yield (0, class_validator_1.validate)(instance);
                if (schema.length > 0) {
                    // Handle validation errors
                    console.error("Validation errors:", schema);
                    throw new Error("Validation error occurred while creating the table.");
                }
            });
        };
        target.prototype.createModel = createModel;
        target.prototype.runQuery = function (query) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const client = yield pgConfig_1.pgConfig.connect();
                    const res = yield client.query(query);
                    client.release();
                    console.log("connected to the database");
                    return res;
                }
                catch (err) {
                    dbError_1.default.QueryError(err);
                }
            });
        };
        createModel.call(target.prototype);
    };
}
exports.Entity = Entity;
