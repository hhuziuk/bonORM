import {MigrationInterface} from "./migrationInterface";
import {QueryResult} from "pg";


export class MigrationV0001 implements MigrationInterface{
    migrationName = 'MigrationV0001';
    public async up(query: QueryResult){

    }

    public async down(query: QueryResult){

    }
}
