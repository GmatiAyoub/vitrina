require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { require: true, rejectUnauthorized: false },
  connectionTimeoutMillis: 8000,
});

console.log('Tentative de connexion...');
client
  .connect()
  .then(() => {
    console.log('✅ Connecté avec succès !');
    return client.end();
  })
  .catch((err) => {
    console.error('❌ Échec :', err.message);
    process.exit(1);
  });