const pgp = require('pg-promise')();

const cn = process.env.DATABASE_URL;
const db = pgp(cn);
console.log('cn: ', cn);
console.log('db: ', db);
module.exports = db;
