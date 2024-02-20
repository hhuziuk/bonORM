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
exports.connection = void 0;
const dbError_1 = __importDefault(require("../errors/dbError"));
function connection(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (process.env.DB_TYPE === 'postgres') {
                const pgConfigPath = "../../../../../../configs/pgConfig";
                if (yield fileExists(pgConfigPath)) {
                    const { pgConfig } = yield Promise.resolve().then(() => __importStar(require(pgConfigPath)));
                    const client = yield pgConfig.connect();
                    try {
                        const res = yield client.query(query);
                        console.log("Connected to the PostgreSQL database");
                        return res;
                    }
                    finally {
                        client.release();
                    }
                }
                else {
                    throw new Error("PostgreSQL configuration file not found");
                }
            }
            else if (process.env.DB_TYPE === 'mysql') {
                const mySqlConfigPath = "../../../../../../configs/mySqlConfig";
                if (yield fileExists(mySqlConfigPath)) {
                    const { mySqlConfig } = yield Promise.resolve().then(() => __importStar(require(mySqlConfigPath)));
                    const connection = yield mySqlConfig();
                    try {
                        const [rows, fields] = yield connection.execute(query);
                        console.log("Connected to the MySQL database");
                        return { rows, fields };
                    }
                    finally {
                        yield connection.end();
                    }
                }
                else {
                    throw new Error("MySQL configuration file not found");
                }
            }
            else {
                dbError_1.default.DbTypeError();
            }
        }
        catch (err) {
            throw err;
        }
    });
}
exports.connection = connection;
function fileExists(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Promise.resolve().then(() => __importStar(require(path)));
            return true;
        }
        catch (err) {
            if (err.code === 'MODULE_NOT_FOUND') {
                return false;
            }
            throw err;
        }
    });
}
