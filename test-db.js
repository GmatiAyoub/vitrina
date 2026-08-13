require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const net = require('net');
const { Client } = require('pg');

const HOST = process.env.DB_HOST;
const PORT = Number(process.env.DB_PORT);

console.log('--- Config lue depuis .env ---');
console.log('HOST:', HOST);
console.log('PORT:', PORT);
console.log('USER:', process.env.DB_USER);
console.log('');

// Étape 1 : résolution DNS pure
dns.lookup(HOST, { all: true }, (err, addresses) => {
  console.log('--- Résolution DNS ---');
  if (err) {
    console.error('❌ Erreur DNS :', err.message);
  } else {
    console.log(addresses);
  }
  console.log('');

  // Étape 2 : connexion TCP brute (sans SSL, sans pg) pour isoler le blocage
  console.log('--- Test TCP brut (sans SSL) ---');
  const socket = net.createConnection({ host: HOST, port: PORT, family: 4, timeout: 8000 });

  socket.on('connect', () => {
    console.log('✅ TCP brut connecté avec succès.');
    socket.end();
    testPg();
  });

  socket.on('timeout', () => {
    console.error('❌ TCP brut : timeout.');
    socket.destroy();
    testPg();
  });

  socket.on('error', (e) => {
    console.error('❌ TCP brut erreur :', e.message);
    testPg();
  });
});

// Étape 3 : test complet via pg (avec SSL)
function testPg() {
  console.log('');
  console.log('--- Test pg (avec SSL) ---');
  const client = new Client({
    host: HOST,
    port: PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
  require: true,
  rejectUnauthorized: false,
  minVersion: 'TLSv1.2',
  maxVersion: 'TLSv1.3',
  servername: HOST, // force le bon SNI
},
  });

  client
    .connect()
    .then(() => {
      console.log('✅ pg connecté avec succès !');
      return client.end();
    })
    .catch((err) => {
      console.error('❌ pg échec :', err.message);
      process.exit(1);
    });
}