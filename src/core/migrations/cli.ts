import yargs, { Arguments } from 'yargs';
import { generateMigration, runMigration, rollbackMigration } from './createMigration';

yargs
    .command('generate:migration <path>', 'Generate a new migration', {}, (argv: Arguments) => generateMigration(argv.path))
    .command('up:migration <name>', 'Apply a migration', {}, (argv: Arguments) => runMigration(argv.name as string))
    .command('down:migration <name>', 'Rollback a migration', {}, (argv: Arguments) => rollbackMigration(argv.name as string))
    .argv;
