import yargs, { Arguments } from 'yargs';
import { generateMigration, runMigration, rollbackMigration } from './core/migrations/createMigration';
import {generateMySqlConfig} from "./configs/generateMySqlConfig";
import {generatePgConfig} from "./configs/generatePgConfig";

yargs
    .command('generate:migration <path>', 'Generate a new migration', {}, (argv: Arguments) => generateMigration(argv))
    .command('up:migration <path>', 'Apply a migration', {}, (argv: Arguments) => runMigration(argv))
    .command('down:migration <path>', 'Rollback a migration', {}, (argv: Arguments) => rollbackMigration(argv))
    .command('create:pgConfig <path>', 'Create new configuration file for PostgreSQL', {}, (argv: Arguments) => generatePgConfig(argv))
    .command('create:mySqlConfig <path>', 'Create new configuration file for MySQL', {}, (argv: Arguments) => generateMySqlConfig(argv))
    .argv;
