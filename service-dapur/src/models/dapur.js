const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Dapur = sequelize.define('Dapur', {
    id_dapur: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_dapur: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lokasi: {
        type: DataTypes.STRING,
        allowNull: true
    },
    kapasitas_porsi: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'dapurs',
    timestamps: true 
});

module.exports = Dapur;