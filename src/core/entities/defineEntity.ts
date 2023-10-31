import {Pool} from "pg";

const pool = new Pool()
const createTableSql = async function(schemaName: string, schema: any){
    const {column, type, attributes, options} = schema;


}