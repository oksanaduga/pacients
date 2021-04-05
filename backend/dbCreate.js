require('dotenv').config();

//const { Client } = require('pg');
var pgtools = require('pgtools');

pgtools.createdb({
  user: 'postgres',
  password: '',
  port: 5432,
  host: 'localhost'
}, 'myapp_test_db', function (err, res) {
  if (err) {
    console.error(err);
    process.exit(-1);
  }
  console.log(res);
});
