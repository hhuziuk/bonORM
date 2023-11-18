import fs from "fs";

export const generatePgConfig = (argv: any) => {
    const path = argv || '.';
    const createFileName = `pgConfig.ts`;
    const configFile = `
        import { Pool } from 'pg';
        export const pgConfig = new Pool({
            user: 'your data',
            host: 'your data',
            database: 'your data',
            password: 'your data',
            port: 5432,
        });
  `;
    fs.writeFileSync(createFileName, configFile);
    console.log(`Configuration ${createFileName} generated successfully.`);
};