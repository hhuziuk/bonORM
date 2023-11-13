import yargs, { Arguments } from 'yargs';
import { generateMigration, runMigration, rollbackMigration } from './createMigration';

yargs
    .command('generate:migration', 'Generate a new migration', {}, generateMigration)
    .command('up:migration', 'Apply a migration', {}, (argv: Arguments) => runMigration(argv.name as string))
    .command('down:migration', 'Rollback a migration', {}, (argv: Arguments) => rollbackMigration(argv.name as string))
    .argv;
