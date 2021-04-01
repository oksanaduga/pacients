require('dotenv').config();
const client = require('./db');
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

  client.query(table, (err, res) => {
    if (err) throw err;
    console.log('res', res);
    console.log('end');
    client.end();
  });

};

newTable();
