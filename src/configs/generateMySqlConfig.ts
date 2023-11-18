import fs from "fs";

export const generateMySqlConfig = (argv: any) => {
    const path = argv.path || '.';
    const createFileName = `${path}/mySqlConfig.ts`;
    const configFile = `
import {createPool} from 'mysql';
export const mySqlConfig  = createPool({
    // connectionLimit : 10,
    host: 'your data',
    user: 'your data',
    password: 'your data',
    database: 'your data'
});
  `;
    fs.writeFileSync(createFileName, configFile);
    console.log(`Configuration ${createFileName} generated successfully.`);
};