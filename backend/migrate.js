require('dotenv').config();
const db = require('./db');
console.log('start migrate');
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
console.log('table: ', table);

const newTable = async () => {
  console.log('newTable start');

  const result = await db.none(table);
  console.log('result', result);
  console.log('end');
  return result;
};

newTable();
