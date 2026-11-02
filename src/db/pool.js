const { Pool } = require('pg');
const config = require('../config');

// Heroku Postgres requires TLS (self-signed cert); local dev does not.
const ssl = process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false;

module.exports = new Pool({ connectionString: config.databaseUrl, ssl });
