require('dotenv').config();
const pgp = require('pg-promise')();

const databaseUrl = new URL(process.env.DATABASE_URL);
const newDbName = databaseUrl.pathname.split('/')[1];
databaseUrl.pathname = '/';
const cn = databaseUrl.toString();
const db = pgp(cn);
const createDb = `CREATE DATABASE ${newDbName}`;

db.none(createDb);
