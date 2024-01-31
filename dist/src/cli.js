"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const createMigration_1 = require("./core/migrations/createMigration");
const generateMySqlConfig_1 = require("./configs/generateMySqlConfig");
const generatePgConfig_1 = require("./configs/generatePgConfig");
yargs_1.default
    .command('generate:migration <path>', 'Generate a new migration', {}, (argv) => (0, createMigration_1.generateMigration)(argv))
    .command('up:migration <path>', 'Apply a migration', {}, (argv) => (0, createMigration_1.runMigration)(argv))
    .command('down:migration <path>', 'Rollback a migration', {}, (argv) => (0, createMigration_1.rollbackMigration)(argv))
    .command('create:pgConfig <path>', 'Create new configuration file for PostgreSQL', {}, (argv) => (0, generatePgConfig_1.generatePgConfig)(argv))
    .command('create:mySqlConfig <path>', 'Create new configuration file for MySQL', {}, (argv) => (0, generateMySqlConfig_1.generateMySqlConfig)(argv))
    .argv;
