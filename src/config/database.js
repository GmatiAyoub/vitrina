require('dotenv').config();

// Supabase (et Neon) exigent une connexion SSL, même en développement,
// car la base est distante (cloud) et non locale.
// On l'active automatiquement dès que l'host n'est pas une base locale.
const isLocalHost = ['localhost', '127.0.0.1'].includes(process.env.DB_HOST);

const cloudSSL = {
  dialectOptions: {
    connectionTimeoutMillis: 10000,
    ssl: { require: true, rejectUnauthorized: false },
  },
};

const base = {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    connectionTimeoutMillis: 10000, // 10s max, sinon erreur explicite au lieu d'un blocage silencieux
  },
  pool: {
    acquire: 10000,
  },
};

module.exports = {
  development: process.env.DATABASE_URL
    ? { use_env_variable: 'DATABASE_URL', ...base, ...cloudSSL }
    : {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        ...base,
        ...(isLocalHost ? {} : cloudSSL),
      },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_NAME}_test`,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    ...base,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    ...base,
    ...cloudSSL,
  },
};