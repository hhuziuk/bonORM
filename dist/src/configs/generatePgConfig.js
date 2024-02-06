"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePgConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const generatePgConfig = (argv) => {
    const path = argv.path || '.';
    const createFileName = `${path}/pgConfig.ts`;
    const configFile = `
import { Pool } from 'pg';
export const pgConfig = new Pool({
      user: 'your data',
      host: 'your data',
      database: 'your data',
      password: 'your data',
      port: 5432,
});
  `;
    fs_1.default.writeFileSync(createFileName, configFile);
    console.log(`Configuration ${createFileName} generated successfully.`);
};
exports.generatePgConfig = generatePgConfig;
