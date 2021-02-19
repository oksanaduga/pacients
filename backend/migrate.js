require('dotenv').config();
const db = require('./db');

const table = `
  CREATE TABLE IF NOT EXISTS users (
    id serial,
    name varchar(255),
    birth_date date,
    gender varchar(1),
    living_address text,
    insurance_policy varchar(255)
  );
`;

const newTable = async () => await db.none(table);

module.exports = newTable;
