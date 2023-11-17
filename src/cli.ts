import yargs, { Arguments } from 'yargs';
import { generateMigration, runMigration, rollbackMigration } from './core/migrations/createMigration';
import {generateMySqlConfig} from "./configs/generateMySqlConfig";
import {generatePgConfig} from "./configs/generatePgConfig";

yargs
    .command('generate:migration <path>', 'Generate a new migration', {}, (argv: Arguments) => generateMigration(argv.path))
    .command('up:migration <name>', 'Apply a migration', {}, (argv: Arguments) => runMigration(argv.name as string))
    .command('down:migration <name>', 'Rollback a migration', {}, (argv: Arguments) => rollbackMigration(argv.name as string))
    .command('create:pgConfig <path>', 'Create new configuration file for PostgreSQL', {}, (argv: Arguments) => generatePgConfig(argv.path))
    .command('create:mySqlConfig <path>', 'Create new configuration file for MySQL', {}, (argv: Arguments) => generateMySqlConfig(argv.path))
    .argv;
