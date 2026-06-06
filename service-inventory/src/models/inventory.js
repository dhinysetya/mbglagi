const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Inventory = sequelize.define('Inventory', {
    id_inventory: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_dapur: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    nama_bahan: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    stok: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
        defaultValue: 0.00
    },
    satuan: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }
}, {
    tableName: 'inventories',
    timestamps: true
});

module.exports = Inventory;