const log = require('../services/logging');

const mysql = require('mysql2/promise')
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'azerty31',
  database: 'gamein'
});

module.exports = pool;

log.info("INIT", "Connecting to MySQL")