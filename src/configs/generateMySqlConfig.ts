import fs from "fs";

export const generateMySqlConfig = (argv: any) => {
    const path = argv.path || '.';
    const createFileName = `${path}/mySqlConfig.ts`;
    const configFile = `
import { Connection, createConnection } from 'mysql2/promise';
const mySqlConfig = () => {
    return createConnection({
        host: 'your data',
        user: 'your data',
        port: 'your port',
        password: 'your data',
        database: 'your data'
    });
};
export default {mySqlConfig};
  `;
    fs.writeFileSync(createFileName, configFile);
    console.log(`Configuration ${createFileName} generated successfully.`);
};