const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Sekolah = sequelize.define('Sekolah', {
    id_sekolah: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    npsn: { 
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false 
    },
    nama_sekolah: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    alamat_sekolah: { 
        type: DataTypes.TEXT 
    },
    jenjang: { 
        type: DataTypes.ENUM('SD', 'SMP', 'SMA'),
        allowNull: false
    },
    jumlah_siswa: { 
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, { 
    tableName: 'sekolahs', 
    timestamps: true 
});

module.exports = Sekolah;