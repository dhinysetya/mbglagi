const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Shipment = sequelize.define('Shipment', {
    id_shipment: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_sekolah: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    id_dapur: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    id_menu: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    jumlah_porsi: {
    type: DataTypes.INTEGER,
    defaultValue: 0
    },
    status_kirim: {
        type: DataTypes.ENUM('Persiapan', 'Memasak', 'Perjalanan', 'Diterima', 'Gagal'),
        defaultValue: 'Persiapan'
    },
    waktu_sampai: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'shipments',
    timestamps: true
});

module.exports = Shipment;