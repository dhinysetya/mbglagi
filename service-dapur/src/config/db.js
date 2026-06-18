const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3308, // <-- TAMBAHKAN BARIS INI
    dialect: 'mysql',
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('✅ Koneksi database Dapur berhasil.');
  })
  .catch(err => {
    console.error('❌ Gagal koneksi ke database Dapur:', err.message);
  });

module.exports = sequelize;