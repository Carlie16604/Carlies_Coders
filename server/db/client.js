const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/carlies_coders_db');

module.exports = client;
