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
exports.rollbackMigration = exports.runMigration = exports.runQuery = exports.generateMigration = void 0;
const fs_1 = __importDefault(require("fs"));
const path = __importStar(require("path"));
const connection_1 = require("../connection/connection");
const generateMigration = (argv) => {
    const path = argv.path || '.';
    const fileName = `MigrationV${new Date().getTime()}`;
    const createFileName = `${path}/${fileName}.ts`;
    const migrationFile = `
import {MigrationInterface} from "bonorm"
export class ${fileName} implements MigrationInterface {
    migrationName = '${fileName}';
    public async up() {
        // Your migration logic
    }
    public async down() {
        // Your rollback logic
    }
}
export { ${fileName} as Migration };`;
    fs_1.default.writeFileSync(createFileName, migrationFile);
    console.log(`Migration ${createFileName} generated successfully.`);
};
exports.generateMigration = generateMigration;
const runQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, connection_1.connection)(query);
});
exports.runQuery = runQuery;
const runMigration = (argv) => __awaiter(void 0, void 0, void 0, function* () {
    const MigrationModule = require(path.resolve(argv.path));
    const migration = new MigrationModule.Migration();
    yield migration.up();
});
exports.runMigration = runMigration;
const rollbackMigration = (argv) => __awaiter(void 0, void 0, void 0, function* () {
    const MigrationModule = require(path.resolve(argv.path));
    const migration = new MigrationModule.Migration();
    yield migration.down();
});
exports.rollbackMigration = rollbackMigration;
