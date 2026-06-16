const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    }
);

sequelize.authenticate()
    .then(() => {
        console.log(`Koneksi database [${process.env.DB_NAME}] berhasil.`);
    })
    .catch(err => {
        console.error(`Gagal koneksi ke database [${process.env.DB_NAME}]:`, err.message);
    });

module.exports = sequelize;