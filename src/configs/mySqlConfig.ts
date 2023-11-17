import {createPool} from 'mysql';

export const mySqlConfig  = createPool({
    // connectionLimit : 10,
    host: 'example.org',
    user: 'bob',
    password: 'secret',
    database: 'my_db'
});