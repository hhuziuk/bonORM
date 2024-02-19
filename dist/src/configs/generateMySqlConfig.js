"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMySqlConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const generateMySqlConfig = (argv) => {
    const path = argv.path || '.';
    const createFileName = `${path}/mySqlConfig.ts`;
    const configFile = `
import { Connection, createConnection } from 'mysql2/promise';
const mySqlConfig = () => {
    return createConnection({
        host: 'your data',
        user: 'your data',
        port: 'your port',
        password: 'your data',
        database: 'your data'
    });
};
export default {mySqlConfig};
  `;
    fs_1.default.writeFileSync(createFileName, configFile);
    console.log(`Configuration ${createFileName} generated successfully.`);
};
exports.generateMySqlConfig = generateMySqlConfig;
