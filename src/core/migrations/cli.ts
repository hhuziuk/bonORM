import yargs from 'yargs';
import { generateMigration, runMigration, rollbackMigration } from './createMigration'

yargs
    .command('generate migration', 'Generate a new migration', {}, generateMigration)
    .command('up migration', 'Apply a migration', {}, runMigration)
    .command('down migration', 'Rollback a migration', {}, rollbackMigration)
    .argv;