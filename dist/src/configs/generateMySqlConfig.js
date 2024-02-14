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
import {createPool} from 'mysql';

export DB_TYPE = mysql
export const mySqlConfig  = createPool({
    // connectionLimit : 10,
    host: 'your data',
    user: 'your data',
    password: 'your data',
    database: 'your data'
});
  `;
    fs_1.default.writeFileSync(createFileName, configFile);
    console.log(`Configuration ${createFileName} generated successfully.`);
};
exports.generateMySqlConfig = generateMySqlConfig;
